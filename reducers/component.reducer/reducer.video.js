/* eslint-disable radix*/
import _ from 'lodash';
import {
    FETCH_VIDEO_ERROR,
    FETCH_VIDEO_SUCCESS,
    FETCH_VIDEO_LOADER,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR,
    FOLLOW_UNFOLLOW_USER_ERROR,
    FOLLOW_UNFOLLOW_USER_SUCCESS,
    FOLLOW_UNFOLLOW_USER_LOADER,
    FETCH_COMMENTS_LOADER,
    FETCH_COMMENTS_SUCCESS,
    FETCH_COMMENTS_ERROR,
    ADD_COMMENT_LOADER,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_ERROR,
    COMMENT_ACTION_ERROR,
    COMMENT_ACTION_SUCCESS,
    COMMENT_ACTION_LOADER
} from '../../constant/index';

const initial_State = {
    video: {},
    user: {},
    vendor: {},
    loading: false,
    comments: [],
    commentUser: [],
    commentsLoading: false
};

export const videoReducer = (state = initial_State, action) => {
    switch (action.type) {
        case FETCH_VIDEO_LOADER: {
            return {
                ...state,
                loading: true,
                video: {},
                comments: {}
            };
        }

        case FETCH_VIDEO_SUCCESS: {
            const data = action.data.data;

            return {
                ...state,
                loading: false,
                video: data.video,
                user: data.user,
                vendor: data.vendor
            };
        }

        case FETCH_VIDEO_ERROR: {
            return {
                ...state,
                loading: false
            };
        }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER: {
            const actionData = action.data;
            if (actionData.action === 'like') {
                const video = state.video;
                if (video.isDisliked && actionData.status) {
                    video.dislikeCount = parseInt(video.dislikeCount) - 1;
                    video.isDisliked = !actionData.status;
                }
                if (actionData.status) {
                    video.likeCount = parseInt(video.likeCount) + 1;
                } else {
                    video.likeCount = parseInt(video.likeCount) - 1;
                }
                video.isLiked = actionData.status;
                return {
                    ...state,
                    video
                };
            } else if (actionData.action === 'dislike') {
                const video = state.video;
                if (video.isLiked && actionData.status) {
                    video.likeCount = parseInt(video.likeCount) - 1;
                    video.isLiked = !actionData.status;
                }
                if (actionData.status) {
                    video.dislikeCount = parseInt(video.dislikeCount) + 1;
                } else {
                    video.dislikeCount = parseInt(video.dislikeCount) - 1;
                }
                video.isDisliked = actionData.status;
                return {
                    ...state,
                    video
                };
            } else {
                return {
                    ...state
                };
            }
        }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS: {
            return {
                ...state
            };
        }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR: {
            return {
                ...state
            };
        }

        case FOLLOW_UNFOLLOW_USER_LOADER: {
            if (!_.isEmpty(state.user)) {
                const user = state.user;
                user.isFollowing = action.data.status;
                return {
                    ...state,
                    user
                };
            } else {
                return {
                    ...state
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

        case FETCH_COMMENTS_LOADER: {
            return {
                ...state,
                commentsLoading: true,
                comments: [],
                commentUser: []
            };
        }

        case FETCH_COMMENTS_SUCCESS: {
            return {
                ...state,
                comments: _.union(state.comments, action.data.data.comments),
                commentUser: _.union(state.commentUser, action.data.data.user),
                commentsLoading: false
            };
        }

        case FETCH_COMMENTS_ERROR: {
            return {
                ...state,
                commentsLoading: false
            };
        }

        case ADD_COMMENT_LOADER: {
            return {
                ...state
            };
        }

        case ADD_COMMENT_SUCCESS: {
            const comment = action.data.data.comment;
            const user = action.data.data.user;
            const comments = state.comments;
            const commentUser = state.commentUser;
            if (!_.find(commentUser, { username: user.username })) {
                commentUser.push(user);
            }
            comments.unshift(comment);
            return {
                ...state,
                comments,
                commentUser,
                video: {
                    ...state.video,
                    commentCount: state.video.commentCount ? parseInt(state.video.commentCount) + 1 : 1
                }
            };
        }

        case ADD_COMMENT_ERROR: {
            return {
                ...state
            };
        }

        case COMMENT_ACTION_LOADER: {
            const actionData = action.data;
            if (actionData.action === 'like') {
                const comment = _.find(state.comments, {_id: actionData.commentId});
                const comments = state.comments;
                if (comment.isDisliked && actionData.status) {
                    // comment.dislikeCount = parseInt(comment.dislikeCount) - 1;
                    comment.isDisliked = !actionData.status;
                }
                if (actionData.status) {
                    // comment.likeCount = parseInt(comment.likeCount) + 1;
                } else {
                    // comment.likeCount = parseInt(comment.likeCount) - 1;
                }
                comment.isLiked = actionData.status;
                comments[_.findIndex(comments, {_id: actionData.commentId})] = comment;
                return {
                    ...state,
                    comments
                };
            } else if (actionData.action === 'dislike') {
                const comment = _.find(state.comments, {_id: actionData.commentId});
                const comments = state.comments;
                if (comment.isLiked && actionData.status) {
                    // comment.likeCount = parseInt(comment.likeCount) - 1;
                    comment.isLiked = !actionData.status;
                }
                if (actionData.status) {
                    // comment.dislikeCount = parseInt(comment.dislikeCount) + 1;
                } else {
                    // comment.dislikeCount = parseInt(comment.dislikeCount) - 1;
                }
                comment.isDisliked = actionData.status;
                comments[_.findIndex(comments, {_id: actionData.commentId})] = comment;
                return {
                    ...state,
                    comments
                };
            } else {
                return {
                    ...state
                };
            }
        }

        case COMMENT_ACTION_SUCCESS: {
            return {
                ...state
            };
        }

        case COMMENT_ACTION_ERROR: {
            return {
                ...state
            };
        }

        default: {
            return {
                ...state
            };
        }
    }
};