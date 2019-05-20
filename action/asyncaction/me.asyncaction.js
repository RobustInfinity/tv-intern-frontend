import {
    asyncGoogleSigningError,
    asyncGoogleSigningLoadingStarted,
    asyncGoogleSigningSuccess,
    asyncFacebookLoggingLoaderStarted,
    asyncFacebookLoggingSuccess,
    asyncFacebookLoggingError,
    asyncCheckTokenLoadingStarted,
    asyncCheckTokenError,
    asyncCheckTokenSuccess,
    asyncLikeDislikeExperienceVideoError,
    asyncLikeDislikeExperienceVideoLoader,
    asyncLikeDislikeExperienceVideoSuccess,
    asyncLikeDislikeVendorError,
    asyncLikeDislikeVendorLoader,
    asyncLikeDislikeVendorSuccess,
    asyncFollowUnfollowUserError,
    asyncFollowUnfollowUserLoader,
    asyncFollowUnfollowUserSuccess,
    asyncFollowUnfollowVendorError,
    asyncFollowUnfollowVendorLoader,
    asyncFollowUnfollowVendorSuccess,
    asyncLikeReviewError,
    asyncLikeReviewLoader,
    asyncLikeReviewSuccess,
    asyncAddCommentError,
    asyncAddCommentLoader,
    asyncAddCommentSuccess,
    asyncLikeProductReviewError,
    asyncLikeProductReviewLoader,
    asyncLikeProductReviewSuccess,
} from '../action/me.action';

import {
    TOGGLE_SHARE_MODAL,
    LOGOUT_USER,
    TOGGLE_PICTURE_MODAL
} from '../../constant/index';

import {
    GOOGLE_SIGN_IN_API,
    SIGN_IN_API,
    CHECKING_TOKEN_API,
    LIKE_DISLIKE_API_EXPERIENCE_VIDEO_API,
    LIKE_DISLIKE_VENDOR_API,
    FOLLOW_UNFOLLOW_VENDOR_API,
    FOLLOW_UNFOLLOW_USER_API,
    LIKE_REVIEW_API,
    ADD_COMMENT_API,
    PRODUCT_LIKE_REVIEW_API,
} from '../../constant/api';

import {
    getCallApi,
    postCallApi
} from '../../util/util';

/**
 * Async Action for Google login
 * @author Rishabh Rawat
 * @param userData Object contains user data
 * @param id String googleId
 * @returns {function(*)}
 */
