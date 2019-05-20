import {
    FETCH_USER_ERROR,
    FETCH_USER_LOADER_STARTED,
    FETCH_USER_SUCCESS,
    GET_WISHLIST_ERROR,
    GET_WISHLIST_LOADER,
    GET_WISHLIST_SUCCESS,
    UPDATE_USER_DATA_ERROR,
    UPDATE_USER_DATA_LOADER_STARTED,
    UPDATE_USER_DATA_SUCCESS,
    LOAD_MORE_USER_ERROR,
    LOAD_MORE_USER_LOADER,
    LOAD_MORE_USER_SUCCESS,
    SIGN_UP_LOADER,
    SIGN_UP_SUCCESS,
    SIGN_UP_ERROR,
    EMAIL_LOGIN_LOADER,
    EMAIL_LOGIN_SUCCESS,
    EMAIL_LOGIN_ERROR
} from '../../constant/index';

export const asyncFetchUserLoaderStarted = () => {
    return {
        type: FETCH_USER_LOADER_STARTED
    };
};

export const asyncFetchUserSuccess = (data) => {
    return {
        type: FETCH_USER_SUCCESS,
        data
    };
};

export const asyncFetchUserError = (error) => {
    return {
        type: FETCH_USER_ERROR,
        error
    };
};

export const asyncGetWishListLoader = () => {
    return {
        type: GET_WISHLIST_LOADER
    };
};

export const asyncGetWishListSuccess = (data) => {
    return {
        type: GET_WISHLIST_SUCCESS,
        data
    };
};

export const asyncGetWishListError = (error) => {
    return {
        type: GET_WISHLIST_ERROR,
        error
    };
};

export const asyncUpdateUserLoader = () => {
    return {
        type: UPDATE_USER_DATA_LOADER_STARTED
    };
};

export const asyncUpdateUserSuccess = (data) => {
    return {
        type: UPDATE_USER_DATA_SUCCESS,
        data
    };
};

export const asyncUpdateUserError = (error) => {
    return {
        type: UPDATE_USER_DATA_ERROR,
        error
    };
};

export const asyncUserLoadMoreLoader = () => {
    return {
        type: LOAD_MORE_USER_LOADER
    } ;
};

export const asyncUserLoadMoreSucces = (data) => {
    return {
        type: LOAD_MORE_USER_SUCCESS,
        data
    };
};

export const asyncUserLoadMoreError = (error) => {
    return {
        type: LOAD_MORE_USER_ERROR,
        error
    };
};

export const asyncSignUpLoader = () => {
    return {
        type: SIGN_UP_LOADER
    };
};

export const asyncSignupSuccess = (data) => {
    return {
        type: SIGN_UP_SUCCESS,
        data
    };
};

export const asyncSignupError = (error) => {
    return {
        type: SIGN_UP_ERROR,
        error
    };
};

export const asyncLoginLoader = () => {
    return {
        type: EMAIL_LOGIN_LOADER
    };
}

export const asyncLoginSuccess = (data) => {
    return {
        type: EMAIL_LOGIN_SUCCESS,
        data
    };
};

export const asyncLoginError = (error) => {
    return {
        type: EMAIL_LOGIN_ERROR,
        error
    };
};