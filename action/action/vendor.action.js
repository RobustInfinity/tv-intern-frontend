import {
    FETCH_VENDOR_SUCCESS,
    FETCH_VENDOR_ERROR,
    FETCH_VENDOR_LOADER_STARTED,
    ADD_REVIEW_ERROR,
    ADD_REVIEW_LOADER,
    ADD_REVIEW_SUCCESS,
    FETCH_PRODUCTS_VENDOR_ERROR,
    FETCH_PRODUCTS_VENDOR_LOADER,
    FETCH_PRODUCTS_VENDOR_SUCCESS,
    SHOW_ALL_ARTICLES_VENDOR_ERROR,
    SHOW_ALL_ARTICLES_VENDOR_LOADER,
    SHOW_ALL_ARTICLES_VENDOR_SUCCESS,
    // SHOW_ALL_VIDEO_VENDOR_LOADER,
    SHOW_ALL_VIDEO_VENDOR_SUCCESS,
    // SHOW_ALL_VIDEO_VENDOR_ERROR,
    SHOW_ALL_IMAGES_VENDOR_SUCCESS,
    SHOW_ALL_IMAGES_VENDOR_LOADER,
    SHOW_ALL_IMAGES_VENDOR_ERROR,
    DELETE_REVIEW_LOADER,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_ERROR,
    FETCH_VENDOR_DETAILS_ERROR,
    FETCH_VENDOR_DETAILS_LOADER_STARTED,
    FETCH_VENDOR_DETAILS_SUCCESS,
    FETCH_SIMILAR_VENDOR_LOADER,
    FETCH_SIMILAR_VENDOR_ERROR,
    FETCH_SIMILAR_VENDOR_SUCCESS
} from '../../constant/index';

export const asyncFetchVendorLoader = () => {
    return {
        type: FETCH_VENDOR_LOADER_STARTED
    };
};

export const asyncFetchVendorSuccess = (data) => {
    return {
        type: FETCH_VENDOR_SUCCESS,
        data
    };
};

export const asyncFetchVendorError = (error) => {
    return {
        type: FETCH_VENDOR_ERROR,
        error
    };
};

export const asyncAddReviewLoader = () => {
    return {
        type: ADD_REVIEW_LOADER
    };
};

export const asyncAddReviewSuccess = (data) => {
    return {
        type: ADD_REVIEW_SUCCESS,
        data
    };
};

export const asyncAddReviewError = (error) => {
    return {
        type: ADD_REVIEW_ERROR,
        error
    };
};

export const asyncFetchProductVendorLoader = () => {
    return {
        type: FETCH_PRODUCTS_VENDOR_LOADER
    };
};

export const asyncFetchProductVendorSuccess = (data) => {
    return {
        type: FETCH_PRODUCTS_VENDOR_SUCCESS,
        data
    };
};

export const asyncFetchProductVendorError = (error) => {
    return {
        type: FETCH_PRODUCTS_VENDOR_ERROR,
        error
    };
};

export const asyncFetchArticlesVendorLoader = () => {
    return {
      type: SHOW_ALL_ARTICLES_VENDOR_LOADER
    };
};

export const asyncFetchArticlesVendorSuccess = (data) => {
    return {
        type: SHOW_ALL_ARTICLES_VENDOR_SUCCESS,
        data
    };
};

export const asyncFetchArticlesVendorError = (error) => {
    return {
        type: SHOW_ALL_ARTICLES_VENDOR_ERROR,
        error
    };
};

export const asyncFetchVideosVendorLoader = () => {
    return {
        type: SHOW_ALL_ARTICLES_VENDOR_LOADER
    };
};

export const asyncFetchVideosVendorSuccess = (data) => {
    return {
        type: SHOW_ALL_VIDEO_VENDOR_SUCCESS,
        data
    };
};

export const asyncFetchVideosVendorError = (error) => {
    return {
        type: SHOW_ALL_ARTICLES_VENDOR_ERROR,
        error
    };
};

export const asyncFetchImagesVendorLoader = () => {
    return {
        type: SHOW_ALL_IMAGES_VENDOR_LOADER
    };
};

export const asyncFetchImagesVendorSuccess = (data) => {
    return {
        type: SHOW_ALL_IMAGES_VENDOR_SUCCESS,
        data
    };
};

export const asyncFetchImagesVendorError = (error) => {
    return {
        type: SHOW_ALL_IMAGES_VENDOR_ERROR,
        error
    }
};

export const asyncDeleteReviewLoader = () => {
    return {
        type: DELETE_REVIEW_LOADER
    };
};

export const asyncDeleteReviewSuccess = (data) => {
    return {
        type: DELETE_REVIEW_SUCCESS,
        data
    };
};

export const asyncDeleteReviewError = (error) => {
    return {
        type: DELETE_REVIEW_ERROR,
        error
    };
};

export const asyncFetchVendorDetailsLoader = () => {
    return {
        type: FETCH_VENDOR_DETAILS_LOADER_STARTED
    };
};

export const asyncFetchVendorDetailsSuccess = (data) => {
    return {
        type: FETCH_VENDOR_DETAILS_SUCCESS,
        data
    };
};

export const asyncFetchVendorDetailsError = (error) => {
    return {
        type: FETCH_VENDOR_DETAILS_ERROR,
        error
    };
};

export const asyncFetchSimilarVendorLoader = () => {
    return {
        type: FETCH_SIMILAR_VENDOR_LOADER
    };
};

export const asyncFetchSimilarVendorSuccess = (data) => {
    return {
        type: FETCH_SIMILAR_VENDOR_SUCCESS,
        data
    };
};

export const asyncFetchSimilarVendorError = (error) => {
    return {
        type: FETCH_SIMILAR_VENDOR_ERROR,
        error
    };
};