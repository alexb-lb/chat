import {showFormValidationError, hideFormValidationError} from '../../actions/formValidation';

test('should setup formValidate action object with no value', () => {
  const action = hideFormValidationError();
  expect(action).toEqual({type: 'HIDE_FORM_VALIDATION_ERROR'});
});

test('should setup formValidate action object with error info', () => {
  const errInfo = {
    success: false,
    message: 'Please provide a correct email address.',
    errorInElement: 'email'
  };
  const action = showFormValidationError(errInfo);
  expect(action).toEqual({type: 'SHOW_FORM_VALIDATION_ERROR', state: errInfo});
});