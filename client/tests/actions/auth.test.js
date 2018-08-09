import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as authActions from '../../actions/auth';

import {notAuthenticated, authenticated} from '../fixtures/auth';
import {errorStateEmail, noErrorState, undefinedError, errorStateTokenInvalid} from '../fixtures/formValidation';

import Token from '../../modules/Token';
jest.mock('../../modules/Token');

import UserRegisteredState from '../../modules/UserRegisteredState';
jest.mock('../../modules/UserRegisteredState');

import axiosMock from '../mocks/axios-mock';

const createMockStore = configureMockStore([thunk]);
const store = createMockStore();

beforeEach(() => {
  store.clearActions();

  Token.set.mockClear();
  Token.remove.mockClear();

  UserRegisteredState.setUserRegistered.mockClear();
});

// LOGIN
test('login - should setup auth action object with user info and call Token.set', () => {
  const action = authActions.login(authenticated);
  expect(action).toEqual({type: 'LOGIN', user: authenticated});
  expect(Token.set).toHaveBeenCalledTimes(1);
});

// LOGOUT
test('logout - should setup auth action object without user info and call Token.remove', () => {
  const action = authActions.logout();
  expect(action).toEqual({type: 'LOGOUT'});
  expect(Token.remove).toHaveBeenCalledTimes(1);
});

// START LOGOUT
test('startLogout - should setup auth action object without user info and call Token.remove', (done) => {
  const unsubscribe = store.subscribe(function () {
    expect(store.getActions()).toEqual([{type: 'LOGOUT'}]);
    unsubscribe();
    done();
  });

  store.dispatch(authActions.startLogout());
});

// START LOGIN WITH VALID DATA
test('startLogin with valid form data - should setup auth action object from login with user info and no form validation errors', () => {
  const validFormData = true;

  return store.dispatch(authActions.startLogin(validFormData)).then(() => {
    expect(store.getActions()).toContainEqual({type: 'LOGIN', user: authenticated.user});
    expect(store.getActions()).toContainEqual({type: 'HIDE_FORM_VALIDATION_ERROR'});
  })
});

// START LOGIN WITH ERROR DATA
test('startLogin with error form data - should setup auth action object from login with form validation error', () => {
  const invalidFormData = false;

  return store.dispatch(authActions.startLogin(invalidFormData)).then(() => {
    expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errorStateEmail});
    expect(Token.set).not.toHaveBeenCalled();
  });
});

// START REGISTER WITH VALID DATA
test('startRegister with valid form data - should setup auth action object from register with user info and no form validation errors', () => {
  const validFormData = true;

  return store.dispatch(authActions.startRegister(validFormData)).then(() => {
    expect(store.getActions()).toContainEqual({type: 'LOGIN', user: authenticated.user});
    expect(store.getActions()).toContainEqual({type: 'HIDE_FORM_VALIDATION_ERROR'});
    expect(UserRegisteredState.setUserRegistered).toHaveBeenCalledTimes(1);
  })
});

// START REGISTER WITH ERROR DATA
test('startRegister with error form data - should setup auth action object from register with form validation error', () => {
  const invalidFormData = false;

  return store.dispatch(authActions.startLogin(invalidFormData)).then(() => {
    expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errorStateEmail});
    expect(Token.set).not.toHaveBeenCalled();
  });
});

// START AUTHENTICATE - LOGOUT IF NO TOKEN
test('startAuthenticate if no token - should setup auth action object without user info and call Token.remove', (done) => {
  Token.getToken = jest.fn(() => false);

  const unsubscribe = store.subscribe(() => {
    expect(store.getActions()).toEqual([{type: 'LOGOUT'}]);
    expect(Token.getToken).toHaveBeenCalled();
    unsubscribe();
    done();
  });

  store.dispatch(authActions.startAuthenticate(jest.fn()));
});

// START AUTHENTICATE - LOGIN IF TOKEN VALID
test('startAuthenticate if token valid - should setup auth action object with user info and call Token.set', () => {
  Token.getToken = jest.fn(() => 'validToken');

  return store.dispatch(authActions.startAuthenticate(jest.fn())).then(() => {
    expect(store.getActions()).toEqual([{
      type: 'AUTHENTICATE',
      user: authenticated.user
    }]);
  })
});

// START AUTHENTICATE - LOGOUT IF TOKEN DAMAGED OR EXPIRED
test('startAuthenticate if token damaged - should setup auth action object without user info and call Token.remove', () => {
  Token.getToken = jest.fn(() => 'invalidToken');

  return store.dispatch(authActions.startAuthenticate(jest.fn())).then(() => {
    expect(store.getActions()).toEqual([{type: 'LOGOUT'}]);
  })
});

// START SOCIAL AUTHENTICATE WITH VALID DATA
test('startSocialAuthenticate via facebook with valid token - should setup auth action object with user info and no form validation errors', () => {
  const socNetwork = 'facebook';
  const validToken = 'validToken';

  return store.dispatch(authActions.startSocialAuthenticate(socNetwork, validToken)).then(() => {
    expect(store.getActions()).toContainEqual({type: 'LOGIN', user: authenticated.user});
    expect(store.getActions()).toContainEqual({type: 'HIDE_FORM_VALIDATION_ERROR'});
    expect(UserRegisteredState.setUserRegistered).toHaveBeenCalledTimes(1);
  })
});

// START SOCIAL AUTHENTICATE WITH INVALID DATA
test('startRegister with invalid token - should setup auth action object with form validation error', async () => {
  const socNetwork = 'facebook';
  const invalidToken = 'invalidToken';

  await store.dispatch(authActions.startSocialAuthenticate(socNetwork, invalidToken));
  expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errorStateTokenInvalid});
  expect(Token.set).not.toHaveBeenCalled();
});

// START SOCIAL AUTHENTICATE - MISS PARAMETER PASSING
test('startRegister tries to launch without one of the parameters - should setup auth action object with validation error', async () => {
  const socNetwork = undefined;
  const validToken = 'validToken';

  await store.dispatch(authActions.startSocialAuthenticate(socNetwork, validToken));
  expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: undefinedError});
});