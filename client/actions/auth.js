import axios from 'axios';
import Token from '../modules/Token';


/**
 * LOGIN action
 * @param uid
 */
export const login = (user) => {
  Token.set(user.token);
  return {type: 'LOGIN', user}
};

export const startLogin = () => {
  return () => {
    return 'POST to /login';
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
  return (dispatch) => {
    return () => dispatch(logout())
  }
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
      .then(result => {
        console.log('unpursed result ' + result);
        result = JSON.parse(result);
        console.log('parsed result ' + result);
        if (!result.success) return dispatch(logout());
        return dispatch(login(result.user))
      })
      .catch((err) => {
        console.log(err);
        return dispatch(logout());
      });
  }
};