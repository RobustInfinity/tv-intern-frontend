import _ from 'lodash';
import {
    FILTER_VENDOR_ERROR,
    FILTER_VENDOR_SUCCESS,
    FILTER_VENDOR_LOADER
} from '../../constant/index';


const intialState = {
    loading: false,
    loaded: false,
    vendor: [],
    count: 0
};

export const filterReducer = (state = intialState, action) => {

    switch(action.type) {

        case FILTER_VENDOR_LOADER: {
            return {
                ...state,
                vendor: [],
                loading: true
            };
        }

        case FILTER_VENDOR_SUCCESS: {
            if(action.data.data.vendor.length > 0) {
                return {
                    ...state,
                    vendor: _.union(state.vendor, action.data.data.vendor),
                    loading: false,
                    count: action.data.data.count,
                    loaded: false
                }
            } else {
                if (state.vendor.length > 0) {
                    return {
                        ...state,
                        vendor: _.union(state.vendor, action.data.data.vendor),
                        loading: false,
                        loaded: true
                    }
                } else {
                    return {
                        ...state,
                        vendor: _.union(state.vendor, action.data.data.vendor),
                        loading: false,
                        loaded: true,
                        count: 0
                    }
                }
            }
        }

        case FILTER_VENDOR_ERROR: {
            return {
                ...state,
                loading: false
            }
        }

        default:
            return {
                ...state
            };
    }

};