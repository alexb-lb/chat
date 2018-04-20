import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {login, logout, startLogout, startLogin} from '../../actions/auth';

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


test('should setup auth action object with user info and call Token.set', () => {
  const action = login(authenticated);
  expect(action).toEqual({type: 'LOGIN', user: authenticated});
  expect(Token.set).toHaveBeenCalledTimes(1);
});

test('should setup auth action object without user info and call Token.remove', () => {
  const action = logout();
  expect(action).toEqual({type: 'LOGOUT'});
  expect(Token.remove).toHaveBeenCalledTimes(1);
});

test('should setup auth action object without user info and call Token.remove', (done) => {
  const unsubscribe = store.subscribe(function () {
    expect(store.getActions()).toEqual([{type: 'LOGOUT'}]);
    expect(Token.remove).toHaveBeenCalledTimes(1);
    unsubscribe();
    done();
  });

  store.dispatch(startLogout());
});

test('should setup action object with form validation error', () => {
  const invalidFormData = false;

  return store.dispatch(startLogin(invalidFormData)).then(() => {
    expect(store.getActions()[0]).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errorState});
  });
});


test('should setup action object with user info and no form validation errors', () => {
  const validFormData = true;

  return store.dispatch(startLogin(validFormData)).then(() => {
    expect(store.getActions()).toContainEqual({type: 'LOGIN', user: authenticated.user});
    expect(store.getActions()).toContainEqual({type: 'HIDE_FORM_VALIDATION_ERROR'});
  })
});