/* eslint-disable radix */
import _ from 'lodash';
import {
    FETCH_PRODUCT_ERROR,
    FETCH_PRODUCT_SUCCESS,
    FETCH_PRODUCT_LOADER,
    SAVE_PRODUCT_WISHLIST_ERROR,
    SAVE_PRODUCT_WISHLIST_SUCCESS,
    SAVE_PRODUCT_WISHLIST_LOADER,
    ADD_REVIEW_PRODIUCT_ERROR,
    ADD_REVIEW_PRODIUCT_SUCCESS,
    ADD_REVIEW_PRODIUCT_LOADER,
    DELETE_REVIEW_LOADER,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_ERROR,
    FETCH_SIMILAR_PRODUCT_LOADER,
    FETCH_SIMILAR_PRODUCT_SUCCESS,
    FETCH_SIMILAR_PRODUCT_ERROR,
    FETCH_CART_ERROR,
    FETCH_CART_LOADER,
    FETCH_CART_SUCCESS,
    UPDATE_EMAIL_CART_LOADER,
    UPDATE_EMAIL_CART_SUCCESS,
    UPDATE_EMAIL_CART_ERROR,
    UPDATE_SHIPPING_ADDRESS_SUCCESS,
    UPDATE_ITEM_QUANTITY_SUCCESS,
    REMOVE_ITEM_CART_SUCCESS,
    EMPTY_CART,
    FETCH_SERVICES_LOADING,
    FETCH_SERVICES_SUCCESS,
    FETCH_SERVICES_ERROR,
    PRODUCT_LIKE_REVIEW_LOADER,
    PRODUCT_LIKE_REVIEW_SUCCESS,
    PRODUCT_LIKE_REVIEW_ERROR,
    LOAD_MORE_PRODUCT_REVIEWS_LOADER,
    LOAD_MORE_PRODUCT_REVIEWS_SUCCESS,
    LOAD_MORE_PRODUCT_REVIEWS_ERROR
} from '../../constant/index';


const initialState = {
    product: {},
    vendor: {},
    user: [],
    reviews: [],
    loading: false,
    similarProduct: [],
    similarProductLoading: false,
    cart: {},
    cartProducts: [],
    cartLoading: true,
    services: [],
    allServiceLoaded: false,
    serviceLoading: false,
    allReviewsLoaded: false,
    reviewLoading: false
};

