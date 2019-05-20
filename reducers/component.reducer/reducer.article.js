/* eslint-disable radix*/
import _ from 'lodash';
import {
    TRENDING_ARTICLES_API_SUCCESS,
    FETCH_SIMILAR_ARTICLES_API_SUCCESS,
    SIMILAR_ARTICLES_API_LOADER,
    SIMILAR_ARTICLES_API_SUCCESS,
    SIMILAR_ARTICLES_API_ERROR,
    FETCH_ARTICLE_ERROR,
    FETCH_ARTICLE_SUCCESS,
    FETCH_ARTICLE_LOADER,
    ARTICLE_ACTION_ERROR,
    ARTICLE_ACTION_SUCCESS,
    ARTICLE_ACTION_LOADER,
    FOLLOW_UNFOLLOW_VENDOR_SUCCESS,
    FOLLOW_UNFOLLOW_VENDOR_LOADER,
    FOLLOW_UNFOLLOW_VENDOR_ERROR,
    FOLLOW_UNFOLLOW_USER_LOADER,
    FOLLOW_UNFOLLOW_USER_SUCCESS,
    FOLLOW_UNFOLLOW_USER_ERROR,
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

const intialState = {
    loading:false,
    article: {},
    user: {},
    vendor: {},
    comments: [],
    commentUser: [],
    commentsLoading: false,
    similarArticle:[],
    similarArticleUsers:[],
    trendingArticle:[]
};

export const articleReducer = (state = intialState, action) => {

    switch (action.type) {
        case TRENDING_ARTICLES_API_SUCCESS: {
            // console.log(action);
            return {
                ...state,
                trendingArticle: action.data.data.trendingArticles
            };
        }
        
        case FETCH_SIMILAR_ARTICLES_API_SUCCESS: {
            // console.log(action)
            return {
                ...state,
                similarArticle : action.data.data.similarArticles,
                similarArticleUsers : action.data.data.similarArticleUsers
            };
        }

        case SIMILAR_ARTICLES_API_LOADER: {
            if (action.data.action === 'like') {
                const data = state.article;
                data.isLiked = action.data.status;
                return {
                    ...state,
                    article: data
                };
            } else if (action.data.action === 'bookmark') {
                const data = state.article;
                data.isBookmarked = action.data.status;
                return {
                    ...state,
                    article: data
                };
            } else {
                return {
                    ...state
                };
            }
        }

        case SIMILAR_ARTICLES_API_SUCCESS: {
            return {
                ...state
            };
        }

        case SIMILAR_ARTICLES_API_ERROR: {
            return {
                ...state
            };
        }

        case FETCH_ARTICLE_LOADER: {
            return {
                ...state,
                loading: true
            };
        }

        case FETCH_ARTICLE_SUCCESS: {
            return {
                ...state,
                loading: false,
                article: action.data.data.article,
                user: action.data.data.user,
                vendor: action.data.data.vendor
            };
        }

        case FETCH_ARTICLE_ERROR: {
            return {
                ...state,
                loading: false
            };
        }

        case ARTICLE_ACTION_LOADER: {
            if (action.data.action === 'like') {
                const data = state.article;
                data.isLiked = action.data.status;
                return {
                    ...state,
                    article: data
                };
            } else if (action.data.action === 'bookmark') {
                const data = state.article;
                data.isBookmarked = action.data.status;
                return {
                    ...state,
                    article: data
                };
            } else {
                return {
                    ...state
                };
            }
        }

        case ARTICLE_ACTION_SUCCESS: {
            return {
                ...state
            };
        }

        case ARTICLE_ACTION_ERROR: {
            return {
                ...state
            };
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

        case FOLLOW_UNFOLLOW_USER_LOADER: {
            if(action.data.status) {
                if (!_.isEmpty(state.user)) {
                    const user = state.user;
                    user.isFollowing = true;
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
            if (!_.find(commentUser, {username: user.username})) {
                commentUser.push(user);
            }
            comments.unshift(comment);
            return {
                ...state,
                comments,
                commentUser
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
                comments[_.findIndex(comments, { _id: actionData.commentId })] = comment;
                return {
                    ...state,
                    comments
                };
            } else if (actionData.action === 'dislike') {
                const comment = _.find(state.comments, { _id: actionData.commentId });
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
                comments[_.findIndex(comments, { _id: actionData.commentId })] = comment;
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
            }
        }

    }

};