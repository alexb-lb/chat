import React from 'react';
import {Router, Route, Switch, Link, NavLink} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        {/*<PublicRoute path="/" component={LoginPage} exact={true}/>*/}
        {/*<PrivateRoute path="/dashboard" component={ExpenseDashboardPage} />*/}
        {/*<PrivateRoute path="/create" component={AddExpensePage}/>*/}
        {/*<PrivateRoute path="/edit/:id" component={EditExpensePage}/>*/}
        {/*<PublicRoute component={NotFoundPage}/>*/}
      </Switch>
    </div>
  </Router>
);

export default AppRouter;