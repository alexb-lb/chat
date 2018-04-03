export const login = (uid) => ({type: 'LOGIN', uid});

export const startLogin = () => {
  return () => {
    return 'POST to /register';
  };
};

// export const logout = (uid) => ({type: 'LOGOUT'});
//
// export const startLogout = () => {
//   return () => {
//     return firebase.auth().signOut();
//   };
// };