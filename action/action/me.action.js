import {
    GOOGLE_USER_LOGGING_UP_LOADER_ACTIVATED,
    GOOGLE_USER_LOGGING_UP_ERROR,
    GOOGLE_USER_LOGGING_UP_SUCCESS,
    FACEBOOK_USER_LOGGING_UP_LOADER_ACTIVATED,
    FACEBOOK_USER_LOGGING_UP_SUCCESS,
    FACEBOOK_USER_LOGGING_UP_ERROR,
    CHECK_USER_TOKEN_LOADER_STARTED,
    CHECK_USER_TOKEN_SUCCESS,
    CHECK_USER_TOKEN_ERROR,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS,
    LIKE_DISLIKE_VENDOR_ERROR,
    LIKE_DISLIKE_VENDOR_LOADER,
    LIKE_DISLIKE_VENDOR_SUCCESS,
    FOLLOW_UNFOLLOW_USER_ERROR,
    FOLLOW_UNFOLLOW_USER_LOADER,
    FOLLOW_UNFOLLOW_USER_SUCCESS,
    FOLLOW_UNFOLLOW_VENDOR_ERROR,
    FOLLOW_UNFOLLOW_VENDOR_LOADER,
    FOLLOW_UNFOLLOW_VENDOR_SUCCESS,
    LIKE_REVIEW_ERROR,
    LIKE_REVIEW_LOADER,
    LIKE_REVIEW_SUCCESS,
    ADD_COMMENT_REVIEW_ERROR,
    ADD_COMMENT_REVIEW_LOADER,
    ADD_COMMENT_REVIEW_SUCCESS,
    PRODUCT_LIKE_REVIEW_ERROR,
    PRODUCT_LIKE_REVIEW_LOADER,
    PRODUCT_LIKE_REVIEW_SUCCESS,
} from '../../constant/index';

/**
 * Action to broadcast that google signup have started
 */
export const asyncGoogleSigningLoadingStarted = () => {
    return {
        type: GOOGLE_USER_LOGGING_UP_LOADER_ACTIVATED
    }
};

/**
 * Action to broadcast that Google signin was success.
 * @param data Object user data to saved in database
 * @returns {{type, data: *}}
 */
export const asyncGoogleSigningSuccess = (data) => {
    return {
        type: GOOGLE_USER_LOGGING_UP_SUCCESS,
        data
    }
};

/**
 * Action to broadcast that google signin failed
 * @param error
 * @returns {{type, error: *}}
 */
export const asyncGoogleSigningError = (error) => {
    return {
        type: GOOGLE_USER_LOGGING_UP_ERROR,
        error
    }
};

/**
 * Action to broadcast facebook sigining in has started.
 * @returns {{type}}
 */
export const asyncFacebookLoggingLoaderStarted = () => {
    return {
        type: FACEBOOK_USER_LOGGING_UP_LOADER_ACTIVATED
    }
}

/**
 * Action to broadcast that facebook login have succesfully completed
 * @param data
 * @returns {{type, data: *}}
 */
export const asyncFacebookLoggingSuccess = (data) => {
    return {
        type: FACEBOOK_USER_LOGGING_UP_SUCCESS,
        data
    }
};

/**
 * Action to broadcast that facebook login have failed.
 * @param error
 * @returns {{type, error: *}}
 */
export const asyncFacebookLoggingError = (error) => {
    return {
        type: FACEBOOK_USER_LOGGING_UP_ERROR,
        error
    }
};

/**
 * Action to broadcast that checking of token have started.
 * @returns {{type}}
 */
export const asyncCheckTokenLoadingStarted = () => {
    return {
        type: CHECK_USER_TOKEN_LOADER_STARTED
    }
};

/**
 * Action to broadcast that checking of token was successful with new token and user data.
 * @param data
 * @returns {{type, data: *}}
 */
export const asyncCheckTokenSuccess = (data) => {
    return {
        type: CHECK_USER_TOKEN_SUCCESS,
        data
    }
};

/**
 * Action to broadcast that checking of token failed.
 * @param error
 * @returns {{type, error: *}}
 */
export const asyncCheckTokenError = (error) => {
    return {
        type: CHECK_USER_TOKEN_ERROR,
        error
    }
};

export const asyncLikeDislikeExperienceVideoLoader = (data) => {
    return {
        type: LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER,
        data
    };
};

export const asyncLikeDislikeExperienceVideoSuccess = (success) => {
    return {
        type: LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS,
        data: success
    };
};

export const asyncLikeDislikeExperienceVideoError = (error) => {
    return {
        type: LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR,
        error
    };
};

export const asyncLikeDislikeVendorLoader = (data) => {
    return {
        type: LIKE_DISLIKE_VENDOR_LOADER,
        data
    };
};

export const asyncLikeDislikeVendorSuccess = (data) => {
    return {
        type: LIKE_DISLIKE_VENDOR_SUCCESS,
        data
    };
};

export const asyncLikeDislikeVendorError = (error) => {
    return {
        type: LIKE_DISLIKE_VENDOR_ERROR,
        error
    };
};

export const asyncFollowUnfollowVendorLoader = (data) => {
    return {
        type: FOLLOW_UNFOLLOW_VENDOR_LOADER,
        data
    };
};

export const asyncFollowUnfollowVendorSuccess = () => {
    return {
        type: FOLLOW_UNFOLLOW_VENDOR_SUCCESS
    };
};

export const asyncFollowUnfollowVendorError = (error) => {
    return {
        type: FOLLOW_UNFOLLOW_VENDOR_ERROR,
        error
    };
};

export const asyncFollowUnfollowUserLoader = (data) => {
    return {
        type: FOLLOW_UNFOLLOW_USER_LOADER,
        data
    };
};

export const asyncFollowUnfollowUserSuccess = () => {
    return {
        type: FOLLOW_UNFOLLOW_USER_SUCCESS
    };
};

export const asyncFollowUnfollowUserError = (error) => {
    return {
        type: FOLLOW_UNFOLLOW_USER_ERROR,
        error
    };
};

export const asyncLikeReviewLoader = (data) => {
    return {
        type: LIKE_REVIEW_LOADER,
        data
    };
};

export const asyncLikeReviewSuccess = () => {
    return {
        type: LIKE_REVIEW_SUCCESS
    };
};

export const asyncLikeReviewError = (error) => {
    return {
        type: LIKE_REVIEW_ERROR,
        error
    };
};

export const asyncLikeProductReviewLoader = (data) => {
    return {
        type: PRODUCT_LIKE_REVIEW_LOADER,
        data
    };
};

export const asyncLikeProductReviewSuccess = () => {
    return {
        type: PRODUCT_LIKE_REVIEW_SUCCESS
    };
};

export const asyncLikeProductReviewError = (error) => {
    return {
        type: PRODUCT_LIKE_REVIEW_ERROR,
        error
    };
};

export const asyncAddCommentLoader = () => {
    return {
        type: ADD_COMMENT_REVIEW_LOADER
    };
};

export const asyncAddCommentSuccess = (data) => {
    return {
        type: ADD_COMMENT_REVIEW_SUCCESS,
        data
    };
};

export const asyncAddCommentError = (error) => {
    return {
        type: ADD_COMMENT_REVIEW_ERROR,
        error
    };
};