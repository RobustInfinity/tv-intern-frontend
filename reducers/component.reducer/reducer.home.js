/* eslint-disable radix, array-callback-return*/
import _ from 'lodash';
import {
    HOME_BATCH_1_ERROR,
    HOME_BATCH_1_SUCCESS,
    HOME_BATCH_1_LOADER_STARTED,
    SEARCH_LOADER_ERROR,
    SEARCH_LOADER_SUCCESS,
    SEARCH_LOADER_STARTED,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER,
    LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS,
    LIKE_DISLIKE_VENDOR_ERROR,
    LIKE_DISLIKE_VENDOR_SUCCESS,
    LIKE_DISLIKE_VENDOR_LOADER,
    SHOW_ALL_VENDORS_ERROR,
    SHOW_ALL_VENDORS_SUCCESS,
    SHOW_ALL_VENDORS_LOADER,
    SHOW_ALL_VIDEOS_ERROR,
    SHOW_ALL_VIDEOS_SUCCESS,
    SHOW_ALL_VIDEOS_LOADER,
    SHOW_ALL_PRODUCTS_ERROR,
    SHOW_ALL_PRODUCTS_SUCCESS,
    SHOW_ALL_PRODUCTS_LOADER,
    LOAD_HOME_BANNER_SUCCESS,
    LOAD_HOME_BANNER_LOADER,
    LOAD_HOME_BANNER_ERROR,
    FETCH_ALL_ARTICLES_ERROR,
    FETCH_ALL_ARTICLES_LOADER,
    FETCH_ALL_ARTICLES_SUCCESS,
    ARTICLE_ACTION_LOADER,
    TOGGLE_MOBILE_SEARCH_MODAL
} from '../../constant/index';
const intialState = {
    loading: false,
    vendors: [],
    users: [],
    experiences: [],
    experienceVendor: [],
    searchLoading: false,
    searchResults: [],
    showLoading: false,
    showAllVendors: [],
    allVendorLoaded: false,
    products: [],
    showAllVideos: [],
    allVideosLoaded: false,
    ad: {},
    articles: [],
    showAllArticles: [],
    allArticlesLoaded: false,
    topArticles: [],
    articlePageUsers: [],
    showMobileSearchModal: false,
    services: []
};

