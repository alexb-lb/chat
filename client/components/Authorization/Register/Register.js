import React from 'react';
import {Link} from 'react-router-dom';

const Register = ({onChange, onSubmit, user, formValidation}) => (
  <form method="post" className="form form-register" onSubmit={onSubmit}>
    {
      !formValidation.success
      &&
      <p className="errorMessage">{formValidation.message}</p>
    }
    <input
      onChange={onChange}
      value={user.name}
      type="text"
      name="name"
      id="register-username"
      className={`${formValidation.errorInElement === 'name' && 'error'}`}
      placeholder="Username"
      tabIndex="1"
      autoFocus=""
      autoCapitalize="off"
      autoCorrect="off"
    />

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

    <button type="submit">Sign up</button>

    <Link className="redirect-link" to='/login'>Already registered? Sign in</Link>

  </form>
);

export default Register;