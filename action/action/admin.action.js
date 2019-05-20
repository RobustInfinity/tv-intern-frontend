import {
    FETCH_VENDOR_ADMIN_SUCCESS,
    FETCH_VENDOR_ADMIN_ERROR,
    FETCH_VENDOR_ADMIN_LOADER_STARTED,
    UPDATE_VENDOR_LOADER_STARTED,
    UPDATE_VENDOR_SUCCESS,
    UPDATE_VENDOR_ERROR,
    SAVE_IMAGES_ERROR,
    SAVE_IMAGES_LOADER,
    SAVE_IMAGES_SUCCESS,
    SAVE_PRODUCT_DASHBOARD_ERROR,
    SAVE_PRODUCT_DASHBOARD_LOADER,
    SAVE_PRODUCT_DASHBOARD_SUCCESS,
    DELETE_IMAGE_ERROR,
    DELETE_IMAGE_LOADER,
    DELETE_IMAGE_SUCCESS
} from '../../constant/index';

export const asyncFetchVendorAdminLoader = () => {
    return {
        type: FETCH_VENDOR_ADMIN_LOADER_STARTED
    };
};

export const asyncFetchVendoAdminrSuccess = (data) => {
    return {
        type: FETCH_VENDOR_ADMIN_SUCCESS,
        data
    };
};

export const asyncFetchVendorAdminError = (error) => {
    return {
        type: FETCH_VENDOR_ADMIN_ERROR,
        error
    };
};

export const asyncUpdateVendorLoader = () => {
    return {
        type: UPDATE_VENDOR_LOADER_STARTED
    };
};

export const asyncUpdateVendorSuccess = (data) => {
    return {
        type: UPDATE_VENDOR_SUCCESS,
        data
    };
};

export const asyncUpdateVendorError = (error) => {
    return {
        type: UPDATE_VENDOR_ERROR,
        error
    }
};

export const asyncSaveImageLoader = () => {
    return {
        type: SAVE_IMAGES_LOADER
    };
};

export const asyncSaveImageSuccess = (data) => {
    return {
        type: SAVE_IMAGES_SUCCESS,
        data
    };
};

export const asyncSaveImageError = (error) => {
    return {
        type: SAVE_IMAGES_ERROR,
        error
    };
};

export const asyncSaveProductDashboardLoader = () => {
    return {
        type: SAVE_PRODUCT_DASHBOARD_LOADER
    };
};

export const asyncSaveProductDashboardSuccess = (data) => {
    return {
        type: SAVE_PRODUCT_DASHBOARD_SUCCESS,
        data
    };
};

export const asyncSaveProductDashboardError = (error) => {
    return {
        type: SAVE_PRODUCT_DASHBOARD_ERROR,
        error
    };
};

export const asyncDeleteImageLoader = () => {
    return {
        type: DELETE_IMAGE_LOADER
    };
};

export const asyncDeleteImageSuccess = (data) => {
    return {
        type: DELETE_IMAGE_SUCCESS,
        data
    };
};

export const asyncDeleteImageError = (error) => {
    return {
        type: DELETE_IMAGE_ERROR,
        error
    };
};