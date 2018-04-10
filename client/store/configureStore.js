import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

// TODO: remove immutable state checker in production
const immutableCheck = require('redux-immutable-state-invariant').default();

// reducers
import authReducer from '../reducers/auth';
import formValidationReducer from '../reducers/formValidation';

// for browser dev tools support firebase
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// on production plug in logger and error handler - Sentry. https://redux.js.org/advanced/middleware

export default () => {
  const store = createStore(combineReducers({
    auth: authReducer,
    formValidation: formValidationReducer
  }),
    composeEnhancers(applyMiddleware(immutableCheck, thunk)) // for browser dev tools support firebase
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
}
