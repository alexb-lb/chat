import formValidationReducer from '../../reducers/formValidation';
import {noErrorState, errorState} from '../fixtures/formValidation';


test('should set default state without error messages', () => {
  const state = formValidationReducer(undefined, {type: '@@INIT'});
  expect(state).toEqual(noErrorState);
});


test('should return form validation object with error message', () => {
  const action = {
    type: 'SHOW_FORM_VALIDATION_ERROR',
    state: errorState
  };

  const state = formValidationReducer(noErrorState, action);
  expect(state).toEqual(errorState)
});


test('should return form validation object without error message', () => {
  const action = {type: 'HIDE_FORM_VALIDATION_ERROR'};

  const state = formValidationReducer(errorState, action);
  expect(state).toEqual(noErrorState)
});
