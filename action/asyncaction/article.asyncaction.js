import {
    asyncFetchArticleError,
    asyncFetchArticleSuccess,
    asyncFetchArticleLoader,
    asyncArticleActionError,
    asyncArticleActionLoader,
    asyncArticleActionSuccess,
    
    asyncFetchSimilarArticlesError,
    asyncFetchSimilarArticlesSuccess,
    asyncFetchSimilarArticlesLoader,
    asyncSimilarArticleActionError,
    asyncSimilarArticleActionLoader,
    asyncSimilarArticleActionSuccess,

    asyncTrendingArticleApiLoader,
    asyncTrendingArticleApiSuccess,
    asyncTrendingArticleApiError,

} from '../action/article.action';
import {
    postCallApi,
    getCallApi
} from "../../util/util";
import {
    FETCH_ARTICLE_API,
    ARTICLE_ACTION_API
} from "../../constant/api";
import {
    FETCH_SIMILAR_ARTICLES_API,
    SIMILAR_ARTICLES_API,
    TRENDING_ARTICLES_API
} from '../../constant/api';

export const asyncTrendingArticlesApi = (id) => {
    return (dispatch) => {
        dispatch(asyncTrendingArticleApiLoader());
    return getCallApi(TRENDING_ARTICLES_API(id))
            .then((data) => {
                if (data.success) {
                    dispatch( asyncTrendingArticleApiSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncTrendingArticleApiError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncTrendingArticleApiError(error));
                return Promise.reject(error);
            })
    }
}

export const asyncFetchSimilarArticles = (data) => {
    return (dispatch) => {
        dispatch(asyncFetchSimilarArticlesLoader());
        return postCallApi(FETCH_SIMILAR_ARTICLES_API, data)
            .then((data) => {
                if (data.success) {
                    dispatch( asyncFetchSimilarArticlesSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchSimilarArticlesError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchSimilarArticlesError(error));
                return Promise.reject(error);
            })
    }
}

export const asyncSimilarArticlesAction = (data) => {
    return (dispatch) => {
        dispatch(asyncSimilarArticleActionLoader(data));
        return postCallApi(SIMILAR_ARTICLES_API, data)
            .then((dataa) => {
                if (dataa.success) {
                    dispatch(asyncSimilarArticleActionSuccess());
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncSimilarArticleActionError(dataa));
                    return Promise.reject(dataa);
                }
            })
            .catch((error) => {
                dispatch(asyncSimilarArticleActionError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncFetchArticle = (sendData) => {
    return (dispatch) => {
        dispatch(asyncFetchArticleLoader());
        return postCallApi(FETCH_ARTICLE_API, sendData)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchArticleSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchArticleError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchArticleError(error));
                return Promise.reject(error);
            })
    }
};

export const asyncArticleAction = (data) => {
    return (dispatch) => {
        dispatch(asyncArticleActionLoader(data));
        return postCallApi(ARTICLE_ACTION_API, data)
            .then((dataa) => {
                if (dataa.success) {
                    dispatch(asyncArticleActionSuccess());
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncArticleActionError(dataa));
                    return Promise.reject(dataa);
                }
            })
            .catch((error) => {
                dispatch(asyncArticleActionError(error));
                return Promise.reject(error);
            })
    };
};