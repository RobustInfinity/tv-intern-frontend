 /* eslint-disable radix*/
import _ from 'lodash';
import {
    FETCH_VENDOR_ERROR,
    FETCH_VENDOR_SUCCESS,
    FETCH_VENDOR_LOADER_STARTED,
    HOME_BATCH_1_LOADER_STARTED,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS,
    FOLLOW_UNFOLLOW_VENDOR_SUCCESS,
    FOLLOW_UNFOLLOW_VENDOR_LOADER,
    FOLLOW_UNFOLLOW_VENDOR_ERROR,
    LIKE_DISLIKE_VENDOR_SUCCESS,
    LIKE_DISLIKE_VENDOR_LOADER,
    LIKE_DISLIKE_VENDOR_ERROR,
    FOLLOW_UNFOLLOW_USER_LOADER,
    FOLLOW_UNFOLLOW_USER_SUCCESS,
    FOLLOW_UNFOLLOW_USER_ERROR,
    LIKE_REVIEW_ERROR,
    LIKE_REVIEW_SUCCESS,
    LIKE_REVIEW_LOADER,
    ADD_COMMENT_REVIEW_ERROR,
    ADD_COMMENT_REVIEW_SUCCESS,
    ADD_COMMENT_REVIEW_LOADER,
    ADD_REVIEW_ERROR,
    ADD_REVIEW_SUCCESS,
    ADD_REVIEW_LOADER,
    FETCH_PRODUCTS_VENDOR_ERROR,
    FETCH_PRODUCTS_VENDOR_SUCCESS,
    FETCH_PRODUCTS_VENDOR_LOADER,
    SHOW_ALL_ARTICLES_VENDOR_ERROR,
    SHOW_ALL_ARTICLES_VENDOR_SUCCESS,
    SHOW_ALL_ARTICLES_VENDOR_LOADER,
    SHOW_ALL_VIDEO_VENDOR_ERROR,
    SHOW_ALL_VIDEO_VENDOR_SUCCESS,
    SHOW_ALL_VIDEO_VENDOR_LOADER,
    SHOW_ALL_IMAGES_VENDOR_ERROR,
    SHOW_ALL_IMAGES_VENDOR_SUCCESS,
    SHOW_ALL_IMAGES_VENDOR_LOADER,
    DELETE_REVIEW_LOADER,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_ERROR,
    FETCH_VENDOR_DETAILS_ERROR,
    FETCH_VENDOR_DETAILS_LOADER_STARTED,
    FETCH_VENDOR_DETAILS_SUCCESS,
    FETCH_SIMILAR_VENDOR_ERROR,
    FETCH_SIMILAR_VENDOR_SUCCESS,
    FETCH_SIMILAR_VENDOR_LOADER,
    DELETE_COMMENT_SUCCESS
} from '../../constant/index';


const intialState = {
    loading: false,
    vendor: {},
    videos: [],
    images: [],
    reviews: [],
    users: [],
    articles: [],
    products: [],
    imageCount: 0,
    commentLoading: false,
    showAllPageLoading: false,
    allProductsLoaded: false,
    showAllProducts: [],
    showAllArticles: [],
    allArticlesLoaded: false,
    showAllVideos: [],
    allVideosLoaded: false,
    showAllImages: [],
    allImagesLoaded: false,
    loadingDetail: false,
    loadingSimilarVendors: false,
    similarVendors: [],
};

