import '@blueprintjs/core/dist/blueprint.css';
import 'animate.css/animate.css';
import './styles/style.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './redux/create';
import { FocusStyleManager } from '@blueprintjs/core';
import Application from './containers/Application';

FocusStyleManager.onlyShowFocusOnTabs();

const store = createStore();

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root')
);
