/* eslint-disable radix*/
import _ from 'lodash';
import {
    FETCH_VENDOR_ADMIN_ERROR,
    FETCH_VENDOR_ADMIN_SUCCESS,
    FETCH_VENDOR_ADMIN_LOADER_STARTED,
    HOME_BATCH_1_LOADER_STARTED,
    UPDATE_VENDOR_LOADER_STARTED,
    UPDATE_VENDOR_SUCCESS,
    UPDATE_VENDOR_ERROR,
    SAVE_IMAGES_SUCCESS,
    SAVE_IMAGES_LOADER,
    SAVE_IMAGES_ERROR,
    SAVE_PRODUCT_DASHBOARD_ERROR,
    SAVE_PRODUCT_DASHBOARD_SUCCESS,
    SAVE_PRODUCT_DASHBOARD_LOADER,
    FETCH_PRODUCTS_VENDOR_LOADER,
    FETCH_PRODUCTS_VENDOR_SUCCESS,
    FETCH_PRODUCTS_VENDOR_ERROR,
    DELETE_IMAGE_ERROR,
    DELETE_IMAGE_SUCCESS,
    DELETE_IMAGE_LOADER,
    SHOW_ALL_IMAGES_VENDOR_ERROR,
    SHOW_ALL_IMAGES_VENDOR_SUCCESS,
    SHOW_ALL_IMAGES_VENDOR_LOADER
} from '../../constant/index';


const intialState = {
    loading: false,
    vendor: {},
    videos: [],
    images: [],
    reviews: [],
    users: [],
    articles: [],
    products: [],
    imageCount: 0,
    commentLoading: false,
    showAllPageLoading: false,
    allProductsLoaded: false,
    showAllProducts: [],
    vendorLoading: false,
    allImagesLoaded: false,
    showAllImages: []
};

export const adminReducer = (state = intialState, action) => {

    switch(action.type) {


        case HOME_BATCH_1_LOADER_STARTED: {
            return {
                ...state,
                vendor: {},
            };
        }

        case FETCH_VENDOR_ADMIN_LOADER_STARTED: {
            return {
                ...state,
                loading: true,
                vendor: {}
            };
        }

        case FETCH_VENDOR_ADMIN_SUCCESS: {
            return {
                ...state,
                loading: false,
                vendor: action.data.vendorData.vendor,
                videos: action.data.vendorData.experienceVideos,
                images: action.data.vendorData.experienceImages,
                reviews: action.data.vendorData.reviews,
                users: action.data.vendorData.users,
                articles: action.data.vendorData.articles,
                products: action.data.vendorData.services,
                imageCount: action.data.vendorData.imageCount
            };
        }

        case FETCH_VENDOR_ADMIN_ERROR: {
            return {
                ...state,
                loading: false
            };
        }

        case UPDATE_VENDOR_LOADER_STARTED: {

            return {
                ...state,
                vendorLoading: true
            };
        }

        case UPDATE_VENDOR_SUCCESS: {

            let vendorData = Object.assign({}, state.vendor, action.data);
            return {
                ...state,
                vendor: vendorData,
                vendorLoading: true
            };
        }

        case UPDATE_VENDOR_ERROR: {
            return {
                ...state,
                vendorLoading: true
            };
        }

        case SAVE_IMAGES_LOADER: {
            return {
                ...state
            };
        }

        case SAVE_IMAGES_SUCCESS: {
            const images = state.images;
            const newImages = action.data;
            const newImageLength = newImages.length;
            newImages.push.apply(newImages, images);
            newImages.length = 4;
            return {
                ...state,
                images:newImages,
                imageCount: parseInt(state.imageCount + newImageLength)
            };
        }

        case SAVE_IMAGES_ERROR: {
            return {
                ...state
            };
        }

        case SAVE_PRODUCT_DASHBOARD_LOADER: {
            return {
                ...state
            };
        }

        case SAVE_PRODUCT_DASHBOARD_SUCCESS: {
            const product = action.data.data;
            const products = state.products;
            if (_.find(products, { _id: action.data.data._id })) {
               products[_.findIndex(products, { _id: action.data.data._id })] = product;
            } else {
                products.unshift(product);
            }
            const showAllProducts = state.showAllProducts;
            if (_.find(showAllProducts, { _id: action.data.data._id })) {
                showAllProducts[_.findIndex(showAllProducts, { _id: action.data.data._id })] = product;
            } else {
                showAllProducts.unshift(product);
            }
            return {
                ...state,
                products,
                showAllProducts
            };
        }

        case SAVE_PRODUCT_DASHBOARD_ERROR: {
            return {
                ...state
            }
        }

        case FETCH_PRODUCTS_VENDOR_LOADER: {
            return {
                ...state,
                showAllPageLoading: true,
                allProductsLoaded: false,
                showAllProducts: []
            };
        }

        case FETCH_PRODUCTS_VENDOR_SUCCESS: {
            if (action.data.data.length > 0) {
                return {
                    ...state,
                    showAllPageLoading: false,
                    showAllProducts: _.union(state.showAllProducts, action.data.data),
                    allProductsLoaded: false
                };
            } else {
                return {
                    ...state,
                    showAllPageLoading: false,
                    allProductsLoaded: true
                };
            }
        }

        case FETCH_PRODUCTS_VENDOR_ERROR: {
            return {
                ...state,
                showAllPageLoading: false
            };
        }

        case DELETE_IMAGE_LOADER: {
            return {
                ...state
            }
        }

        case DELETE_IMAGE_SUCCESS: {
            const id = action.data.data.id;
            const images = state.images;
            const showAllImages = state.showAllImages;
            images.splice(_.findIndex(images, { _id: id }), 1);
            showAllImages.splice(_.findIndex(images, { _id: id }), 1);
            return {
                ...state,
                images,
                showAllImages
            };
        }

        case DELETE_IMAGE_ERROR: {
            return {
                ...state
            };
        }

        case SHOW_ALL_IMAGES_VENDOR_LOADER: {
            return {
                ...state,
                showAllPageLoading: true,
                allImagesLoaded: false,
                showAllImages: []
            };
        }

        case SHOW_ALL_IMAGES_VENDOR_SUCCESS: {
            if (action.data.data.length > 0) {
                return {
                    ...state,
                    showAllPageLoading: false,
                    showAllImages: _.union(state.showAllImages, action.data.data),
                    allImagesLoaded: false
                };
            } else {
                return {
                    ...state,
                    showAllPageLoading: false,
                    allImagesLoaded: true
                };
            }
        }

        case SHOW_ALL_IMAGES_VENDOR_ERROR: {
            return {
                ...state,
                showAllPageLoading: false
            };
        }

        default:
            return {
                ...state
            };
    }

};