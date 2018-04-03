// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import {getCookie} from './lib/cookie';

// App root and imported reducers inside configureStore
// import AppRouter, {history} from './routers/AppRouter'
import configureStore from './store/configureStore';

// Css
import 'normalize.css/normalize.css';
import './styles/styles.scss';

// components
import Dating from './components/Dating/Dating';
import Authorization from './components/Authorization/Authorization';

// Combine imported reducers
const store = configureStore();

// // enter point
// const jsx = (
//   <Provider store={store}>
//     <AppRouter/>
//   </Provider>
// );
//
// // avoid rendering app every time after user log in
// let hasRendered = false;
// const renderApp = () => {
//   if(!hasRendered){
//     ReactDOM.render(jsx, document.getElementById('app'));
//     hasRendered = true;
//   }
// };


class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: !!getCookie('authenticated'),
      newUser: false
    };
  }

  render() {
    return (
      <div>
        {this.state.authenticated ?
          <Dating/>
          :
          <Authorization newUser={this.state.newUser}/>
        }
      </div>
    );
  }
}

ReactDOM.render(<ChatApp/>, document.getElementById('app'));