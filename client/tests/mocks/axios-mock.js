const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

import {authenticated} from '../fixtures/auth';
import {errorState} from '../fixtures/formValidation';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onPost('/login').reply(reqData => {
  return new Promise((res, rej) => {
    if(!reqData.data){
      return rej({response: {data: errorState}})
    }

    return res([200, authenticated])
  });
});

export default mock;