import {
    asyncFetchUserError,
    asyncFetchUserLoaderStarted,
    asyncFetchUserSuccess,
    asyncGetWishListError,
    asyncGetWishListLoader,
    asyncGetWishListSuccess,
    asyncUpdateUserLoader,
    asyncUpdateUserError,
    asyncUpdateUserSuccess,
    asyncUserLoadMoreError,
    asyncUserLoadMoreLoader,
    asyncUserLoadMoreSucces,
    asyncSignupError,
    asyncSignUpLoader,
    asyncSignupSuccess,
    asyncLoginError,
    asyncLoginLoader,
    asyncLoginSuccess
} from '../action/user.action';
import {
    FETCH_USER_API, 
    GET_PRODUCTS_USER_WISHLIST_API, 
    LOAD_MORE_USER_PAGE, 
    UPDATE_USER_DATA_API, 
    SIGN_UP_API,
    EMAIL_LOG_IN_API
} from '../../constant/api';
import {
    getCallApi, postCallApi
} from "../../util/util";
import {
    TOGGLE_LOGIN_MODAL
} from '../../constant/index';

export const fetchUser = (username, token) => {
    return (dispatch) => {
        dispatch(asyncFetchUserLoaderStarted());
        return getCallApi(FETCH_USER_API(username, token))
            .then((data) => {
                if(data.success) {
                    dispatch(asyncFetchUserSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchUserError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchUserError(error));
                return Promise.reject(error);
            })
    }
};

export const asyncFetchWishlist = (skip, token) => {
    return (dispatch) => {
        if (skip > 0) {
            dispatch(asyncGetWishListLoader());
        }
        return getCallApi(GET_PRODUCTS_USER_WISHLIST_API(token, skip))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncGetWishListSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncGetWishListError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncGetWishListError(error));
                return Promise.reject(error);
            });
    }
};

export const asyncUpdateUserData = (token, userData) => {
    return (dispatch) => {
    dispatch(asyncUpdateUserLoader());
    return postCallApi(UPDATE_USER_DATA_API, {token, data: userData})
        .then((data) => {
            if (data.success) {
                dispatch(asyncUpdateUserSuccess(userData));
                return Promise.resolve(userData);
            } else {
                dispatch(asyncUpdateUserError(data));
                return Promise.reject(data);
            }
        })
        .catch((error) => {
            dispatch(asyncUpdateUserError(error));
            return Promise.reject(error);
        });
}
};

export const asyncLoadMoreUserData = (skip, user, type, token) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncUserLoadMoreLoader());
        }
        return getCallApi(LOAD_MORE_USER_PAGE(skip, user, type, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncUserLoadMoreSucces(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncUserLoadMoreError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncUserLoadMoreError(error));
                return Promise.reject(error);
            });
    };
};

export const asyncSignUp = (signupData) => {
    return (dispatch) => {
        dispatch(asyncSignUpLoader());
        return postCallApi(SIGN_UP_API, signupData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncSignupSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncSignupError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncSignupError(error));
                return Promise.reject(error);
            });
    }
};

export const asyncLogin = (loginData) => {
    return (dispatch) => {
        dispatch(asyncLoginLoader());
        return postCallApi(EMAIL_LOG_IN_API, loginData)
        .then((data) => {
            if (data.success) {
                dispatch(asyncLoginSuccess(data));
                return Promise.resolve(data);
            } else {
                dispatch(asyncLoginError(data));
                return Promise.reject(data);
            }
        })
        .catch((error) => {
            dispatch(asyncLoginError(error));
            return Promise.reject(error);
        });
    };
};

export const toggleLoginModal = () => {
    return {
        type: TOGGLE_LOGIN_MODAL
    }
};