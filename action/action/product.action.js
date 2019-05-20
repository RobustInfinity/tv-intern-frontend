import {
    FETCH_PRODUCT_ERROR,
    FETCH_PRODUCT_LOADER,
    FETCH_PRODUCT_SUCCESS,
    SAVE_PRODUCT_WISHLIST_ERROR,
    SAVE_PRODUCT_WISHLIST_LOADER,
    SAVE_PRODUCT_WISHLIST_SUCCESS,
    ADD_REVIEW_PRODIUCT_ERROR,
    ADD_REVIEW_PRODIUCT_SUCCESS,
    ADD_REVIEW_PRODIUCT_LOADER,
    FETCH_SIMILAR_PRODUCT_ERROR,
    FETCH_SIMILAR_PRODUCT_SUCCESS,
    FETCH_SIMILAR_PRODUCT_LOADER,
    ADD_TO_CART_ERROR,
    ADD_TO_CART_LOADER,
    ADD_TO_CART_SUCCESS,
    FETCH_CART_LOADER,
    FETCH_CART_SUCCESS,
    FETCH_CART_ERROR,
    UPDATE_EMAIL_CART_LOADER,
    UPDATE_EMAIL_CART_SUCCESS,
    UPDATE_EMAIL_CART_ERROR,
    UPDATE_SHIPPING_ADDRESS_SUCCESS,
    UPDATE_ITEM_QUANTITY_SUCCESS,
    REMOVE_ITEM_CART_SUCCESS,
    FETCH_SERVICES_LOADING,
    FETCH_SERVICES_SUCCESS,
    FETCH_SERVICES_ERROR,
    LOAD_MORE_PRODUCT_REVIEWS_LOADER,
    LOAD_MORE_PRODUCT_REVIEWS_SUCCESS,
    LOAD_MORE_PRODUCT_REVIEWS_ERROR
} from '../../constant/index';

export const asyncFetchProductLoader = () => {
    return {
        type: FETCH_PRODUCT_LOADER
    };
};

export const asyncFetchProductSuccess = (data) => {
    return {
        type: FETCH_PRODUCT_SUCCESS,
        data
    };
};

export const asyncFetchProductError = (error) => {
    return {
        type: FETCH_PRODUCT_ERROR,
        error
    };
};

export const asyncSaveProductWishlistLoader = () => {
    return {
        type: SAVE_PRODUCT_WISHLIST_LOADER
    };
};

export const asyncSaveProductWishlistSuccess = (data) => {
    return {
        type: SAVE_PRODUCT_WISHLIST_SUCCESS,
        data
    };
};

export const asyncSaveProductWishlistError = (error) => {
    return {
        type: SAVE_PRODUCT_WISHLIST_ERROR,
        error
    };
};

export const asyncAddReviewLoader = () => {
    return {
        type: ADD_REVIEW_PRODIUCT_LOADER
    };
};

export const asyncAddReviewSuccess = (data) => {
    return {
        type: ADD_REVIEW_PRODIUCT_SUCCESS,
        data
    };
};

export const asyncAddReviewError = (error) => {
    return {
        type: ADD_REVIEW_PRODIUCT_ERROR,
        error
    };
};


export const asyncFetchSimilarProductLoader = () => {
    return {
        type: FETCH_SIMILAR_PRODUCT_LOADER
    };
};

export const asyncFetchSimilarProductSuccess = (data) => {
    return {
        type: FETCH_SIMILAR_PRODUCT_SUCCESS,
        data
    };
};

export const asyncFetchSimilarProductError = (error) => {
    return {
        type: FETCH_SIMILAR_PRODUCT_ERROR,
        error
    };
};

export const asyncAddToCartLoader = () => {
    return {
        type: ADD_TO_CART_LOADER
    };
};

export const asyncAddToCartSuccess = (data) => {
    return {
        type: ADD_TO_CART_SUCCESS,
        data
    };
};

export const asyncAddToCartError = (error) => {
    return {
        type: ADD_TO_CART_ERROR,
        error
    };
};

export const asyncFetchCartLoader = () => {
    return {
        type: FETCH_CART_LOADER,
    };
};

export const asyncFetchCartSuccess = (data) => {
    return {
        type: FETCH_CART_SUCCESS,
        data
    };
};

export const asyncFetchCartError = (error) => {
    return {
        type: FETCH_CART_ERROR,
        error
    };
};

export const asyncUpdateCartEmailLoader = () => {
    return {
        type: UPDATE_EMAIL_CART_LOADER
    };
};

export const asyncUpdateCartEmailSuccess = (data) => {
    return {
        type: UPDATE_EMAIL_CART_SUCCESS,
        data
    };
};

export const asyncUpdateCartEmailError = (error) => {
    return {
        type: UPDATE_EMAIL_CART_ERROR,
        error
    };
};

export const asyncUpdateShippingAddressSuccess = (data) => {
    return {
        type: UPDATE_SHIPPING_ADDRESS_SUCCESS,
        data
    };
};

export const asyncUpdateQuantityProduct = (data) => {
    return {
        type: UPDATE_ITEM_QUANTITY_SUCCESS,
        data
    };
};

export const asyncRemoveItemCart = (data) => {
    return {
        type: REMOVE_ITEM_CART_SUCCESS,
        data
    };
};

export const asyncFetchServicesLoading = () => {
    return {
        type: FETCH_SERVICES_LOADING
    };
};

export const asyncFetchServicesSuccess = (data) => {
    return {
        type: FETCH_SERVICES_SUCCESS,
        data
    };
};

export const asyncFetchServicesError = (error) => {
    return {
        type: FETCH_SERVICES_ERROR,
        error
    };
};

export const asyncLoadMoreReviewsLoader = () => {
    return {
        type: LOAD_MORE_PRODUCT_REVIEWS_LOADER
    };
};

export const asyncLoadMoreReviewsSuccess = (data) => {
    return {
        type: LOAD_MORE_PRODUCT_REVIEWS_SUCCESS,
        data
    };
};

export const asyncLoadMoreReviewsError = (error) => {
    return {
        type: LOAD_MORE_PRODUCT_REVIEWS_ERROR,
        error
    };
};