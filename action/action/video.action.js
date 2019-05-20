import {
    FETCH_VIDEO_LOADER,
    FETCH_VIDEO_SUCCESS,
    FETCH_VIDEO_ERROR,
    ADD_COMMENT_LOADER,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_ERROR,
    FETCH_COMMENTS_ERROR,
    FETCH_COMMENTS_LOADER,
    FETCH_COMMENTS_SUCCESS,
    COMMENT_ACTION_ERROR,
    COMMENT_ACTION_LOADER,
    COMMENT_ACTION_SUCCESS
} from '../../constant/index';

export const asyncFetchVideoLoader = () => {
    return {
        type: FETCH_VIDEO_LOADER
    };
};

export const asyncFetchVideoSuccess = (data) => {
    return {
        type: FETCH_VIDEO_SUCCESS,
        data
    };
};

export const asyncFetchVideoError = (error) => {
    return {
        type: FETCH_VIDEO_ERROR,
        error
    };
};

export const asyncAddCommentLoader = () => {
    return {
        type: ADD_COMMENT_LOADER
    };
};

export const asyncAddCommentSuccess = (data) => {
    return {
        type: ADD_COMMENT_SUCCESS,
        data
    };
};

export const asyncAddCommentError = (error) => {
    return {
        type: ADD_COMMENT_ERROR,
        error
    };
};

export const asyncFetchCommentsLoader = () => {
    return {
        type: FETCH_COMMENTS_LOADER
    };
};

export const asyncFetchCommentsSuccess = (data) => {
    return {
        type: FETCH_COMMENTS_SUCCESS,
        data
    };
};

export const asyncFetchCommentsError = (error) => {
    return {
        type: FETCH_COMMENTS_ERROR,
        error
    };
};

export const asyncCommentActionLoader = (data) => {
    return {
        type: COMMENT_ACTION_LOADER,
        data
    };
};

export const asyncCommentActionSuccess = (data) => {
    return {
        type: COMMENT_ACTION_SUCCESS,
        data
    };
};

export const asyncCommentActionError = (error) => {
    return {
        type: COMMENT_ACTION_ERROR,
        error
    };
};