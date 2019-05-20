import {
    asyncReviewError,
    asyncReviewLoader,
    asyncReviewSuccess
} from '../action/review.action';

import {
    FETCH_REVIEW_API,
    DELETE_REVIEW_COMMENT
} from '../../constant/api';
import {
    getCallApi
} from "../../util/util";
import {
    DELETE_COMMENT_SUCCESS
} from '../../constant/index';


export const asyncFetchReviews = (reviewId, token) => {
    return (dispatch) => {
      dispatch(asyncReviewLoader());
      return getCallApi(FETCH_REVIEW_API(reviewId, token))
          .then((data) => {
            if (data.success) {
                dispatch(asyncReviewSuccess(data));
                return Promise.resolve(data);
            } else {
                dispatch(asyncReviewError(data));
                return Promise.reject(data);
            }
          })
          .catch((error) => {
            dispatch(asyncReviewError(error));
            return Promise.reject(error);
          });
    };
};

export const asyncDeleteComment = (reviewId, commentId, token) => {
    return (dispatch) => {
        dispatch({
            type: DELETE_COMMENT_SUCCESS,
            data: {
                reviewId,
                commentId
            }
        });
        return getCallApi(DELETE_REVIEW_COMMENT(reviewId, commentId, token))
            .then((data) => {
                if (data.success) {
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
};