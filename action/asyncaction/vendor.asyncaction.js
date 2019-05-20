import {
    asyncFetchVendorError,
    asyncFetchVendorSuccess,
    asyncFetchVendorLoader,
    asyncAddReviewError,
    asyncAddReviewLoader,
    asyncAddReviewSuccess,
    asyncFetchProductVendorError,
    asyncFetchProductVendorSuccess,
    asyncFetchProductVendorLoader,
    asyncFetchArticlesVendorError,
    asyncFetchArticlesVendorLoader,
    asyncFetchArticlesVendorSuccess,
    asyncFetchVideosVendorError,
    asyncFetchVideosVendorLoader,
    asyncFetchVideosVendorSuccess,
    asyncFetchImagesVendorError,
    asyncFetchImagesVendorLoader,
    asyncFetchImagesVendorSuccess,
    asyncDeleteReviewError,
    asyncDeleteReviewLoader,
    asyncDeleteReviewSuccess,
    asyncFetchVendorDetailsError,
    asyncFetchVendorDetailsLoader,
    asyncFetchVendorDetailsSuccess,
    asyncFetchSimilarVendorError,
    asyncFetchSimilarVendorLoader,
    asyncFetchSimilarVendorSuccess
} from '../action/vendor.action';

import {
    ADD_REVIEW_API,
    FETCH_VENDOR_API,
    FETCH_VENDOR_DETAILS_API,
    GET_ALL_PRODUCTS_VENDOR_API,
    GET_ALL_ARTICLES_VENDOR_API,
    GET_ALL_VIDEOS_VENDOR_API,
    GET_ALL_IMAGES_VENDOR_API,
    GET_ALL_PRODUCTS_VENDOR_ADMIN_API,
    GET_ALL_IMAGES_VENDOR_ADMIN_API,
    DELETE_REVIEW_API,
    DELETE_REVIEW_PRODUCT_API, FETCH_SIMILAR_VENDOR_API
} from '../../constant/api';
import {
    getCallApi, postCallApi
} from "../../util/util";

export const fetchVendor = (username, token, type) => {
    return (dispatch) => {
        dispatch(asyncFetchVendorLoader());
        return getCallApi(FETCH_VENDOR_API(username, token, type))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchVendorError(error));
                return Promise.reject(error);
            })
    };
};

export const fetchVendorDetails = (username, token, type) => {
    return (dispatch) => {
        dispatch(asyncFetchVendorDetailsLoader());
        return getCallApi(FETCH_VENDOR_DETAILS_API(username, token, type))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchVendorDetailsSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchVendorDetailsError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchVendorDetailsError(error));
                return Promise.reject(error);
            })
    };
};

export const addReview = (reviewData) => {
    return (dispatch) => {
        dispatch(asyncAddReviewLoader());
        return postCallApi(ADD_REVIEW_API, { reviewData })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncAddReviewSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncAddReviewError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncAddReviewError(error));
                return Promise.reject(error);
            })
    };
};

export const fetchProductsVendor = (vendor, skip, token, admin) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFetchProductVendorLoader());
        }
        return getCallApi(admin ? GET_ALL_PRODUCTS_VENDOR_ADMIN_API(vendor, skip, token) : GET_ALL_PRODUCTS_VENDOR_API(vendor, skip))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchProductVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchProductVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchProductVendorError(error));
                return Promise.reject(error);
            });
    }
};

export const fetchArticlesVendor = (vendor, skip) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFetchArticlesVendorLoader());
        }
        return getCallApi(GET_ALL_ARTICLES_VENDOR_API(vendor, skip))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchArticlesVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchArticlesVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchArticlesVendorSuccess(error));
                return Promise.reject(error);
            });
    }
};

export const fetchVideosVendor = (vendor, skip, token) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFetchVideosVendorLoader());
        }
        return getCallApi(GET_ALL_VIDEOS_VENDOR_API(vendor, skip, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchVideosVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchVideosVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchVideosVendorError(error));
                return Promise.reject(error);
            });
    }
};

export const fetchImagesVendor = (vendor, skip, token, admin) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFetchImagesVendorLoader());
        }
        return getCallApi(admin ? GET_ALL_IMAGES_VENDOR_ADMIN_API(vendor, skip, token) : GET_ALL_IMAGES_VENDOR_API(vendor, skip, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchImagesVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchImagesVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchImagesVendorError(error));
                return Promise.reject(error);
            });
    }
};

export const asyncDeleteReview = (reviewData, isProduct) => {
    return (dispatch) => {
        dispatch(asyncDeleteReviewLoader());
        return postCallApi(isProduct ? DELETE_REVIEW_PRODUCT_API : DELETE_REVIEW_API, reviewData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncDeleteReviewSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncDeleteReviewError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncDeleteReviewError(error));
                return Promise.reject(error);
            });
    }
};

export const asyncFetchSimilarVendors = (vendorName, categories, device, token) => {
    return (dispatch) => {
        dispatch(asyncFetchSimilarVendorLoader());
        return postCallApi(FETCH_SIMILAR_VENDOR_API, {
            vendorName,
            categories,
            device,
            token
        })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchSimilarVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchSimilarVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchSimilarVendorError(error));
                return Promise.reject(error);
            })
    }
};