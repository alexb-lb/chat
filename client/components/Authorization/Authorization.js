import React from "react";
import axios from "axios";
import {connect} from 'react-redux';

import Logo from "../../components/Logo/Logo";
import Register from "./LocalAuthorization/Register/Register";
import Login from "./LocalAuthorization/Login/Login";

class Authorization extends React.Component {
  constructor(props) {
    super(props);

    this.defaultFormValidationState = {
      success: true,
      message: '',
      errorInElement: false
    };

    this.state = {
      user: {
        email: '',
        name: '',
        password: ''
      },
      formValidation: this.defaultFormValidationState
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

    // create an AJAX request
    axios({
      method: 'post',
      url: '/register',
      data: formData
    })
      .then((response) => this.setState({formValidation: this.defaultFormValidationState}))
      .catch((err) => {
        if (!err.response.data.success) {
          return this.setState({
            formValidation: err.response.data
          });
        }
      });
  };

  processLoginForm = (event) => {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    // create an AJAX request
    axios({
      method: 'post',
      url: '/login',
      data: formData,
      headers: {"Authorization": localStorage.getItem('token')},
    })
      .then((response) => this.setState({formValidation: this.defaultFormValidationState}))
      .catch((err) => {
        if (!err.response.data.success) {
          return this.setState({
            formValidation: err.response.data
          });
        }
      });
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
                formValidation={this.state.formValidation}
              />
              :
              <Login
                onChange={this.changeUser}
                onSubmit={this.processLoginForm}
                user={this.state.user}
                formValidation={this.state.formValidation}
              />
          }
        </div>
      </main>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // startAddExpense: (expense) => dispatch(startAddExpense(expense))
});

export default connect(undefined, mapDispatchToProps)(Authorization);