import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as authActions from '../../actions/auth';

import {notAuthenticated, authenticated} from '../fixtures/auth';
import {errorState, noErrorState} from '../fixtures/formValidation';

import Token from '../../modules/Token';
jest.mock('../../modules/Token');

import axiosMock from '../mocks/axios-mock';

const createMockStore = configureMockStore([thunk]);
const store = createMockStore();

beforeEach(() => {
  store.clearActions();

  Token.set.mockClear();
  Token.remove.mockClear();
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
    expect(Token.remove).toHaveBeenCalledTimes(1);
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
    expect(Token.set).toHaveBeenCalledTimes(1);
  })
});

// START LOGIN WITH ERROR DATA
test('startLogin with error form data - should setup auth action object from login with form validation error', () => {
  const invalidFormData = false;

  return store.dispatch(authActions.startLogin(invalidFormData)).then(() => {
    expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errorState});
    expect(Token.set).not.toHaveBeenCalled();
  });
});

// START REGISTER WITH VALID DATA
test('startRegister with valid form data - should setup auth action object from register with user info and no form validation errors', () => {
  const validFormData = true;

  return store.dispatch(authActions.startRegister(validFormData)).then(() => {
    expect(store.getActions()).toContainEqual({type: 'LOGIN', user: authenticated.user});
    expect(store.getActions()).toContainEqual({type: 'HIDE_FORM_VALIDATION_ERROR'});
    expect(Token.set).toHaveBeenCalledTimes(1);
  })
});

// START REGISTER WITH ERROR DATA
test('startRegister with error form data - should setup auth action object from register with form validation error', () => {
  const invalidFormData = false;

  return store.dispatch(authActions.startLogin(invalidFormData)).then(() => {
    expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errorState});
    expect(Token.set).not.toHaveBeenCalled();
  });
});

// START AUTHENTICATE - LOGOUT IF NO TOKEN
test('startAuthenticate if no token - should setup auth action object without user info and call Token.remove', (done) => {
  Token.getToken = jest.fn(() => false);

  const unsubscribe = store.subscribe(function () {
    expect(store.getActions()).toEqual([{type: 'LOGOUT'}]);
    expect(Token.remove).toHaveBeenCalledTimes(1);
    unsubscribe();
    done();
  });

  store.dispatch(authActions.startAuthenticate());
});

// START AUTHENTICATE - LOGIN IF TOKEN VALID
test('startAuthenticate if token valid - should setup auth action object with user info and call Token.set', () => {
  Token.getToken = jest.fn(() => 'validToken');

  return store.dispatch(authActions.startAuthenticate()).then(() => {
    expect(store.getActions()).toEqual([{type: 'LOGIN', user: authenticated.user}]);
    expect(Token.set).toHaveBeenCalledTimes(1);
  })
});

// START AUTHENTICATE - LOGOUT IF TOKEN DAMAGED OR EXPIRED
test('startAuthenticate if token damaged - should setup auth action object without user info and call Token.remove', () => {
  Token.getToken = jest.fn(() => 'invalidToken');

  return store.dispatch(authActions.startAuthenticate()).then(() => {
    expect(store.getActions()).toEqual([{type: 'LOGOUT'}]);
    expect(Token.remove).toHaveBeenCalledTimes(1);
  })
});