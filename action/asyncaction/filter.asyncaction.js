import {
    asyncFilterVendorError,
    asyncFilterVendorSuccess,
    asyncFilterVendorStarted
} from '../action/filter.action';
import {
    getCallApi
} from "../../util/util";
import {
    FILTER_VENDOR_API
} from "../../constant/api";


export const fetchFilteredVendors = (filter, skip, type, facets) => {
    return (dispatch) => {
        if (skip === 0) {
            dispatch(asyncFilterVendorStarted());
        }
        return getCallApi(FILTER_VENDOR_API(filter, skip, type, facets))
            .then((data) => {
                if (data.success) {
                    dispatch(asyncFilterVendorSuccess(data));
                    return Promise.resolve(data);
                } else {
                    dispatch(asyncFilterVendorError(data));
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                dispatch(asyncFilterVendorError(error));
                return Promise.reject(error);
            });
    };
};