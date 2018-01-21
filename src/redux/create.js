import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import history from './history';

export default function createReduxStore(initialState) {

  const storeCreator = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const middleware = applyMiddleware(
    routerMiddleware(history),
    thunk,
  );

  const create = compose(middleware)(storeCreator);

  const reducer = require('./reducer').default;
  const store = create(reducer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default);
    });
  }

  return store;
}
