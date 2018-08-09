const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

import {authenticated} from '../fixtures/auth';
import {errorStateEmail, errorStateTokenInvalid} from '../fixtures/formValidation';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onPost('/api/v1.0/login').reply(reqData => {
  return new Promise((res, rej) => {
    if(!reqData.data){
      return rej({response: {data: errorStateEmail}})
    }

    return res([200, authenticated])
  });
});

mock.onPost('/api/v1.0/register').reply(reqData => {
  return new Promise((res, rej) => {
    if(!reqData.data){
      return rej({response: {data: errorStateEmail}})
    }

    return res([200, authenticated])
  });
});

mock.onPost('/api/v1.0/auth').reply(reqData => {
  return new Promise((res, rej) => {
    if(reqData.headers.Authorization !== 'validToken'){
      return rej({response: {data: errorStateTokenInvalid}})
    }

    return res([200, {success: true, message: 'OK', user: authenticated.user}])
  });
});

mock.onPost('/api/v1.0/auth/facebook').reply(reqData => {
  return new Promise((res, rej) => {
    if(reqData.headers.access_token !== 'validToken'){
      return rej({response: {data: errorStateTokenInvalid}})
    }

    return res([200, {success: true, message: 'OK', user: authenticated.user}])
  });
});

export default mock;