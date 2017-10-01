import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import createReducer, { RANDOM_GENERATOR } from './reducer';

const store = createStore(createReducer({
  n: 6,
  m: 6,
  generator: RANDOM_GENERATOR
}));
const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
