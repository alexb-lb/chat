class UserRegisteredState {
  static setUserRegistered() {
    localStorage.setItem('userRegistered', true);
  }

  static isUserRegistered() {
    return localStorage.getItem('userRegistered') !== null;
  }
}

export default UserRegisteredState;