const authReducerDefaultState = {
  user: false,
  redirectToReferrer: false
};

export default (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      // user obj: {_id: String, name: String, token: String)
      return {user: action.user, redirectToReferrer: true};
    case 'LOGOUT':
      return {user: false, redirectToReferrer: false};
    default:
      return state;
  }
};