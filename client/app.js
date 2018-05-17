// Libs
import React from 'react';
import ReactDom from 'react-dom';
import {Provider, connect} from 'react-redux';

// App root and imported reducers inside configureStore
import AppRouter, {history} from './routers/AppRouter'

// Actions
import {startAuthenticate} from "./actions/auth"

// Css
import 'normalize.css/normalize.css';
import './styles/styles.scss';

// components
import LoadingPage from './components/LoadingPage/LoadingPage'

import configureStore from './store/configureStore';

// Combine imported reducers
const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

// wait until server sends info about authentication
ReactDom.render(<LoadingPage/>, document.getElementById('app'));

// listen when server check if user logged in
store.dispatch(startAuthenticate(() => {
  ReactDom.render(jsx, document.getElementById('app'))
}));