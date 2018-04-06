import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

// reducers
import authReducer from '../reducers/auth';
import formValidationReducer from '../reducers/formValidation';

// for browser dev tools support firebase
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(combineReducers({
    auth: authReducer,
    formValidation: formValidationReducer
  }),
    composeEnhancers(applyMiddleware(thunk)) // for browser dev tools support firebase
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
}
