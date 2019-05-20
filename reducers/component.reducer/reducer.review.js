/* eslint-disable radix*/
import _ from 'lodash';
import {
    FETCH_REVIEW_LOADER,
    FETCH_REVIEW_ERROR,
    FETCH_REVIEW_SUCCESS,
    LIKE_REVIEW_LOADER,
    LIKE_REVIEW_ERROR,
    LIKE_REVIEW_SUCCESS,
    ADD_REVIEW_ERROR,
    ADD_REVIEW_SUCCESS,
    ADD_REVIEW_LOADER,
    DELETE_COMMENT_SUCCESS,
    ADD_COMMENT_REVIEW_SUCCESS
} from "../../constant/index";

const intialState = {
    review: {},
    user: [],
    vendor: {},
    loading: false
};

export const reviewReducer = (state = intialState, action) => {
    switch (action.type) {
        case FETCH_REVIEW_LOADER: {
            return {
                ...state,
                loading: true
            };
        }

        case FETCH_REVIEW_SUCCESS: {
            return {
                ...state,
                loading: false,
                review: action.data.data.review,
                user: action.data.data.user,
                vendor: action.data.data.vendor
            };
        }

        case FETCH_REVIEW_ERROR: {
            return {
                ...state,
                loading: false
            };
        }

        case LIKE_REVIEW_LOADER: {
            if (action.data.status) {
                const review = state.review;
                review.isLiked = true;
                review.likeCount = parseInt(review.likeCount) + 1;
                return {
                    ...state,
                    review
                }
            } else {
                const review = state.review;
                review.isLiked = false;
                review.likeCount = parseInt(review.likeCount) - 1;
                return {
                    ...state,
                    review
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

        case ADD_REVIEW_LOADER: {
            return {
                ...state
            };
        }

        case ADD_REVIEW_SUCCESS: {
            let review = state.review;
            let vendor = state.vendor;
            review = action.data.data.review;
            vendor.rating = action.data.data.rating;
            return {
                ...state,
                review,
                vendor
            };
        }

        case ADD_REVIEW_ERROR: {
            return {
                ...state
            }
        }

        case DELETE_COMMENT_SUCCESS: {
            const review = state.review;
            const commentId = action.data.commentId;
            if (_.findIndex(review.comment, {_id: commentId}) !== -1) {
                review.comment.splice(_.findIndex(review.comment, { _id: commentId }), 1);
            }
            return {
                ...state,
                review
            }
        }

        case ADD_COMMENT_REVIEW_SUCCESS: {
            const comment = action.data.data.comment;
            const userObj = action.data.data.user;
            const user = state.user;
            if (!_.find(user, { username: userObj.username })) {
                user.push(userObj);
            }
            const review = state.review;
            review.comment = comment;
            return {
                ...state,
                review,
                user
            };
        }

        default: {
            return {
                ...state
            };
        }
    }
};