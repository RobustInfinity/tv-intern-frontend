import {
    FETCH_REVIEW_LOADER,
    FETCH_REVIEW_SUCCESS,
    FETCH_REVIEW_ERROR
} from '../../constant/index';

export const asyncReviewLoader = () => {
  return {
      type: FETCH_REVIEW_LOADER
  };
};

export const asyncReviewSuccess = (data) => {
  return {
      type: FETCH_REVIEW_SUCCESS,
      data
  };
};

export const asyncReviewError = (error) => {
  return {
      type: FETCH_REVIEW_ERROR,
      error
  };
};
