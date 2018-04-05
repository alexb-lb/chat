// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

// App root and imported reducers inside configureStore
import AppRouter, {history} from './routers/AppRouter'
import configureStore from './store/configureStore';

// Actions
import {startAuthenticate} from "./actions/auth"

// Css
import 'normalize.css/normalize.css';
import './styles/styles.scss';

// components
import LoadingPage from './components/LoadingPage/LoadingPage'

// Combine imported reducers
const store = configureStore();

// enter point
const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

// avoid rendering app every time after user log in
const renderApp = () => {
  ReactDOM.render(jsx, document.getElementById('app'));
};

// waits until database sends info about authentication
ReactDOM.render(<LoadingPage/>, document.getElementById('app'));

// wait until server sends back response with user object, then launch app
const unsubscribe = store.subscribe(() => {
  unsubscribe();
  renderApp();
});

// START check if user has token and auth him or show register/login page
store.dispatch(startAuthenticate());