export const homeReducer = (state = intialState, action) => {

    switch (action.type) {

        case HOME_BATCH_1_LOADER_STARTED:
            {
                if (state.vendors.length > 0) {
                    return {
                        ...state
                    }
                } else {
                    return {
                        ...state,
                        loading: true
                    }
                }
            }

        case HOME_BATCH_1_SUCCESS:
            {
                return {
                    ...state,
                    loading: false,
                    vendors: action.data.data.vendors,
                    users: action.data.data.users,
                    experiences: action.data.data.experiences,
                    experienceVendor: action.data.data.experienceVendor,
                    reviews: action.data.data.reviews,
                    reviewVendor: action.data.data.reviewVendor,
                    products: action.data.data.products,
                    articles: action.data.data.articles,
                    services: action.data.data.services
                }
            }

        case HOME_BATCH_1_ERROR:
            {
                return {
                    ...state,
                    loading: false
                }
            }

        case SEARCH_LOADER_STARTED:
            {
                return {
                    ...state,
                    searchLoading: true
                };
            }

        case SEARCH_LOADER_SUCCESS:
            {
                const data = action.data.data.hits.hits;
                let newData = data;
                if (action.region) {
                    newData = [];
                    _.map(data, (value, index) => {
                        if (value && value._source.region) {
                            if (value._source.region.includes('all') || value._source.region.includes(action.region)) {
                                newData.push(value);
                            }
                        }
                    });
                }
                return {
                    ...state,
                    searchLoading: false,
                    searchResults: newData
                };
            }

        case SEARCH_LOADER_ERROR:
            {
                return {
                    ...state,
                    searchLoading: false
                };
            }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_LOADER:
            {
                if (action.data.action === 'like') {
                    if (action.data.status) {
                        const experiences = state.experiences;
                        const showAllVideos = state.showAllVideos;
                        if (experiences && experiences.length > 0) {
                            if (experiences[_.findIndex(experiences, {
                                _id: String(action.data.experience)
                            })]) {
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isLiked = true;
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].likeCount = parseInt(experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].likeCount) + 1;
                                if (experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isDisliked) {
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].isDisliked = false;
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount = parseInt(experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount) - 1;
                                }

                            }
                        }
                        if (showAllVideos && showAllVideos.length > 0) {
                            if (showAllVideos[_.findIndex(showAllVideos, {
                                _id: String(action.data.experience)
                            })]) {
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isLiked = true;
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].likeCount) + 1;
                                if (showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isDisliked) {
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].isDisliked = false;
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount) - 1;
                                }

                            }
                        }
                        return {
                            ...state,
                            experiences,
                            showAllVideos
                        };
                    } else {
                        const experiences = state.experiences;
                        const showAllVideos = state.showAllVideos;
                        if (experiences && experiences.length > 0) {
                            if (experiences[_.findIndex(experiences, {
                                _id: String(action.data.experience)
                            })]) {
                                if (experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isLiked) {
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].isLiked = false;
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].likeCount = parseInt(experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].likeCount) - 1;
                                }
                                if (experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isDisliked) {
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].isDisliked = false;
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount = parseInt(experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount) - 1;
                                }
                            }
                        }
                        if (showAllVideos && showAllVideos.length > 0) {
                            if (showAllVideos[_.findIndex(showAllVideos, {
                                _id: String(action.data.experience)
                            })]) {
                                if (showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isLiked) {
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].isLiked = false;
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].likeCount) - 1;
                                }
                                if (showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isDisliked) {
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].isDisliked = false;
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].dislikeCount) - 1;
                                }
                            }
                        }
                        return {
                            ...state,
                            experiences,
                            showAllVideos
                        };
                    }
                } else if (action.data.action === 'dislike') {
                    if (action.data.status) {
                        const experiences = state.experiences;
                        const showAllVideos = state.showAllVideos;
                        if (experiences && experiences.length > 0) {
                            if (experiences[_.findIndex(experiences, {
                                _id: String(action.data.experience)
                            })]) {
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isDisliked = true;
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].dislikeCount = parseInt(experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].dislikeCount) + 1;
                                if (experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isLiked) {
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].isLiked = false;
                                    experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].likeCount = parseInt(experiences[_.findIndex(experiences, {
                                        _id: String(action.data.experience)
                                    })].likeCount) - 1;
                                }
                            }
                        }
                        if (showAllVideos && showAllVideos.length > 0) {
                            if (showAllVideos[_.findIndex(showAllVideos, {
                                _id: String(action.data.experience)
                            })]) {
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isDisliked = true;
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].dislikeCount) + 1;
                                if (showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isLiked) {
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].isLiked = false;
                                    showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                        _id: String(action.data.experience)
                                    })].likeCount) - 1;
                                }
                            }
                        }
                        return {
                            ...state,
                            experiences,
                            showAllVideos
                        };
                    } else {
                        const experiences = state.experiences;
                        const showAllVideos = state.showAllVideos;
                        if (experiences && experiences.length > 0 && experiences[_.findIndex(experiences, {
                            _id: String(action.data.experience)
                        })]) {
                            if (experiences[_.findIndex(experiences, {
                                _id: String(action.data.experience)
                            })].isDisliked) {
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isDisliked = false;
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].dislikeCount = parseInt(experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].dislikeCount) - 1;
                            }
                            if (experiences[_.findIndex(experiences, {
                                _id: String(action.data.experience)
                            })].isLiked) {
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].isLiked = false;
                                experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].likeCount = parseInt(experiences[_.findIndex(experiences, {
                                    _id: String(action.data.experience)
                                })].likeCount) - 1;
                            }
                        }
                        if (showAllVideos && showAllVideos.length > 0 && showAllVideos[_.findIndex(showAllVideos, {
                            _id: String(action.data.experience)
                        })]) {
                            if (showAllVideos[_.findIndex(showAllVideos, {
                                _id: String(action.data.experience)
                            })].isDisliked) {
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isDisliked = false;
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].dislikeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].dislikeCount) - 1;
                            }
                            if (showAllVideos[_.findIndex(showAllVideos, {
                                _id: String(action.data.experience)
                            })].isLiked) {
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].isLiked = false;
                                showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].likeCount = parseInt(showAllVideos[_.findIndex(showAllVideos, {
                                    _id: String(action.data.experience)
                                })].likeCount) - 1;
                            }
                        }
                        return {
                            ...state,
                            experiences,
                            showAllVideos
                        };
                    }
                } else {
                    return {
                        ...state
                    }
                }
            }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_SUCCESS:
            {
                return {
                    ...state
                };
            }

        case LIKE_DISLIKE_EXPERIENCE_VIDEO_ERROR:
            {
                return {
                    ...state
                };
            }

        case LIKE_DISLIKE_VENDOR_SUCCESS:
            {
                return {
                    ...state
                };
            }

        case LIKE_DISLIKE_VENDOR_LOADER:
            {
                if (action.data.action === 'like') {
                    if (action.data.status) {
                        const vendors = state.vendors;
                        if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, {
                            _id: String(action.data.vendor)
                        })]) {
                            vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isLiked = true;
                            vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].likeCount = parseInt(vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].likeCount) + 1;
                            if (vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isDisliked) {
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].isDisliked = false;
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].dislikeCount = parseInt(vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].dislikeCount) - 1;
                            }
                            return {
                                ...state,
                                vendors: vendors
                            };
                        } else {
                            return {
                                ...state
                            };
                        }
                    } else {
                        const vendors = state.vendors;
                        if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, {
                            _id: String(action.data.vendor)
                        })]) {
                            if (vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isLiked) {
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].isLiked = false;
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].likeCount = parseInt(vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].likeCount) - 1;
                            }
                            if (vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isDisliked) {
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].isDisliked = false;
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].dislikeCount = parseInt(vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].dislikeCount) - 1;
                            }
                            return {
                                ...state,
                                vendors
                            };
                        } else {
                            return {
                                ...state
                            };
                        }
                    }
                } else if (action.data.action === 'dislike') {
                    if (action.data.status) {
                        const vendors = state.vendors;
                        if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, {
                            _id: String(action.data.vendor)
                        })]) {
                            vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isDisliked = true;
                            vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].dislikeCount = parseInt(vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].dislikeCount) + 1;
                            if (vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isLiked) {
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].isLiked = false;
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].likeCount = parseInt(vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].likeCount) - 1;
                            }
                            return {
                                ...state,
                                vendors
                            };
                        } else {
                            return {
                                ...state
                            };
                        }
                    } else {
                        const vendors = state.vendors;
                        if (vendors && vendors.length > 0 && vendors[_.findIndex(vendors, {
                            _id: String(action.data.vendor)
                        })]) {
                            if (vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isDisliked) {
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].isDisliked = false;
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].dislikeCount = parseInt(vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].dislikeCount) - 1;
                            }
                            if (vendors[_.findIndex(vendors, {
                                _id: String(action.data.vendor)
                            })].isLiked) {
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].isLiked = false;
                                vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].likeCount = parseInt(vendors[_.findIndex(vendors, {
                                    _id: String(action.data.vendor)
                                })].likeCount) - 1;
                            }
                            return {
                                ...state,
                                vendors
                            };
                        } else {
                            return {
                                ...state
                            }
                        }
                    }
                } else {
                    return {
                        ...state
                    }
                }
            }

        case LIKE_DISLIKE_VENDOR_ERROR:
            {
                return {
                    ...state
                }
            }

        case SHOW_ALL_VENDORS_LOADER:
            {
                return {
                    ...state,
                    showLoading: true,
                    allVendorLoaded: false,
                    showAllVendors: []
                };
            }

        case SHOW_ALL_VENDORS_SUCCESS:
            {
                if (action.data.data.vendor.length > 0) {
                    return {
                        ...state,
                        showLoading: false,
                        showAllVendors: _.union(state.showAllVendors, action.data.data.vendor),
                        allVendorLoaded: false
                    };
                } else {
                    return {
                        ...state,
                        showLoading: false,
                        showAllVendors: _.union(state.showAllVendors, action.data.data.vendor),
                        allVendorLoaded: true
                    };
                }
            }

        case SHOW_ALL_VENDORS_ERROR:
            {
                return {
                    ...state,
                    showLoading: false
                };
            }

        case SHOW_ALL_VIDEOS_LOADER:
            {
                return {
                    ...state,
                    showLoading: true,
                    allVideosLoaded: false,
                    showAllVideos: []
                };
            }

        case SHOW_ALL_VIDEOS_SUCCESS:
            {
                if (action.data.data.length > 0) {
                    return {
                        ...state,
                        showLoading: false,
                        showAllVideos: _.union(state.showAllVideos, action.data.data),
                        allVideosLoaded: false
                    };
                } else {
                    return {
                        ...state,
                        showLoading: false,
                        showAllVideos: _.union(state.showAllVideos, action.data.data),
                        allVideosLoaded: true
                    };
                }
            }

        case SHOW_ALL_VIDEOS_ERROR:
            {
                return {
                    ...state,
                    showLoading: false
                };
            }

        case SHOW_ALL_PRODUCTS_LOADER:
            {
                return {
                    ...state,
                    showLoading: true,
                    allProductsLoaded: false,
                    showAllProducts: []
                };
            }

        case SHOW_ALL_PRODUCTS_SUCCESS:
            {
                if (action.data.data.length > 0) {
                    return {
                        ...state,
                        showLoading: false,
                        showAllProducts: _.union(state.showAllProducts, action.data.data),
                        allProductsLoaded: false
                    };
                } else {
                    return {
                        ...state,
                        showLoading: false,
                        showAllProducts: _.union(state.showAllProducts, action.data.data),
                        allProductsLoaded: true
                    };
                }
            }

        case SHOW_ALL_PRODUCTS_ERROR:
            {
                return {
                    ...state,
                    showLoading: false
                };
            }

        case LOAD_HOME_BANNER_LOADER:
            {
                return {
                    ...state
                }
            }

        case LOAD_HOME_BANNER_SUCCESS:
            {
                return {
                    ...state,
                    ad: action.data.data
                };
            }

        case LOAD_HOME_BANNER_ERROR:
            {
                return {
                    ...state
                };
            }

        case FETCH_ALL_ARTICLES_LOADER: {
            return {
                ...state,
                showLoading: true,
                showAllArticles: []
            }
        }

        case FETCH_ALL_ARTICLES_SUCCESS: {
            const oldUsers = state.articlePageUsers;
            const newUsers = action.data.data.user;
            newUsers.map((value) => {
                if (!_.find(oldUsers, { username: value.username })) {
                    oldUsers.push(value);
                }
            });
            return {
                ...state,
                showAllArticles: _.union(state.showAllArticles, action.data.data.articles),
                articlePageUsers: oldUsers,
                allArticlesLoaded: (action.data.data.articles && action.data.data.articles.length > 0) ? false : true,
                showLoading: false,
                topArticles: action.data.data.trendingArticles
            }
        }

        case FETCH_ALL_ARTICLES_ERROR: {
            return {
                ...state,
                showLoading: false
            }
        }

        case ARTICLE_ACTION_LOADER: {
            const showAllArticles = state.showAllArticles;
            if (showAllArticles[_.findIndex(showAllArticles, { articleId: action.data.articleId })]) {
                if (action.data.action === 'like') {
                    showAllArticles[_.findIndex(showAllArticles, { articleId: action.data.articleId })].isLiked = action.data.status;
                } else {
                    showAllArticles[_.findIndex(showAllArticles, { articleId: action.data.articleId })].isBookmarked = action.data.status;
                }
            }
            return {
                ...state,
                showAllArticles
            };
        }

        case TOGGLE_MOBILE_SEARCH_MODAL: {
            return {
                ...state,
                showMobileSearchModal: !state.showMobileSearchModal
            }
        }

        default:
            return {
                ...state
            };
    }

};