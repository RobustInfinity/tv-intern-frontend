import { createStore, applyMiddleware } from 'redux';
import { middleware } from "../middlewares/index";
import { rootReducer } from "../reducers/index";
const Middleware = applyMiddleware(...middleware);


/**
 * Global store for storing global states.
 * @type {Store<any>}
 */
const store = createStore(rootReducer, Middleware);

export default store;