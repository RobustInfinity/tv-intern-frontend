/* eslint-disable radix*/
import _ from 'lodash';
import {
    FETCH_USER_LOADER_STARTED,
    FETCH_USER_SUCCESS,
    FETCH_USER_ERROR,
    TOGGLE_LOGIN_MODAL,
    HOME_BATCH_1_LOADER_STARTED,
    GOOGLE_USER_LOGGING_UP_SUCCESS,
    FACEBOOK_USER_LOGGING_UP_SUCCESS,
    FOLLOW_UNFOLLOW_USER_LOADER,
    FOLLOW_UNFOLLOW_USER_SUCCESS,
    FOLLOW_UNFOLLOW_USER_ERROR,
    LIKE_REVIEW_ERROR,
    LIKE_REVIEW_SUCCESS,
    LIKE_REVIEW_LOADER,
    ADD_COMMENT_REVIEW_ERROR,
    ADD_COMMENT_REVIEW_SUCCESS,
    ADD_COMMENT_REVIEW_LOADER,
    LIKE_DISLIKE_VENDOR_ERROR,
    LIKE_DISLIKE_VENDOR_SUCCESS,
    LIKE_DISLIKE_VENDOR_LOADER,
    UPDATE_USER_DATA_SUCCESS,
    UPDATE_USER_DATA_LOADER_STARTED,
    LOAD_MORE_USER_ERROR,
    LOAD_MORE_USER_SUCCESS,
    LOAD_MORE_USER_LOADER,
    ADD_REVIEW_LOADER,
    ADD_REVIEW_SUCCESS,
    ADD_REVIEW_ERROR,
    DELETE_REVIEW_LOADER,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_ERROR,
    DELETE_COMMENT_SUCCESS
} from '../../constant/index';
const intialState = {
    loading: false,
    user:{},
    reviews: [],
    bookmarks: [],
    favorites: [],
    vendor: [],
    showLoginModal: false,
    vendorWishlist: [],
    userLoading: false,
    allReviewLoaded: false,
    allProductsLoaded: false,
    allBookmarksLoaded: false,
    allFavoritesLoaded: false,
    reviewUser: [],
    blogs: [],
    allBlogsLoaded: false,
    loadingData: false
};

