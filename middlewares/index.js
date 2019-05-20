import thunkMiddleware from 'redux-thunk';
import promise from 'redux-promise-middleware';


/**
 * middle to provide redux Thunk support for async actions.
 */
export const middleware = [
    promise(), thunkMiddleware
]