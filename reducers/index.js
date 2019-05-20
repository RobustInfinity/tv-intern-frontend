import {
    combineReducers
} from 'redux';

import {
    homeReducer
} from "./component.reducer/reducer.home";

import {
    vendorReducer
} from "./component.reducer/reducer.vendor";

import {
    userReducer
} from "./component.reducer/reducer.user";

import {
    filterReducer
} from "./component.reducer/reducer.filter";


import {
    meReducer
} from "./component.reducer/reducer.me";

import {
    articleReducer
} from "./component.reducer/reducer.article";

import {
    productReducer
} from "./component.reducer/reducer.product";

import {
    adminReducer
} from './component.reducer/reducer.admin';

import {
    videoReducer
} from "./component.reducer/reducer.video";

import {
    reviewReducer
} from './component.reducer/reducer.review';

export const rootReducer = combineReducers({
    homeReducer,
    vendorReducer,
    userReducer,
    filterReducer,
    meReducer,
    articleReducer,
    productReducer,
    adminReducer,
    videoReducer,
    reviewReducer
});