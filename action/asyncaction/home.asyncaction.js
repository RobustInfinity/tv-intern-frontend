import {
    asyncHomeError,
    asyncHomeLoader,
    asyncHomeSuccess,
    asyncSearchError,
    asyncSearchSuccess,
    asyncSearchLoaderStarted,
    asyncShowAllVendorError,
    asyncShowAllVendorLoader,
    asyncShowAllVendorSuccess,
    asyncShowAllVideosError,
    asyncShowAllVideosLoader,
    asyncShowAllVideosSuccess,
    asyncShowAllProductsError,
    asyncShowAllProductsLoader,
    asyncShowAllProductsSuccess,
    asyncLoadHomeBannerError,
    asyncLoadHomeBannerLoader,
    asyncLoadHomeBannerSuccess,
    asyncFetchAllArticlesError,
    asyncFetchAllArticlesSuccess,
    asyncFetchAllArticlesLoader
} from '../action/home.action';
import {
    HOME_BATCH_API,
    SEARCH_VENDOR_API,
    SHOW_ALL_VENDOR_API,
    SHOW_ALL_VIDEOS_API,
    SHOW_ALL_PRODUCTS_API,
    FETCH_RECENT_AD,
    FETCH_ALL_ARTICLES_API
} from '../../constant/api';
import {
    getCallApi,
    postCallApi
} from "../../util/util";
import { TOGGLE_MOBILE_SEARCH_MODAL } from '../../constant/index';

export const fetchHomeData = (type, token) => {
    return (dispatch) => {
        dispatch(asyncHomeLoader());
        return getCallApi(HOME_BATCH_API(type, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncHomeSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncHomeError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncHomeError(error));
                return Promise.reject(error);
            })
    }
};

export const searchVendor = (search, region) => {
    return (dispatch) => {
        dispatch(asyncSearchLoaderStarted());
        return getCallApi(SEARCH_VENDOR_API(search, region))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncSearchSuccess(data, region));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncSearchError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncSearchError(error));
                return Promise.reject(error);
            });
    };
};

export const showAllVendors = (skip, facets, region) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncShowAllVendorLoader());
        }
        return (postCallApi(SHOW_ALL_VENDOR_API(skip, facets), {
            region
        }))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncShowAllVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncShowAllVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncShowAllVendorError(error));
                return Promise.reject(error);
            })
    };
};

export const showAllVideos = (skip, token) => {
    if (skip === 0) {
        return (dispatch) => {
            dispatch(asyncShowAllVideosLoader());
            return (getCallApi(SHOW_ALL_VIDEOS_API(skip, token)))
                .then((data) => {
                    if (data.success) {
                        dispatch(asyncShowAllVideosSuccess(data));
                        return Promise.resolve(data);
                    } else {
                        dispatch(asyncShowAllVideosError(data));
                        return Promise.reject(data);
                    }
                })
                .catch((error) => {
                    dispatch(asyncShowAllVideosError(error));
                    return Promise.reject(error);
                })
        };
    } else {
        return (dispatch) => {
            return (getCallApi(SHOW_ALL_VIDEOS_API(skip, token)))
                .then((data) => {
                    if (data.success) {
                        dispatch(asyncShowAllVideosSuccess(data));
                        return Promise.resolve(data);
                    } else {
                        dispatch(asyncShowAllVideosError(data));
                        return Promise.reject(data);
                    }
                })
                .catch((error) => {
                    dispatch(asyncShowAllVideosError(error));
                    return Promise.reject(error);
                })
        };
    }
};

export const showAllProducts = (skip) => {
    if (skip === 0) {
        return (dispatch) => {
            dispatch(asyncShowAllProductsLoader());
            return (getCallApi(SHOW_ALL_PRODUCTS_API(skip)))
                .then((data) => {
                    if (data.success) {
                        dispatch(asyncShowAllProductsSuccess(data));
                        return Promise.resolve(data);
                    } else {
                        dispatch(asyncShowAllProductsError(data));
                        return Promise.reject(data);
                    }
                })
                .catch((error) => {
                    dispatch(asyncShowAllProductsError(error));
                    return Promise.reject(error);
                })
        };
    } else {
        return (dispatch) => {
            return (getCallApi(SHOW_ALL_PRODUCTS_API(skip)))
                .then((data) => {
                    if (data.success) {
                        dispatch(asyncShowAllProductsSuccess(data));
                        return Promise.resolve(data);
                    } else {
                        dispatch(asyncShowAllProductsError(data));
                        return Promise.reject(data);
                    }
                })
                .catch((error) => {
                    dispatch(asyncShowAllProductsError(error));
                    return Promise.reject(error);
                })
        };
    }
};

export const asyncLoadBanner = () => {
    return (dispatch) => {
        dispatch(asyncLoadHomeBannerLoader());
        return getCallApi(FETCH_RECENT_AD)
            .then((data) => {
                if (data.success) {
                    dispatch(asyncLoadHomeBannerSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncLoadHomeBannerError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncLoadHomeBannerError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncFetchAllArticles = (skip, token) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFetchAllArticlesLoader());
        }
        return getCallApi(FETCH_ALL_ARTICLES_API(skip, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchAllArticlesSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchAllArticlesError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchAllArticlesError(error));
                return Promise.reject(error);
            });
    }
};

export const toggleMobileSearchModal = () => {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_MOBILE_SEARCH_MODAL
        });
    }
}