export const productReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_PRODUCT_LOADER: {
            return {
                ...state,
                loading: true,
                vendor: {}
            };
        }

        case FETCH_PRODUCT_SUCCESS: {
            return {
                ...state,
                loading: false,
                product: action.data.data.product,
                vendor: action.data.data.vendor,
                user: action.data.data.user,
                reviews: action.data.data.reviews
            }
        }

        case FETCH_PRODUCT_ERROR: {
            return {
                ...state,
                loading: false
            }
        }

        case PRODUCT_LIKE_REVIEW_LOADER: {
            if (action.data.status) {
                if (_.find(state.reviews, { _id: String(action.data.review) })) {
                    const reviews = state.reviews;
                    reviews[_.findIndex(state.reviews, { _id: String(action.data.review) })].isLiked = true;
                    reviews[_.findIndex(state.reviews, { _id: String(action.data.review) })].likeCount = parseInt(reviews[_.findIndex(state.reviews, { _id: String(action.data.review) })].likeCount) + 1;
                    return {
                        ...state,
                        reviews
                    }
                } else {
                    return {
                        ...state
                    };
                }
            } else {
                if (_.find(state.reviews, { _id: String(action.data.review) })) {
                    const reviews = state.reviews;
                    reviews[_.findIndex(state.reviews, { _id: String(action.data.review) })].isLiked = false;
                    reviews[_.findIndex(state.reviews, { _id: String(action.data.review) })].likeCount = parseInt(reviews[_.findIndex(state.reviews, { _id: String(action.data.review) })].likeCount) - 1;
                    return {
                        ...state,
                        reviews
                    }
                } else {
                    return {
                        ...state
                    };
                }
            }
        }

        case PRODUCT_LIKE_REVIEW_SUCCESS: {
            return {
                ...state
            };
        }

        case PRODUCT_LIKE_REVIEW_ERROR: {
            return {
                ...state
            };
        }

        case SAVE_PRODUCT_WISHLIST_LOADER: {
            return {
                ...state
            }
        }

        case SAVE_PRODUCT_WISHLIST_SUCCESS: {
            return {
                ...state,
                product: {
                    ...state.product,
                    isWishListed: action.data.status
                }
            }
        }

        case SAVE_PRODUCT_WISHLIST_ERROR: {
            return {
                ...state
            }
        }

        case ADD_REVIEW_PRODIUCT_LOADER: {
            return {
                ...state
            };
        }

        case ADD_REVIEW_PRODIUCT_SUCCESS: {
            if (_.findIndex(state.reviews, { user: action.data.data.user.username }) === -1) {
                if (state.reviews.length <= 3) {
                    const reviews = state.reviews;
                    let users = state.user;
                    reviews.push(action.data.data.review);
                    if (_.find(state.user, { username: action.data.data.user.username })) {
                        users[_.findIndex(state.user, { username: action.data.data.user.username })].reviewCount = parseInt(users[_.findIndex(state.user, { username: action.data.data.user.username })].reviewCount) + 1;
                    } else {
                        users.push(action.data.data.user);
                    }
                    return {
                        ...state,
                        reviews,
                        user: users,
                        product: {
                            ...state.product,
                            reviewCount: parseInt(state.product.reviewCount) + 1,
                            rating: action.data.data.rating
                        }
                    };
                } else {
                    let users = state.user;
                    if (_.find(state.user, { username: action.data.data.user.username })) {
                        users[_.findIndex(state.user, { username: action.data.data.user.username })].reviewCount = parseInt(users[_.findIndex(state.user, { username: action.data.data.user.username })].reviewCount) + 1;
                    }
                    return {
                        ...state,
                        user: users,
                        product: {
                            ...state.product,
                            reviewCount: parseInt(state.product.reviewCount) + 1,
                            rating: action.data.data.rating
                        }
                    };
                }
            } else {
                const reviews = state.reviews;
                const users = state.user;
                reviews[_.findIndex(reviews, { user: action.data.data.user.username })] = action.data.data.review;
                users[_.findIndex(users, { username: action.data.data.user.username })] = action.data.data.user;
                return {
                    ...state,
                    user: users,
                    reviews,
                    product: {
                        ...state.product,
                        rating: action.data.data.rating
                    }
                }
            }
        }

        case ADD_REVIEW_PRODIUCT_ERROR: {
            return {
                ...state
            };
        }

        case DELETE_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case DELETE_REVIEW_SUCCESS: {
            const reviews = state.reviews;
            const reviewId = action.data.data.reviewId;
            const rating = action.data.data.rating;
            if (_.find(reviews, { _id: reviewId })) {
                reviews.splice(_.findIndex(reviews, { _id: reviewId }), 1);
            }
            return {
                ...state,
                reviews,
                product: {
                    ...state.product,
                    reviewCount: parseInt(state.product.reviewCount) - 1,
                    rating
                }
            };
        }

        case DELETE_REVIEW_ERROR: {
            return {
                ...state
            };
        }

        case FETCH_SIMILAR_PRODUCT_LOADER: {
            return {
                ...state,
                similarProductLoading: true
            };
        }

        case FETCH_SIMILAR_PRODUCT_SUCCESS: {
            return {
                ...state,
                similarProduct: action.data.data,
                similarProductLoading: false
            };
        }

        case FETCH_SIMILAR_PRODUCT_ERROR: {
            return {
                ...state,
                similarProductLoading: false
            };
        }

        case FETCH_CART_LOADER: {
            return {
                ...state,
                cartLoading: true
            };
        }

        case FETCH_CART_SUCCESS: {
            return {
                ...state,
                cartLoading: false,
                cart: action.data.data.cart,
                cartProducts: action.data.data.products
            };
        }

        case FETCH_CART_ERROR: {
            return {
                ...state,
                cartLoading: false
            };
        }

        case UPDATE_EMAIL_CART_LOADER: {
            return {
                ...state
            };
        }

        case UPDATE_EMAIL_CART_SUCCESS: {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    email: action.data.data.email
                }
            };
        }

        case UPDATE_EMAIL_CART_ERROR: {
            return {
                ...state
            };
        }

        case UPDATE_SHIPPING_ADDRESS_SUCCESS: {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.data.data.shippingAddress
                }
            }
        }

        case UPDATE_ITEM_QUANTITY_SUCCESS: {
            return {
                ...state,
                cart: action.data.data.cart,
                cartProducts: action.data.data.cartProducts
            }
        }

        case REMOVE_ITEM_CART_SUCCESS: {
            return {
                ...state,
                cart: action.data.data.cart,
                cartProducts: action.data.data.cartProducts
            }
        }

        case EMPTY_CART: {
            return {
                ...state,
                cart: {},
                cartProducts: []
            }
        }

        case FETCH_SERVICES_LOADING: {
            return {
                ...state,
                serviceLoading: true,
                services: []
            };
        }

        case FETCH_SERVICES_SUCCESS: {
            return {
                ...state,
                services: _.union(state.services, action.data.data),
                allServiceLoaded: action.data.data.length > 0 ? false : true,
                serviceLoading: false
            }
        }

        case FETCH_SERVICES_ERROR: {
            return {
                ...state,
                serviceLoading: false
            }
        }

        case LOAD_MORE_PRODUCT_REVIEWS_LOADER: {
            return {
                ...state,
                reviewLoading: true
            }
        }

        case LOAD_MORE_PRODUCT_REVIEWS_SUCCESS: {
            return {
                ...state,
                reviews: _.union(state.reviews, action.data.data.reviews),
                user: _.union(state.user, action.data.data.user),
                allReviewsLoaded: action.data.data.reviews.length < 5 ? true : false,
                reviewLoading: false
            }
        }

        case LOAD_MORE_PRODUCT_REVIEWS_ERROR: {
            return {
                ...state,
                reviewLoading: false
            }
        }

        default: {
            return {
                ...state
            };
        }
    }

};