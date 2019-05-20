import {
    asyncFetchProductError,
    asyncFetchProductLoader,
    asyncFetchProductSuccess,
    asyncSaveProductWishlistError,
    asyncSaveProductWishlistLoader,
    asyncSaveProductWishlistSuccess,
    asyncAddReviewError,
    asyncAddReviewSuccess,
    asyncAddReviewLoader,
    asyncFetchSimilarProductError,
    asyncFetchSimilarProductLoader,
    asyncFetchSimilarProductSuccess,
    asyncAddToCartError,
    asyncAddToCartLoader,
    asyncAddToCartSuccess,
    asyncFetchCartError,
    asyncFetchCartLoader,
    asyncFetchCartSuccess,
    asyncUpdateCartEmailLoader,
    asyncUpdateCartEmailSuccess,
    asyncUpdateCartEmailError,
    asyncUpdateShippingAddressSuccess,
    asyncUpdateQuantityProduct,
    asyncRemoveItemCart,
    asyncFetchServicesLoading,
    asyncFetchServicesSuccess,
    asyncFetchServicesError,
    asyncLoadMoreReviewsError,
    asyncLoadMoreReviewsLoader,
    asyncLoadMoreReviewsSuccess
} from '../action/product.action';
import { getCallApi, postCallApi } from "../../util/util";
import {
    ADD_REVIEW_PRODUCT_API,
    FETCH_PRODUCT_API,
    SAVE_WISHLIST_API,
    FETCH_SIMILAR_PRODUCT,
    ADD_TO_CART_API,
    FETCH_CART_API,
    UPDATE_EMAIL_IN_CART,
    UPDATE_SHIPPING_ADDRESS_CART,
    UPDATE_ITEM_QUANTITY_API,
    REMOVE_ITEM_CART_API,
    FETCH_SERVICES_API,
    FETCH_PRODUCT_REVIEWS
} from "../../constant/api";
import { EMPTY_CART } from '../../constant/index';

export const asyncFetchProduct = (productId, token) => {
    return (dispatch) => {
        dispatch(asyncFetchProductLoader());
        return getCallApi(FETCH_PRODUCT_API(productId, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchProductSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchProductError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchProductError(error));
                return Promise.resolve(error);
            })
    }
};

export const asyncSaveWishlist = (token, serviceId, status) => {
    return (dispatch) => {
        dispatch(asyncSaveProductWishlistLoader());
        return postCallApi(SAVE_WISHLIST_API, {
            token,
            serviceId,
            status
        })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncSaveProductWishlistSuccess({ serviceId, status }));
                    return Promise.resolve(data)
                } else {
                    dispatch(asyncSaveProductWishlistError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncSaveProductWishlistError(error));
                return Promise.reject(error);
            });
    }
};

export const addReviewProduct = (reviewData) => {
    return (dispatch) => {
        dispatch(asyncAddReviewLoader());
        return postCallApi(ADD_REVIEW_PRODUCT_API, { reviewData })
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

export const fetchSimilarProduct = (postData) => {
    return (dispatch) => {
        dispatch(asyncFetchSimilarProductLoader());
        return postCallApi(FETCH_SIMILAR_PRODUCT, postData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchSimilarProductSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchSimilarProductError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchSimilarProductError(error));
                return Promise.reject(error);
            });
    };
};

export const addToCart = (cartData) => {
    return (dispatch) => {
        dispatch(asyncAddToCartLoader());
        return postCallApi(ADD_TO_CART_API, {
            data: cartData
        })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncAddToCartSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncAddToCartError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncAddToCartError(error));
                return Promise.reject(error);
            })
    };
};

export const fetchCartDetails = (cartId, token) => {
    return (dispatch) => {
        dispatch(asyncFetchCartLoader());
        return getCallApi(FETCH_CART_API(cartId, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchCartSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchCartError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchCartSuccess(error));
                return Promise.reject(error);
            });
    };
};

export const updateEmailCart = (data) => {
    return (dispatch) => {
        dispatch(asyncUpdateCartEmailLoader());
        return postCallApi(UPDATE_EMAIL_IN_CART, data)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncUpdateCartEmailSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncUpdateCartEmailError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncUpdateCartEmailError(error));
                return Promise.reject(error);
            });
    };
};

export const updateShippingAddress = (sendData) => {
    return (dispatch) => {
        return postCallApi(UPDATE_SHIPPING_ADDRESS_CART, {
            shippingAddress: sendData.shippingAddress,
            cartId: sendData.cartId
        })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncUpdateShippingAddressSuccess(data));
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
};

export const updateItemQuantity = (sendData) => {
    return (dispatch) => {
        return postCallApi(UPDATE_ITEM_QUANTITY_API, sendData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncUpdateQuantityProduct(data));
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };
};

export const removeItemCart = (sendData) => {
    return (dispatch) => {
        return postCallApi(REMOVE_ITEM_CART_API, sendData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncRemoveItemCart(data));
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };
};

export const clearCart = () => {
    return (dispatch) => {
        dispatch({
            type: EMPTY_CART
        });
    };
};

export const asyncFetchServices = (skip) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFetchServicesLoading());
        }
        return getCallApi(FETCH_SERVICES_API(skip))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchServicesSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchServicesError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchServicesError(error));
                return Promise.reject(error);
            });
    }
};

export const loadMoreReviews = (productId, skip, token) => {
    return (dispatch) => {
        dispatch(asyncLoadMoreReviewsLoader());
        return getCallApi(FETCH_PRODUCT_REVIEWS(productId, skip, token))
        .then((data) => {
            if (data.success) {
                dispatch(asyncLoadMoreReviewsSuccess(data));
                return Promise.resolve(data);
            } else {
                dispatch(asyncLoadMoreReviewsSuccess(data));
                return Promise.reject(data);
            }
        })
        .catch((error) => {
            dispatch(asyncLoadMoreReviewsError(error));
            return Promise.reject(error);
        });
    }
}