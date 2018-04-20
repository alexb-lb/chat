import axios from 'axios';
import Token from '../modules/Token';
import {showFormValidationError, hideFormValidationError} from '../actions/formValidation';

/**
 * LOGIN
 * @param user - object
 * @returns {{type: string, user: object}}
 */
export const login = (user) => {
  Token.set(user.token);
  return {type: 'LOGIN', user}
};

export const startLogin = (formData = '') => {
  return (dispatch, getState) => {
    const params = {
      method: 'post',
      url: '/login',
      data: formData
    };

    return axios(params)
      .then(({data}) => {
        dispatch(login(data.user));
        dispatch(hideFormValidationError());
      })
      .catch((err) => {
        dispatch(showFormValidationError(err.response.data));
      });
  };
};


export const startRegister = (formData = '') => {
  return (dispatch, getState) => {
    const params = {
      method: 'post',
      url: '/register',
      data: formData
    };

    return axios(params)
      .then(({data}) => {
        dispatch(login(data.user));
        dispatch(hideFormValidationError());
      })
      .catch((err) => {
        console.log(err);
        dispatch(showFormValidationError(err.response.data));
      });
  };
};

/**
 * LOGOUT action
 */
export const logout = () => {
  Token.remove();
  return {type: 'LOGOUT'}
};

export const startLogout = () => {
  return (dispatch) => dispatch(logout())
};


/**
 * AUTHENTICATE action
 */
export const startAuthenticate = () => {
  return (dispatch) => {
    const token = Token.getToken();

    if (!token) return dispatch(logout());

    const reqParams = {
      method: 'post',
      url: '/auth',
      headers: {'Authorization': token}
    };

    return axios(reqParams)
      .then(({data}) => {
        if (!data.success) {
          dispatch(logout());
        } else {
          dispatch(login(data.user));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(logout());
      });
  }
};