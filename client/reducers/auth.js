const authReducerDefaultState = {
  user: false
};


export default (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {user: action.user};
    case 'LOGOUT':
      return {user: false};
    default:
      return state;
  }
};