const authReducerDefaultState = {
  user: false,
  redirectToReferrer: false
};

export default (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      // user obj: {_id: String, name: String, token: String)
      return {user: action.user, redirectToReferrer: true};
    case 'AUTHENTICATE':
      // difference between LOGIN and AUTHENTICATE is redirect.
      // If registered user wants to open "/register" page no need to redirect him to "/" main page
      return {user: action.user, redirectToReferrer: false};
    case 'LOGOUT':
      return {user: false, redirectToReferrer: false};
    default:
      return state;
  }
};