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

class Main extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    // check if user is logged in on refresh
    store.dispatch(startAuthenticate());
  }

  render() {
    return (
      store.getState().auth.user ? (
        <LoadingPage/>
      ) : (
        <Provider store={store}>
          <AppRouter/>
        </Provider>
      )
    );
  }
}

ReactDom.render(<Main/>, document.getElementById('app'));