export const vendorReducer = (state = intialState, action) => {

    switch(action.type) {


        case HOME_BATCH_1_LOADER_STARTED: {
            return {
                ...state,
                vendor: {},
            };
        }

        case FETCH_VENDOR_LOADER_STARTED: {
            return {
                ...state,
                loading: true,
                vendor: {},
                loadingDetail: true,
                loadingSimilarVendors: true
            };
        }

        case FETCH_VENDOR_SUCCESS: {
            return {
                ...state,
                loading: false,
                vendor: action.data.vendorData.vendor
            };
        }

        case FETCH_VENDOR_ERROR: {
            return {
                ...state,
                loading: false
            };
        }

        case FETCH_VENDOR_DETAILS_LOADER_STARTED: {
            return {
                ...state
            };
        }

        case FETCH_VENDOR_DETAILS_SUCCESS: {
            return {
                ...state,
                videos: action.data.vendorData.experienceVideos,
                images: action.data.vendorData.experienceImages,
                reviews: action.data.vendorData.reviews,
                users: action.data.vendorData.users,
                articles: action.data.vendorData.articles,
                products: action.data.vendorData.services,
                imageCount: action.data.vendorData.imageCount,
                loadingDetail: false
            };
        }

        case FETCH_VENDOR_DETAILS_ERROR: {
            return {
                ...state,
                loadingDetail: false
            };
        }

        case FETCH_SIMILAR_VENDOR_LOADER: {
            return {
                ...state
            };
        }

        case FETCH_SIMILAR_VENDOR_SUCCESS: {
            return {
                ...state,
                loadingSimilarVendors: false,
                similarVendors: action.data.data
            };
        }

        case FETCH_SIMILAR_VENDOR_ERROR: {
            return {
                ...state,
                loadingSimilarVendors: false
            };
        }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS: {
            return {
                ...state
            };
        }



        case LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER: {
            if (action.data.action === 'like') {
                if (action.data.status) {
                    const experiences = state.videos;
                    const showAllVideos = state.showAllVideos;
                    if (experiences && experiences.length > 0) {
                        if(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })]) {
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked = true;
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount) + 1;
                            if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked) {
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked = false;
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount) - 1;
                            }

                        }
                    }
                    if (showAllVideos && showAllVideos.length > 0) {
                        if(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })]) {
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked = true;
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount) + 1;
                            if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked) {
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked = false;
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount) - 1;
                            }

                        }
                    }
                    return {
                        ...state,
                        experiences,
                        showAllVideos
                    };
                } else {
                    const experiences = state.videos;
                    const showAllVideos = state.showAllVideos;
                    if(experiences && experiences.length > 0) {
                        if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })]) {
                            if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked) {
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked = false;
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount) - 1;
                            }
                            if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked) {
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked = false;
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount) - 1;
                            }
                        }
                    }
                    if(showAllVideos && showAllVideos.length > 0) {
                        if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })]) {
                            if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked) {
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked = false;
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount) - 1;
                            }
                            if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked) {
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked = false;
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount) - 1;
                            }
                        }
                    }
                    return {
                        ...state,
                        experiences,
                        showAllVideos
                    };
                }
            } else if (action.data.action === 'dislike') {
                if (action.data.status) {
                    const experiences = state.videos;
                    const showAllVideos = state.showAllVideos;
                    if (experiences && experiences.length > 0) {
                        if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })]) {
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked = true;
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount) + 1;
                            if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked) {
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked = false;
                                experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount) - 1;
                            }
                        }
                    }
                    if (showAllVideos && showAllVideos.length > 0) {
                        if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })]) {
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked = true;
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount) + 1;
                            if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked) {
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked = false;
                                showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount) - 1;
                            }
                        }
                    }
                    return {
                        ...state,
                        experiences,
                        showAllVideos
                    };
                } else {
                    const experiences = state.videos;
                    const showAllVideos = state.showAllVideos;
                    if (experiences && experiences.length > 0 && experiences[_.findIndex(experiences, { _id: String(action.data.experience) })]) {
                        if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked) {
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isDisliked = false;
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].dislikeCount) - 1;
                        }
                        if (experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked) {
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].isLiked = false;
                            experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount = parseInt(experiences[_.findIndex(experiences, { _id: String(action.data.experience) })].likeCount) - 1;
                        }
                    }
                    if (showAllVideos && showAllVideos.length > 0 && showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })]) {
                        if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked) {
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isDisliked = false;
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].dislikeCount) - 1;
                        }
                        if (showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked) {
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].isLiked = false;
                            showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, { _id: String(action.data.experience) })].likeCount) - 1;
                        }
                    }
                    return {
                        ...state,
                        experiences,
                        showAllVideos
                    };
                }
            } else {
                return {
                    ...state
                }
            }
        }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR: {
            return {
                ...state
            }
        }

        case FOLLOW_UNFOLLOW_VENDOR_LOADER: {
            if (action.data.status) {
                return {
                    ...state,
                    vendor: {
                        ...state.vendor,
                        isFollowing: true,
                        followerCount: parseInt(state.vendor.followerCount) + 1
                    }
                }
            } else {
                return {
                    ...state,
                    vendor: {
                        ...state.vendor,
                        isFollowing: false,
                        followerCount: parseInt(state.vendor.followerCount) - 1
                    }
                }
            }
        }

        case FOLLOW_UNFOLLOW_VENDOR_SUCCESS: {
            return {
                ...state
            };
        }

        case FOLLOW_UNFOLLOW_VENDOR_ERROR: {
            return {
                ...state
            };
        }

        case LIKE_DISLIKE_VENDOR_LOADER: {
            if (action.data.action === 'like') {
                if (action.data.status) {
                    const vendors = state.similarVendors;
                    const vendor = state.vendor;
                    if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })]) {
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = true;
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) + 1;
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) - 1;
                        }
                    }
                    if (vendor._id === String(action.data.vendor)) {
                        vendor.isLiked = true;
                    }
                    return {
                        ...state,
                        similarVendors: vendors,
                        vendor
                    };
                } else {
                    const vendors = state.similarVendors;
                    const vendor = state.vendor;
                    if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })]) {
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) - 1;
                        }
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) - 1;
                        }
                    }
                    if (vendor._id === String(action.data.vendor)) {
                        vendor.isLiked = false;
                    }
                    return {
                        ...state,
                        similarVendors: vendors,
                        vendor
                    };
                }
            } else if (action.data.action === 'dislike') {
                if (action.data.status) {
                    const vendors = state.similarVendors;
                    if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })]) {
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isDisliked = true;
                        vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].dislikeCount) + 1;
                        if (vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked) {
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].isLiked = false;
                            vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount = parseInt(vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })].likeCount) - 1;
                        }
                        return {
                            ...state,
                            similarVendors: vendors
                        };
                    } else {
                        return {
                            ...state
                        };
                    }
                } else {
                    const vendors = state.similarVendors;
                    if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, { _id: String(action.data.vendor) })]) {
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
                            similarVendors: vendors
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

        case LIKE_DISLIKE_VENDOR_SUCCESS: {
            return {
                ...state
            };
        }

        case LIKE_DISLIKE_VENDOR_ERROR: {
            return {
                ...state
            };
        }

        case FOLLOW_UNFOLLOW_USER_LOADER: {
            if(action.data.status) {
               if (_.find(state.users, { username: action.data.username })) {
                   const users = state.users;
                   users[_.findIndex(state.users, { username: action.data.username })].isFollowing = true;
                   users[_.findIndex(state.users, { username: action.data.username })].followerCount = parseInt(users[_.findIndex(state.users, { username: action.data.username })].followerCount) + 1;
                   return {
                       ...state,
                       users
                   };
               }  else {
                   return {
                       ...state
                   }
               }
            } else {
                if (_.find(state.users, { username: action.data.username })) {
                    const users = state.users;
                    users[_.findIndex(state.users, { username: action.data.username })].isFollowing = false;
                    users[_.findIndex(state.users, { username: action.data.username })].followerCount = parseInt(users[_.findIndex(state.users, { username: action.data.username })].followerCount) - 1;
                    return {
                        ...state,
                        users
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

        case ADD_COMMENT_REVIEW_SUCCESS: {
            const reviews = state.reviews;
            const comment = action.data.data.comment;
            const users = state.users;
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
                    users
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

        case ADD_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case ADD_REVIEW_SUCCESS: {
            if(state.reviews.length < 2) {
                const reviews = state.reviews;
                let users = state.users;
                let vendor = state.vendor;
                if (_.find(state.users, { username: action.data.data.user.username })) {
                    // users[_.findIndex(state.users, { username: action.data.data.user.username })].reviewCount = parseInt(users[_.findIndex(state.users, { username: action.data.data.user.username })].reviewCount) + 1;
                    reviews[_.findIndex(reviews, { user: action.data.data.user.username })] = action.data.data.review;
                    vendor.rating = action.data.data.rating;
                } else {
                    users.push(action.data.data.user);
                    reviews.push(action.data.data.review);
                    vendor.reviewCount = parseInt(state.vendor.reviewCount) + 1;
                    vendor.rating = action.data.data.rating;
                }
                return {
                    ...state,
                    reviews,
                    users,
                    vendor
                };
            } else {
                let users = state.users;
                let vendor = state.vendor;
                if (_.find(state.users, { username: action.data.data.user.username }) && action.data.data.newReview) {
                    users[_.findIndex(state.users, { username: action.data.data.user.username })].reviewCount = parseInt(users[_.findIndex(state.users, { username: action.data.data.user.username })].reviewCount) + 1;
                    vendor.reviewCount = parseInt(state.vendor.reviewCount) + 1;
                    vendor.rating = action.data.data.rating;
                }
                return {
                    ...state,
                    users,
                    vendor
                };
            }
        }

        case ADD_REVIEW_ERROR: {
            return {
                ...state
            }
        }

        case FETCH_PRODUCTS_VENDOR_LOADER: {
            return {
                ...state,
                showAllPageLoading: true,
                allProductsLoaded: false,
                showAllProducts: []
            };
        }

        case FETCH_PRODUCTS_VENDOR_SUCCESS: {
            if (action.data.data.length > 0) {
                return {
                    ...state,
                    showAllPageLoading: false,
                    showAllProducts: _.union(state.showAllProducts, action.data.data),
                    allProductsLoaded: false
                };
            } else {
                return {
                    ...state,
                    showAllPageLoading: false,
                    allProductsLoaded: true
                };
            }
        }

        case FETCH_PRODUCTS_VENDOR_ERROR: {
            return {
                ...state,
                showAllPageLoading: false
            };
        }

        case SHOW_ALL_ARTICLES_VENDOR_LOADER: {
            return {
                ...state,
                showAllPageLoading: true,
                allArticlesLoaded: false,
                showAllArticles: []
            };
        }

        case SHOW_ALL_ARTICLES_VENDOR_SUCCESS: {
            if (action.data.data.length > 0) {
                return {
                    ...state,
                    showAllPageLoading: false,
                    showAllArticles: _.union(state.showAllArticles, action.data.data),
                    allArticlesLoaded: false
                };
            } else {
                return {
                    ...state,
                    showAllPageLoading: false,
                    allArticlesLoaded: true
                };
            }
        }

        case SHOW_ALL_ARTICLES_VENDOR_ERROR: {
            return {
                ...state,
                showAllPageLoading: false
            };
        }

        case SHOW_ALL_VIDEO_VENDOR_LOADER: {
            return {
                ...state,
                showAllPageLoading: true,
                allVideosLoaded: false,
                showAllVideos: []
            };
        }

        case SHOW_ALL_VIDEO_VENDOR_SUCCESS: {
            if (action.data.data.length > 0) {
                return {
                    ...state,
                    showAllPageLoading: false,
                    showAllVideos: _.union(state.showAllVideos, action.data.data),
                    allVideosLoaded: false
                };
            } else {
                return {
                    ...state,
                    showAllPageLoading: false,
                    allVideosLoaded: true
                };
            }
        }

        case SHOW_ALL_VIDEO_VENDOR_ERROR: {
            return {
                ...state,
                showAllPageLoading: false
            };
        }

        case SHOW_ALL_IMAGES_VENDOR_LOADER: {
            return {
                ...state,
                showAllPageLoading: true,
                allImagesLoaded: false,
                showAllImages: []
            };
        }

        case SHOW_ALL_IMAGES_VENDOR_SUCCESS: {
            if (action.data.data.length > 0) {
                return {
                    ...state,
                    showAllPageLoading: false,
                    showAllImages: _.union(state.showAllImages, action.data.data),
                    allImagesLoaded: false
                };
            } else {
                return {
                    ...state,
                    showAllPageLoading: false,
                    allImagesLoaded: true
                };
            }
        }

        case SHOW_ALL_IMAGES_VENDOR_ERROR: {
            return {
                ...state,
                showAllPageLoading: false
            };
        }

        case DELETE_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case DELETE_REVIEW_SUCCESS: {
            const reviews = state.reviews;
            const rating = action.data.data.rating;
            const reviewId = action.data.data.reviewId;
            const users = state.users;
            const user = action.data.data.user;
            if (_.find(reviews, { _id: reviewId })) {
                reviews.splice(_.findIndex(reviews, { _id: reviewId }), 1);
            }
            if (_.find(users, { username: user })) {
                const changeUser = _.find(users, { username: user });
                changeUser.reviewCount = parseInt(changeUser.reviewCount) - 1;
                users[_.findIndex(users, { username: user })] = changeUser;
            }
            return {
                ...state,
                reviews,
                vendor: {
                    ...state.vendor,
                    rating,
                    reviewCount: parseInt(state.vendor.reviewCount) - 1
                },
                users
            };
        }

        case DELETE_REVIEW_ERROR: {
            return {
                ...state
            };
        }


        default:
            return {
                ...state
            };
    }

};