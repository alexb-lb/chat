import axios from 'axios';

import Token from '../modules/Token';
import UserRegisteredState from '../modules/UserRegisteredState';
import {showFormValidationError, hideFormValidationError} from '../actions/formValidation';

const undefinedError = {
  success: false,
  message: 'Cannot connect to server',
  errorInElement: false
};

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
      url: '/api/v1.0/login',
      data: formData
    };

    return axios(params)
      .then(({data}) => {
        dispatch(login(data.user));
        dispatch(hideFormValidationError());
      })
      .catch(err => {
        let errorObj = undefinedError;
        if (err.response && err.response.data && err.response.data.message) {
          errorObj = err.response.data
        }
        dispatch(showFormValidationError(errorObj));
      });
  };
};

export const startRegister = (formData = '') => {
  return (dispatch, getState) => {
    const params = {
      method: 'post',
      url: '/api/v1.0/register',
      data: formData
    };

    return axios(params)
      .then(({data}) => {
        dispatch(login(data.user));
        dispatch(hideFormValidationError());

        UserRegisteredState.setUserRegistered();
      })
      .catch((err) => {
        let errorObj = undefinedError;
        if (err.response && err.response.data && err.response.data.message) {
          errorObj = err.response.data
        }
        dispatch(showFormValidationError(errorObj));
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
export const startAuthenticate = callback => {
  return (dispatch) => {
    const token = Token.getToken();

    if (!token) {
      dispatch(logout());
      return callback();
    }

    const reqParams = {
      method: 'post',
      url: '/api/v1.0/auth',
      headers: {'Authorization': token}
    };

    return axios(reqParams)
      .then(({data}) => {
        if (!data.success) {
          dispatch(logout());
        } else {
          dispatch(login(data.user));
        }

        callback();
      })
      .catch((err) => {
        console.log(err);
        dispatch(logout());
        callback();
      });
  }
};

/**
 * AUTHENTICATE via social networks
 */
export const startSocialAuthenticate = (socNetworkName, token) => {
  return (dispatch, getState) => {
    let authUrl = '';

    switch (socNetworkName) {
      case 'facebook':
        authUrl = '/api/v1.0/auth/facebook';
        break;
      case 'google':
        authUrl = '/api/v1.0/auth/google';
        break;
      case 'vkontakte':
        authUrl = '/api/v1.0/auth/vkontakte';
        break;
    }

    const reqParams = {
      method: 'post',
      url: authUrl,
      headers: {'access_token': token}
    };

    return axios(reqParams)
      .then(({data}) => {
        dispatch(login(data.user));
        dispatch(hideFormValidationError());

        UserRegisteredState.setUserRegistered();
      })
      .catch(err => {
        let errorObj = undefinedError;
        if (err.response && err.response.data && err.response.data.message) {
          errorObj = err.response.data
        }
        dispatch(showFormValidationError(errorObj));
      });
  };
};