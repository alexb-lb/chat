import authReducer from '../../reducers/auth';
import {notAuthenticated, authenticated} from '../fixtures/auth';

test('should set default state without any authenticate info', () => {
  const state = authReducer(undefined, {type: '@@INIT'});
  expect(state).toEqual(notAuthenticated);
});

test('should set object with authenticated user info', () => {
  const action = {
    type: 'LOGIN',
    user: authenticated.user
  };

  const state = authReducer(notAuthenticated, action);
  expect(state).toEqual(authenticated);
});

test('should remove user info from authenticate object if user log out', () => {
  const action = {type: 'LOGOUT'};
  const state = authReducer(authenticated, action);
  expect(state).toEqual(notAuthenticated);
});