export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {user: action.user};
    case 'LOGOUT':
      return {user: false};
    default:
      return state;
  }
};