import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from "../../../../actions/auth";

export const Login = ({onChange, onSubmit, user, formValidation}) => (
  <form method="post" className="form form-register" onSubmit={onSubmit}>
    <h1>Login</h1>
    {
      !formValidation.success
      &&
      <p className="errorMessage">{formValidation.message}</p>
    }

    <input
      onChange={onChange}
      value={user.email}
      type="email"
      name="email"
      id="register-email"
      className={`${formValidation.errorInElement === 'email' && 'error'}`}
      placeholder="Email"
      tabIndex="2"
      autoCapitalize="off"
      autoCorrect="off"
    />

    <input
      onChange={onChange}
      value={user.password}
      type="password"
      name="password"
      className={`${formValidation.errorInElement === 'password' && 'error'}`}
      placeholder="Password"
      tabIndex="3"
      autoCapitalize="off"
      autoCorrect="off"
    />

    <button
      type="submit"
      className="btn fullwidth spinner_button"
      id="signup_button"
      tabIndex="4"
    >
      Login
    </button>
  </form>
);

export default Login;
//
// const mapDispatchToProps = (dispatch) => ({
//   startLogin: () => dispatch(startLogin())
// });
//
// export default connect(undefined, mapDispatchToProps)(LoginPage);