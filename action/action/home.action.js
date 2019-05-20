import {
    HOME_BATCH_1_LOADER_STARTED,
    HOME_BATCH_1_SUCCESS,
    HOME_BATCH_1_ERROR,
    SEARCH_LOADER_ERROR,
    SEARCH_LOADER_STARTED,
    SEARCH_LOADER_SUCCESS,
    SHOW_ALL_VENDORS_ERROR,
    SHOW_ALL_VENDORS_LOADER,
    SHOW_ALL_VENDORS_SUCCESS,
    SHOW_ALL_VIDEOS_SUCCESS,
    SHOW_ALL_VIDEOS_LOADER,
    SHOW_ALL_VIDEOS_ERROR,
    SHOW_ALL_PRODUCTS_ERROR,
    SHOW_ALL_PRODUCTS_LOADER,
    SHOW_ALL_PRODUCTS_SUCCESS,
    LOAD_HOME_BANNER_LOADER,
    LOAD_HOME_BANNER_SUCCESS,
    LOAD_HOME_BANNER_ERROR,
    FETCH_ALL_ARTICLES_ERROR,
    FETCH_ALL_ARTICLES_LOADER,
    FETCH_ALL_ARTICLES_SUCCESS
} from '../../constant/index';

export const asyncHomeLoader = () => {
    return {
        type: HOME_BATCH_1_LOADER_STARTED
    };
};

export const asyncHomeSuccess = (data) => {
    return {
        type: HOME_BATCH_1_SUCCESS,
        data
    };
};

export const asyncHomeError = (error) => {
    return {
        type: HOME_BATCH_1_ERROR,
        error
    };
};

export const asyncSearchLoaderStarted = () => {
    return {
        type: SEARCH_LOADER_STARTED
    };
};

export const asyncSearchSuccess = (data, region) => {
    return {
        type: SEARCH_LOADER_SUCCESS,
        data,
        region
    }
};

export const asyncSearchError = (error) => {
    return {
        type: SEARCH_LOADER_ERROR,
        error
    };
};

export const asyncShowAllVendorLoader = () => {
    return {
        type: SHOW_ALL_VENDORS_LOADER
    };
};

export const asyncShowAllVendorSuccess = (data) => {
    return {
        type: SHOW_ALL_VENDORS_SUCCESS,
        data
    };
};

export const asyncShowAllVendorError = (error) => {
    return {
        type: SHOW_ALL_VENDORS_ERROR,
        error
    };
};

export const asyncShowAllVideosLoader = () => {
    return {
        type: SHOW_ALL_VIDEOS_LOADER
    };
};

export const asyncShowAllVideosSuccess = (data) => {
    return {
        type: SHOW_ALL_VIDEOS_SUCCESS,
        data
    };
};

export const asyncShowAllVideosError = (error) => {
    return {
        type: SHOW_ALL_VIDEOS_ERROR,
        error
    };
};

export const asyncShowAllProductsLoader = () => {
    return {
        type: SHOW_ALL_PRODUCTS_LOADER
    };
};

export const asyncShowAllProductsSuccess = (data) => {
    return {
        type: SHOW_ALL_PRODUCTS_SUCCESS,
        data
    };
};

export const asyncShowAllProductsError = (error) => {
    return {
        type: SHOW_ALL_PRODUCTS_ERROR,
        error
    };
};

export const asyncLoadHomeBannerLoader = () => {
    return {
        type: LOAD_HOME_BANNER_LOADER
    };
};

export const asyncLoadHomeBannerSuccess = (data) => {
    return {
        type: LOAD_HOME_BANNER_SUCCESS,
        data
    };
};

export const asyncLoadHomeBannerError = (error) => {
    return {
        type: LOAD_HOME_BANNER_ERROR,
        error
    };
};

export const asyncFetchAllArticlesLoader = () => {
    return {
        type: FETCH_ALL_ARTICLES_LOADER
    };
};

export const asyncFetchAllArticlesSuccess = (data) => {
    return {
        type: FETCH_ALL_ARTICLES_SUCCESS,
        data
    };
};

export const asyncFetchAllArticlesError = (error) => {
    return {
        type: FETCH_ALL_ARTICLES_ERROR,
        error
    };
};