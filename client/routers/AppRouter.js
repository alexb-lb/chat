import React from 'react';
import {Router, Route, Switch, Link, NavLink} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// routers
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// compontents
import Dating from '../components/Dating/Dating';
import Authorization from '../components/Authorization/Authorization';

// history
export const history = createHistory();

// routing
const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PrivateRoute path="/" component={Dating} exact={true}/>
        <PrivateRoute path="/testprivate" component={Dating} exact={true}/>
        <PublicRoute path="/login"  component={Authorization} subComponent="login"/>
        <PublicRoute path="/register" component={Authorization} subComponent="register"/>
      </Switch>
    </div>
  </Router>
);

export default AppRouter;