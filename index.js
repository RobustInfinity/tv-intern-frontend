import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux';
import store from './store/index';
import Path from "./router/index";
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
        {Path}
    </Provider>, document.getElementById('root'));
registerServiceWorker();
