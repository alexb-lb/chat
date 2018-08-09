// Libs
import React from "react";
import ReactDom from "react-dom";
import {Provider} from "react-redux";
// App root and imported reducers inside configureStore
import AppRouter from "./routers/AppRouter";
// Actions
import {startAuthenticate} from "./actions/auth";
// Css
import "normalize.css/normalize.css";
import "./styles/styles.scss";
// components
import LoadingPage from "./components/LoadingPage/LoadingPage";

import configureStore from "./store/configureStore";

// Combine imported reducers
const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

// avoid rendering app every time after user log in
let hasRendered = false;
const renderApp = () => {
  if(!hasRendered){
    ReactDom.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

// wait until server sends info about authentication
ReactDom.render(<LoadingPage/>, document.getElementById('app'));

/**
 * Every time user requests the site, check if his token exist and send it to server for check
 * Server responses object {_id, name, token}
 * Insert this object into state.auth.user
 * Router check if state.auth.user is not null and load private components or redirects to login\register
 */
store.dispatch(startAuthenticate(() => renderApp()));