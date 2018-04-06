import React from "react";
import axios from "axios";
import {connect} from 'react-redux';

import {startLogin} from '../../actions/auth';
import {startRegister} from '../../actions/auth';

import Logo from "../../components/Logo/Logo";
import Register from "./LocalAuthorization/Register/Register";
import Login from "./LocalAuthorization/Login/Login";

class Authorization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: '',
        name: '',
        password: ''
      }
    };
  }

  changeUser = (event) => {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({user});
  };

  processRegisterForm = (event) => {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `name=${name}&email=${email}&password=${password}`;

    this.props.startRegister(formData);
  };

  processLoginForm = (event) => {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    this.props.startLogin(formData);
  };

  render() {
    return (
      <main className="page-authorization">
        <Logo/>

        <div className="auth-container">
          {
            this.props.match.path === '/register' ?
              <Register
                onChange={this.changeUser}
                onSubmit={this.processRegisterForm}
                user={this.state.user}
                formValidation={this.props.formValidation}
              />
              :
              <Login
                onChange={this.changeUser}
                onSubmit={this.processLoginForm}
                user={this.state.user}
                formValidation={this.props.formValidation}
              />
          }
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state) => ({formValidation: state.formValidation});

const mapDispatchToProps = (dispatch) => ({
  startLogin: formData => dispatch(startLogin(formData)),
  startRegister: formData => dispatch(startRegister(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Authorization);