import {
    asyncFetchVendoAdminrSuccess,
    asyncFetchVendorAdminError,
    asyncFetchVendorAdminLoader,
    asyncUpdateVendorError,
    asyncUpdateVendorSuccess,
    asyncUpdateVendorLoader,
    asyncSaveImageError,
    asyncSaveImageLoader,
    asyncSaveImageSuccess,
    asyncSaveProductDashboardError,
    asyncSaveProductDashboardLoader,
    asyncSaveProductDashboardSuccess,
    asyncDeleteImageError,
    asyncDeleteImageLoader,
    asyncDeleteImageSuccess
} from '../action/admin.action';

import {
    FETCH_VENDOR_ADMIN_API,
    UPDATE_VENDOR_DATA_API,
    SAVE_VENDOR_IMAGES_API,
    ADD_PRODUCT_DASHBOARD_API,
    DELETE_IMAGE_DASHBOARD_API
} from '../../constant/api';
import {
    getCallApi, postCallApi
} from "../../util/util";

export const fetchVendorForAdmin = (username, token) => {
    return (dispatch) => {
        dispatch(asyncFetchVendorAdminLoader());
        return getCallApi(FETCH_VENDOR_ADMIN_API(username, token))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFetchVendoAdminrSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFetchVendorAdminError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFetchVendorAdminError(error));
                return Promise.reject(error);
            })
    };
};

export const asyncUpdateVendorData = (token, vendorData, vendor) => {
    return (dispatch) => {
        dispatch(asyncUpdateVendorLoader());
        return postCallApi(UPDATE_VENDOR_DATA_API, {token, data: vendorData, vendor})
            .then((data) => {
                if (data.success) {
                    dispatch(asyncUpdateVendorSuccess(vendorData));
                    return Promise.resolve(vendorData);
                } else {
                    dispatch(asyncUpdateVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncUpdateVendorError(error));
                return Promise.reject(error);
            });
    }
};

export const asyncSaveImages = (token, data, vendor) => {
    return (dispatch) => {
        dispatch(asyncSaveImageLoader());
        return postCallApi(SAVE_VENDOR_IMAGES_API, { token, data, vendor })
            .then((resData) => {
                if (resData.success) {
                    dispatch(asyncSaveImageSuccess(data));
                    return Promise.resolve(resData);
                } else {
                    dispatch(asyncSaveImageError(resData));
                    return Promise.reject(resData);
                }
            })
            .catch((error) => {
                dispatch(asyncSaveImageError(error));
                return Promise.reject(error);
            });
    };
};

export const asyncSaveProduct = (data, token) => {
    return (dispatch) => {
      dispatch(asyncSaveProductDashboardLoader());
      return postCallApi(ADD_PRODUCT_DASHBOARD_API, {
          token,
          data
      })
          .then((res) => {
            if (res.success) {
                dispatch(asyncSaveProductDashboardSuccess(res));
                return Promise.resolve(res);
            } else {
                dispatch(asyncSaveProductDashboardError(res));
                return Promise.reject(res);
            }
          })
          .catch((error) => {
            dispatch(asyncSaveProductDashboardError(error));
            return Promise.reject(error);
          });
    };
};

export const asyncDeleteImage = (vendor, id, token) => {
  return (dispatch) => {
      dispatch(asyncDeleteImageLoader());
      return getCallApi(DELETE_IMAGE_DASHBOARD_API(vendor, id, token))
          .then((data) => {
            if (data.success) {
                dispatch(asyncDeleteImageSuccess(data));
                return Promise.resolve(data);
            } else {
                dispatch(asyncDeleteImageError(data));
                return Promise.reject(data);
            }
          })
          .catch((error) => {
            dispatch(asyncDeleteImageError(error));
            return Promise.reject(error);
          });
  };
};