export const asyncGoogleSignin = (userData, id) => {
    let userDataToBeSent = {};
    if (userData.profileObj) {
        const data = userData.profileObj;
        userDataToBeSent = {
            gender: data.gender,
            displayName: data.name,
            id: data.googleId,
            email: data.email,
            profilePicture: data.imageUrl
        };
        if (userData.isReferred) {
            userDataToBeSent.referredBy = userData.referredBy;
            userDataToBeSent.isReferred = true;
        }
    }
    return (dispatch) => {
        dispatch(asyncGoogleSigningLoadingStarted());
        if (!userData.profileObj.email) {
            getCallApi(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userData.credential.accessToken}`)
                .then(data => {
                    if (data.email) {
                        userDataToBeSent['email'] = data.email;
                    }
                })
        }
        return getCallApi(GOOGLE_SIGN_IN_API(userDataToBeSent.id))
            .then((data) => {
                if (data.coverPhotos) {
                    userDataToBeSent['coverPicture'] = data.coverPhotos[0].url;
                }
                if (data.genders) {
                    userDataToBeSent['gender'] = data.genders[0].value;
                }

                return new Promise((resolve, reject) => {
                    postCallApi(SIGN_IN_API('google'), userDataToBeSent)
                        .then((savedUserData) => {
                            if (savedUserData.success) {
                                let dataToBeSentToReducers = {
                                    success: true,
                                    user: {
                                        displayName: savedUserData.data.user.displayName,
                                        email: savedUserData.data.user.email,
                                        profilePicture: savedUserData.data.user.profilePicture,
                                        coverPicture: savedUserData.data.user.coverPicture,
                                        username: savedUserData.data.user.username,
                                        interests: savedUserData.data.user.interests,
                                        phoneNumber: savedUserData.data.user.phoneNumber,
                                        existing: savedUserData.data.user.existing,
                                        draft: savedUserData.data.user.draft,
                                        description: savedUserData.data.user.description
                                    },
                                    accessToken: savedUserData.data.accessToken
                                };
                                dispatch(asyncGoogleSigningSuccess({userData: dataToBeSentToReducers, vendor: savedUserData.data.vendor}));
                                return resolve(dataToBeSentToReducers);
                            }
                            if (!savedUserData.success) {
                                dispatch(asyncGoogleSigningError(savedUserData));
                                return reject(savedUserData);
                            }

                        })
                        .catch(loginError => {
                            dispatch(asyncGoogleSigningError(loginError));
                            return reject(loginError);
                        });
                });
            })
            .catch((error) => {
                dispatch(asyncGoogleSigningError(error));
                return Promise.reject(error);
            })
    }
};

/**
 * Action to perform facebook login
 * @param userData
 * @returns {function(*)}
 */
export const asyncFacebookLogin = (userData) => {
    const userDataToBeSent = userData;

    return (dispatch) => {
        dispatch(asyncFacebookLoggingLoaderStarted());
        return postCallApi(SIGN_IN_API('facebook'), userDataToBeSent)
            .then((data) => {
                let dataToBeSentToReducers = {
                    success: true,
                    user: {
                        displayName: data.data.user.displayName,
                        email: data.data.user.email,
                        profilePicture: data.data.user.profilePicture,
                        coverPicture: data.data.user.coverPicture,
                        username: data.data.user.username,
                        interests: data.data.user.interests,
                        phoneNumber: data.data.user.phoneNumber,
                        draft: data.data.user.draft,
                        existing: data.data.user.existing,
                        description: data.data.user.description
                    },
                    accessToken: data.data.accessToken
                };
                dispatch(asyncFacebookLoggingSuccess({ userData:dataToBeSentToReducers, vendor: data.data.vendor }));
                return Promise.resolve(dataToBeSentToReducers);
            })
            .catch(error => {
                dispatch(asyncFacebookLoggingError(error));
                return Promise.reject(error);
            })
    }

};

/**
 * Action to perform the checking of json web token in cookie store
 * @param token
 * @returns {function(*)}
 */
export const asyncCheckUserToken = (token) => {
    return (dispatch) => {
        dispatch(asyncCheckTokenLoadingStarted());
        if (!token) {
            dispatch(asyncCheckTokenError({message: 'no token'}));
            return Promise.reject({message: 'no token'});
        } else {
            return postCallApi(CHECKING_TOKEN_API, {
                token: token
            })
                .then(data => {
                    if (data.success) {
                        let joinedSince = new Date(parseInt(data.data.user.joinedSince, 10));
                        const userData = {
                            user: {
                                displayName: data.data.user.displayName,
                                email: data.data.user.email,
                                profilePicture: data.data.user.profilePicture,
                                coverPicture: data.data.user.coverPicture,
                                username: data.data.user.username,
                                interests: data.data.user.interests,
                                description: data.data.user.description,
                                facebookUrl: data.data.user.facebookUrl,
                                twitterUrl: data.data.user.twitterUrl,
                                instagramUrl: data.data.user.instagramUrl,
                                blogUrl: data.data.user.blogUrl,
                                phoneNumber: data.data.user.phoneNumber,
                                draft: data.data.user.draft,
                                joinedSince: joinedSince.getMonth()
    
                            },
                            accessToken: data.data.refreshedToken
                        };
    
                        dispatch(asyncCheckTokenSuccess({userData, vendor: data.data.vendor}));
                        return Promise.resolve(userData);
                    } else {
                        dispatch(asyncCheckTokenError(data));
                        return Promise.reject(data);
                    }
                })
                .catch(error => {
                    dispatch(asyncCheckTokenError(error));
                    return Promise.resolve(error);
                })
        }
    }
};


export const asyncLikeDislikeExperienceVideo = (actionData) => {
    return (dispatch) => {
        dispatch(asyncLikeDislikeExperienceVideoLoader(actionData));
        return postCallApi(LIKE_DISLIKE_API_EXPERIENCE_VIDEO_API, actionData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncLikeDislikeExperienceVideoSuccess(actionData));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncLikeDislikeExperienceVideoError(actionData));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncLikeDislikeExperienceVideoError(error));
                return Promise.reject(error);
            })
    }
};

export const asyncLikeDislikeVendor = (actionData) => {
    return (dispatch) => {
        dispatch(asyncLikeDislikeVendorLoader(actionData));
        return postCallApi(LIKE_DISLIKE_VENDOR_API, actionData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncLikeDislikeVendorSuccess(actionData));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncLikeDislikeVendorError(actionData));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncLikeDislikeVendorError(error));
                return Promise.reject(error);
            })
    }
};

export const asyncFollowUnfollowVendor = (actionData) => {
    return (dispatch) => {
        dispatch(asyncFollowUnfollowVendorLoader(actionData));
        return postCallApi(FOLLOW_UNFOLLOW_VENDOR_API, actionData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFollowUnfollowVendorSuccess());
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFollowUnfollowVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFollowUnfollowVendorError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncFollowUnfollowUser = (actionData) => {
    return (dispatch) => {
        dispatch(asyncFollowUnfollowUserLoader(actionData));
        return postCallApi(FOLLOW_UNFOLLOW_USER_API, actionData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFollowUnfollowUserSuccess());
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFollowUnfollowUserError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFollowUnfollowUserError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncLikeReview = (actionData) => {
    return (dispatch) => {
        dispatch(asyncLikeReviewLoader(actionData));
        return postCallApi(LIKE_REVIEW_API, actionData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncLikeReviewSuccess());
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncLikeReviewError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncLikeReviewError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncLikeProductReview = (actionData) => {
    return (dispatch) => {
        dispatch(asyncLikeProductReviewLoader(actionData));
        return postCallApi(PRODUCT_LIKE_REVIEW_API, actionData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncLikeProductReviewSuccess());
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncLikeProductReviewError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncLikeProductReviewError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncAddCommentReview = (actionData) => {
    return (dispatch) => {
        dispatch(asyncAddCommentLoader());
        return postCallApi(ADD_COMMENT_API, actionData)
            .then((data) => {
                if (data.success) {
                    data.data.reviewId = actionData.review;
                    dispatch(asyncAddCommentSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncAddCommentError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncAddCommentError(error));
                return Promise.reject(error);
            })
    }
};

export const asyncShareModal = (url) => {
    return {
        type: TOGGLE_SHARE_MODAL,
        data:url
    };
};

export const asyncLogout = () => {
    return {
        type: LOGOUT_USER
    };
};

export const asyncTogglePicture = (url) => {
    return {
        type: TOGGLE_PICTURE_MODAL,
        data: url
    }
}