export const userReducer = (state = intialState, action) => {
    switch (action.type) {

        case HOME_BATCH_1_LOADER_STARTED: {
            return {
                ...state,
                user: {}
            }
        }

        case FETCH_USER_LOADER_STARTED: {
            return {
                ...state,
                loading: true,
                user: {}
            };
        }

        case FETCH_USER_SUCCESS: {
            return {
                ...state,
                loading: false,
                user: action.data.data.user,
                reviews: action.data.data.reviews,
                bookmarks: action.data.data.articles,
                favorites: action.data.data.vendor,
                products: action.data.data.products,
                vendor: action.data.data.vendor,
                vendorWishlist: action.data.data.vendorWishlist,
                reviewUser: action.data.data.reviewUser
            };
        }

        case FETCH_USER_ERROR: {
            return {
                ...state,
                loading: false
            };
        }

        case TOGGLE_LOGIN_MODAL: {
            return {
                ...state,
                showLoginModal: !state.showLoginModal
            }
        }

        case GOOGLE_USER_LOGGING_UP_SUCCESS: {
            return {
                ...state,
                showLoginModal: false
            };
        }

        case FACEBOOK_USER_LOGGING_UP_SUCCESS: {
            return {
                ...state,
                showLoginModal: false
            };
        }

        case FOLLOW_UNFOLLOW_USER_LOADER: {
            if(action.data.status) {
                if (!_.isEmpty(state.user)) {
                    const user = state.user;
                    user.isFollowing = true;
                    user.followerCount = parseInt(user.followerCount) + 1;
                    return {
                        ...state,
                        user
                    };
                }  else {
                    return {
                        ...state
                    }
                }
            } else {
                if (!_.isEmpty(state.user)) {
                    const user = state.user;
                    user.isFollowing = false;
                    user.followerCount = parseInt(user.followerCount) - 1;
                    return {
                        ...state,
                        user
                    };
                }  else {
                    return {
                        ...state
                    }
                }
            }
        }

        case FOLLOW_UNFOLLOW_USER_SUCCESS: {
            return {
                ...state
            };
        }

        case FOLLOW_UNFOLLOW_USER_ERROR: {
            return {
                ...state
            };
        }

        case LIKE_REVIEW_LOADER: {
            if (action.data.status) {
                if (_.find(state.reviews, { _id: String(action.data.review)})) {
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
                if (_.find(state.reviews, { _id: String(action.data.review)})) {
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

        case LIKE_REVIEW_SUCCESS: {
            return {
                ...state
            };
        }

        case LIKE_REVIEW_ERROR: {
            return {
                ...state
            };
        }

        case ADD_COMMENT_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case ADD_COMMENT_REVIEW_SUCCESS: {
            const reviews = state.reviews;
            const comment = action.data.data.comment;
            const users = state.reviewUser;
            const user = action.data.data.user;
            if (!_.find(users, { username: user.username })) {
                users.push(user);
            }
            if (reviews && reviews.length > 0) {
                if (_.find(reviews, { _id: action.data.data.reviewId })) {
                    reviews[_.findIndex(reviews, { _id: action.data.data.reviewId })].comment = comment;
                }
                return {
                    ...state,
                    reviews,
                    reviewUser: users
                }
            } else {
                return {
                    ...state
                };
            }
        }

        case ADD_COMMENT_REVIEW_ERROR: {
            return {
                ...state
            };
        }

        case LIKE_DISLIKE_VENDOR_SUCCESS: {
            return {
                ...state
            };
        }

        case LIKE_DISLIKE_VENDOR_LOADER: {
            if (action.data.action === 'like') {
                if (action.data.status) {
                    const vendors = state.favorites;
                    if (vendors && vendors.length > 0) {
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = true;
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) + 1;
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) - 1;
                        }
                        return {
                            ...state,
                            favorites: vendors
                        };
                    } else {
                        return {
                            ...state
                        };
                    }
                } else {
                    const vendors = state.favorites;
                    if (vendors && vendors.length > 0) {
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) - 1;
                        }
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) - 1;
                        }
                        return {
                            ...state,
                            favorites: vendors
                        };
                    } else {
                        return {
                            ...state
                        };
                    }
                }
            } else if (action.data.action === 'dislike') {
                if (action.data.status) {
                    const vendors = state.favorites;
                    if (vendors && vendors.length > 0) {
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = true;
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) + 1;
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) - 1;
                        }
                        return {
                            ...state,
                            favorites:vendors
                        };
                    } else {
                        return {
                            ...state
                        };
                    }
                } else {
                    const vendors = state.favorites;
                    if (vendors && vendors.length > 0) {
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) - 1;
                        }
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) - 1;
                        }
                        return {
                            ...state,
                            favorites: vendors
                        };
                    } else {
                        return {
                            ...state
                        }
                    }
                }
            } else {
                return {
                    ...state
                }
            }
        }

        case LIKE_DISLIKE_VENDOR_ERROR: {
            return {
                ...state
            }
        }

        case UPDATE_USER_DATA_LOADER_STARTED: {

            return {
                ...state,
                userLoading: true
            };
        }

        case UPDATE_USER_DATA_SUCCESS: {

            let userData = Object.assign({}, state.user, action.data);
            return {
                ...state,
                user: userData,
                userLoading: true
            };
        }

        case LOAD_MORE_USER_LOADER: {
            return {
                ...state,
                loadingData: true
            };
        }

        case LOAD_MORE_USER_SUCCESS: {
            const type = action.data.data.type;
            if (type === 'review') {
                const reviews = action.data.data.reviews;
                const vendor = action.data.data.vendor;
                if (reviews.length === 0) {
                    return {
                        ...state,
                        allReviewLoaded: true,
                        loadingData: false
                    };
                } else {
                    return {
                        ...state,
                        reviews: _.union(state.reviews, reviews),
                        vendorWishlist: _.union(state.vendorWishlist, vendor),
                        allReviewLoaded: false,
                        reviewUser: action.data.data.reviewUser,
                        loadingData: false
                    };
                }
            } else if (type === 'articles') {
                const articles = action.data.data.articles;
                if (articles.length === 0) {
                    return {
                        ...state,
                        allBookmarksLoaded: true,
                        loadingData: false
                    };
                } else {
                    return {
                        ...state,
                        bookmarks: _.union(state.bookmarks, articles),
                        allBookmarksLoaded: false,
                        loadingData: false
                    };
                }
            } else if (type === 'vendors') {
                const vendors = action.data.data.vendors;
                if (vendors.length === 0) {
                    return {
                        ...state,
                        allFavoritesLoaded: true,
                        loadingData: false
                    };
                } else {
                    return {
                        ...state,
                        favorites: _.union(state.favorites, vendors),
                        allFavoritesLoaded: false,
                        loadingData: false
                    };
                }
            } else if (type === 'products') {
                const products = action.data.data.products;
                if (products.length === 0) {
                    return {
                        ...state,
                        allProductsLoaded: true,
                        loadingData: false
                    };
                } else {
                    return {
                        ...state,
                        allProductsLoaded: false,
                        products: _.union(state.products, products),
                        loadingData: false
                    }
                }
            } else if (type === 'blogs') {
                const blogs = action.data.data.blogs;
                if (blogs.length === 0) {
                    return {
                        ...state,
                        allBlogsLoaded: true,
                        loadingData: false
                    };
                } else {
                    return {
                        ...state,
                        allBlogsLoaded: false,
                        blogs: _.union(state.blogs, blogs),
                        loadingData: false
                    }
                }
            } else {
                return {
                    ...state,
                    loadingData: false
                };
            }
        }

        case LOAD_MORE_USER_ERROR: {
            return {
                ...state,
                loadingData: false
            };
        }

        case ADD_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case ADD_REVIEW_SUCCESS: {
            const reviews = state.reviews;
            let user = state.user;
            let vendorWishlist = state.vendorWishlist;
            if (_.find(state.reviews, { vendor: action.data.data.review.vendor })) {
                reviews[_.findIndex(reviews, { vendor: action.data.data.review.vendor })] = action.data.data.review;
                vendorWishlist.rating = action.data.data.rating;
            }
            return {
                ...state,
                reviews,
                user,
                vendorWishlist
            };
        }

        case ADD_REVIEW_ERROR: {
            return {
                ...state
            }
        }

        case DELETE_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case DELETE_REVIEW_SUCCESS: {
            const reviews = state.reviews;
            const reviewId = action.data.data.reviewId;
            if (_.find(reviews, { _id: reviewId })) {
                reviews.splice(_.findIndex(reviews, { _id: reviewId }), 1);
            }
            return {
                ...state,
                reviews,
                user: {
                    ...state.user,
                    reviewCount: parseInt(state.user.reviewCount) -1
                }
            };
        }

        case DELETE_REVIEW_ERROR: {
            return {
                ...state
            };
        }

        case DELETE_COMMENT_SUCCESS: {
            const reviews = state.reviews;
            const commentId = action.data.commentId;
            const reviewId = action.data.reviewId;
            const review = reviews[_.findIndex(reviews, { _id: reviewId })];
            if (review && _.findIndex(review.comment, {_id: commentId}) !== -1) {
                review.comment.splice(_.findIndex(review.comment, { _id: commentId }), 1);
            }
            reviews[_.findIndex(reviews, { _id: reviewId })] = review;
            return {
                ...state,
                reviews
            }
        }



        default: {
            return {
                ...state
            };
        }
    }
};