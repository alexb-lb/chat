import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

import UserRegisteredState from '../modules/UserRegisteredState';

export const PrivateRoute = ({isAuthenticated, component: Component, ...rest}) => (
  <Route {...rest} component={(props) => (
    isAuthenticated ? (
      <div>
        <div>isAuthenticated: {"" + isAuthenticated}</div>
        <Component {...props}/>
      </div>
    ) : (
      UserRegisteredState.isUserRegistered() ? (
        <Redirect to={{pathname: "/login", state: {from: props.location}}}/>
      ) : (
        <Redirect to={{pathname: "/register", state: {from: props.location}}}/>
      )
    )
  )}
  />
);

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.user
});

export default connect(mapStateToProps)(PrivateRoute);