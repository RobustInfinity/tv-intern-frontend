import {
    FETCH_ARTICLE_ERROR,
    FETCH_ARTICLE_SUCCESS,
    FETCH_ARTICLE_LOADER,
    ARTICLE_ACTION_ERROR,
    ARTICLE_ACTION_LOADER,
    ARTICLE_ACTION_SUCCESS,

    FETCH_SIMILAR_ARTICLES_API_LOADER,
    FETCH_SIMILAR_ARTICLES_API_SUCCESS,
    FETCH_SIMILAR_ARTICLES_API_ERROR,
    SIMILAR_ARTICLES_API_LOADER,
    SIMILAR_ARTICLES_API_SUCCESS,
    SIMILAR_ARTICLES_API_ERROR,

    TRENDING_ARTICLES_API_LOADER,
    TRENDING_ARTICLES_API_SUCCESS,
    TRENDING_ARTICLES_API_ERROR

} from '../../constant/index';

export const asyncTrendingArticleApiLoader = () => {
    return {
        type: TRENDING_ARTICLES_API_LOADER
    };
};

export const asyncTrendingArticleApiSuccess = (data) => {
    return {
        type: TRENDING_ARTICLES_API_SUCCESS,
        data
    };
};

export const asyncTrendingArticleApiError = (error) => {
    return {
        type: TRENDING_ARTICLES_API_ERROR,
        error
    };
};


export const asyncFetchSimilarArticlesLoader = () => {
    return {
        type: FETCH_SIMILAR_ARTICLES_API_LOADER
    };
};

export const asyncFetchSimilarArticlesSuccess = (data) => {
    return {
        type: FETCH_SIMILAR_ARTICLES_API_SUCCESS,
        data
    };
};

export const asyncFetchSimilarArticlesError = (error) => {
    return {
        type: FETCH_SIMILAR_ARTICLES_API_ERROR,
        error
    };
};

export const asyncSimilarArticleActionLoader = (data) => {
    return {
        type: SIMILAR_ARTICLES_API_LOADER,
        data
    };
};

export const asyncSimilarArticleActionSuccess = () => {
    return {
        type: SIMILAR_ARTICLES_API_SUCCESS
    };
};

export const asyncSimilarArticleActionError = (error) => {
    return {
        type: SIMILAR_ARTICLES_API_ERROR,
        error
    };
};



export const asyncFetchArticleLoader = () => {
    return {
        type: FETCH_ARTICLE_LOADER
    };
};

export const asyncFetchArticleSuccess = (data) => {
    return {
        type: FETCH_ARTICLE_SUCCESS,
        data
    };
};

export const asyncFetchArticleError = (error) => {
    return {
        type: FETCH_ARTICLE_ERROR,
        error
    };
};

export const asyncArticleActionLoader = (data) => {
    return {
        type: ARTICLE_ACTION_LOADER,
        data
    };
};

export const asyncArticleActionSuccess = () => {
    return {
        type: ARTICLE_ACTION_SUCCESS
    };
};

export const asyncArticleActionError = (error) => {
    return {
        type: ARTICLE_ACTION_ERROR,
        error
    };
};