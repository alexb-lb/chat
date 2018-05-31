import React from 'react';
import {Link} from 'react-router-dom';

export const Login = ({onChange, onSubmit, user, formValidation}) => (
  <form method="post" className="form form-register" onSubmit={onSubmit}>
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

    <button type="submit">Login</button>

    <Link className="redirect-link" to='/register'>Not a member? Sign up</Link>
  </form>
);

export default Login;