const formReducerDefaultState = {
  success: true,
  message: '',
  errorInElement: false
};

/** Expenses Reducer **/
export default (state = formReducerDefaultState, action) => {
  switch (action.type) {
    case 'SHOW_FORM_VALIDATION_ERROR':
      console.log('action.state', action.state);
      return action.state;
    case 'HIDE_FORM_VALIDATION_ERROR':
      return formReducerDefaultState;
    default:
      return state;
  }
};