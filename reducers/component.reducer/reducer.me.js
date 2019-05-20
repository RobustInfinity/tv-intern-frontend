import {
    GOOGLE_USER_LOGGING_UP_LOADER_ACTIVATED,
    GOOGLE_USER_LOGGING_UP_SUCCESS,
    GOOGLE_USER_LOGGING_UP_ERROR,
    FACEBOOK_USER_LOGGING_UP_ERROR,
    FACEBOOK_USER_LOGGING_UP_LOADER_ACTIVATED,
    FACEBOOK_USER_LOGGING_UP_SUCCESS,
    CHECK_USER_TOKEN_LOADER_STARTED,
    CHECK_USER_TOKEN_SUCCESS,
    CHECK_USER_TOKEN_ERROR,
    TOGGLE_SHARE_MODAL,
    LOGOUT_USER,
    TOGGLE_PICTURE_MODAL,
    UPDATE_USER_DATA_SUCCESS,
    SIGN_UP_LOADER,
    SIGN_UP_SUCCESS,
    SIGN_UP_ERROR,
    EMAIL_LOGIN_LOADER,
    EMAIL_LOGIN_SUCCESS,
    EMAIL_LOGIN_ERROR
} from '../../constant/index';

const initialState = {
    googleLoading: false,
    facebookLoading:false,
    tokenLoading:true,
    userData:{},
    isLoggedIn:false,
    loading:false,
    toggleShareModal: false,
    url: '',
    imageUrl:'',
    togglePictureModal: false,
    updatingData: false,
    signUpLoading: false,
    loginLoading: false,
    adminVendor: []
};



export const meReducer = (state = initialState, action) => {



    switch(action.type) {

        case GOOGLE_USER_LOGGING_UP_LOADER_ACTIVATED:
            return {
                ...state,
                googleLoading:true
            };


        case GOOGLE_USER_LOGGING_UP_SUCCESS:
            return {
                ...state,
                googleLoading:false,
                userData: action.data.userData,
                adminVendor: action.data.vendor,
                isLoggedIn:true
            };


        case GOOGLE_USER_LOGGING_UP_ERROR:
            return {
                ...state,
                googleLoading:false,
                error: action.error,
                isLoggedIn:false
            };


        case FACEBOOK_USER_LOGGING_UP_LOADER_ACTIVATED:
            return {
                ...state,
                facebookLoading:true
            };


        case FACEBOOK_USER_LOGGING_UP_SUCCESS:
            return {
                ...state,
                facebookLoading:false,
                userData: action.data.userData,
                adminVendor: action.data.vendor,
                isLoggedIn:true
            };


        case FACEBOOK_USER_LOGGING_UP_ERROR:
            return {
                ...state,
                facebookLoading:false,
                error: action.error,
                isLoggedIn:false
            };

        case SIGN_UP_LOADER: {
            return {
                ...state,
                signUpLoading: true
            };
        }

        case SIGN_UP_SUCCESS: {
            return {
                ...state,
                signUpLoading: false,
                userData: action.data.data,
                adminVendor: action.data.data.vendor,
                isLoggedIn:true
            }
        }

        case SIGN_UP_ERROR: {
            return {
                ...state,
                signUpLoading:false,
                error: action.error,
                isLoggedIn:false
            };
        }
        
        case EMAIL_LOGIN_LOADER: {
            return {
                ...state,
                loginLoading: true
            };
        }

        case EMAIL_LOGIN_SUCCESS: {
            return {
                ...state,
                loginLoading: false,
                userData: action.data.data,
                adminVendor: action.data.data.vendor,
                isLoggedIn:true
            };
        }

        case EMAIL_LOGIN_ERROR: {
            return {
                ...state,
                loginLoading:false,
                error: action.error,
                isLoggedIn:false
            };
        }

        case CHECK_USER_TOKEN_LOADER_STARTED:
            return {
                ...state,
                tokenLoading:true,
                isLoggedIn:false
            };


        case CHECK_USER_TOKEN_SUCCESS:
            return {
                ...state,
                tokenLoading:false,
                userData: action.data.userData,
                adminVendor: action.data.vendor,
                isLoggedIn: true
            };

        case CHECK_USER_TOKEN_ERROR:
            document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            return {
                ...state,
                tokenLoading:false,
                error: action.error,
                isLoggedIn:false
            };


        case TOGGLE_SHARE_MODAL:
            return {
                ...state,
                toggleShareModal: !state.toggleShareModal,
                url: action.data
            };


        case LOGOUT_USER: {
            return {
                ...state,
                userData: {},
                isLoggedIn: false
            };
        }

        case TOGGLE_PICTURE_MODAL: {
            return {
                ...state,
                togglePictureModal: !state.togglePictureModal,
                imageUrl: action.data
            }
        }



        case UPDATE_USER_DATA_SUCCESS: {

            let userData = Object.assign({}, state.userData, action.data);
            return {
                ...state,
                userData,
                updatingData: true
            };
        }
        

        default:
            return {
                ...state
            }

    }

};