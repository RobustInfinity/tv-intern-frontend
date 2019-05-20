import {
    asyncFetchVideoError,
    asyncFetchVideoSuccess,
    asyncFetchVideoLoader,
    asyncAddCommentError,
    asyncAddCommentSuccess,
    asyncAddCommentLoader,
    asyncFetchCommentsError,
    asyncFetchCommentsLoader,
    asyncFetchCommentsSuccess,
    asyncCommentActionError,
    asyncCommentActionLoader,
    asyncCommentActionSuccess
} from '../action/video.action';

import {
    FETCH_VIDEO_API,
    ADD_COMMENT_VIDEO_API,
    FETCH_COMMENTS_VIDEO_API,
    COMMENT_ACTION_API
} from '../../constant/api';

import {
    postCallApi
} from "../../util/util";

export const asyncFetchVideo = (articleId, token) => {
    return (dispatch) => {
        dispatch(asyncFetchVideoLoader());
        return postCallApi(FETCH_VIDEO_API, {
            articleId,
            token
        })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchVideoSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchVideoError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchVideoError(error));
                return Promise.reject(error)
            });
    };
};

export const asyncAddVideoComments = (articleId, comment, token) => {
    return (dispatch) => {
        dispatch(asyncAddCommentLoader());
        return postCallApi(ADD_COMMENT_VIDEO_API, {
            articleId,
            token,
            comment
        })
            .then((data) => {
                if (data.success) {
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
    };
};

export const asyncFetchComments = (videoId, token) => {
    return (dispatch) => {
        dispatch(asyncFetchCommentsLoader());
        return postCallApi(FETCH_COMMENTS_VIDEO_API, {
            videoId,
            token
        })
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchCommentsSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchCommentsError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchCommentsError(error));
                return Promise.reject(error);
            });
    };
};

export const asyncCommentAction = (data) => {
    return (dispatch) => {
        dispatch(asyncCommentActionLoader(data));
        return postCallApi(COMMENT_ACTION_API, data)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncCommentActionSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncCommentActionError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncCommentActionError(error));
                return Promise.reject(error);
            });
    }
};