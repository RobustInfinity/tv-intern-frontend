import {
    FILTER_VENDOR_ERROR,
    FILTER_VENDOR_SUCCESS,
    FILTER_VENDOR_LOADER
} from '../../constant/index';

export const asyncFilterVendorStarted = () => {
    return {
        type: FILTER_VENDOR_LOADER
    };
};

export const asyncFilterVendorSuccess = (data) => {
    return {
        type: FILTER_VENDOR_SUCCESS,
        data
    };
};

export const asyncFilterVendorError = (error) => {
    return {
        type: FILTER_VENDOR_ERROR,
        error
    };
};