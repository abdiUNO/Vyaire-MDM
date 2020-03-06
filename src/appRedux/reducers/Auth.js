import {
    LOGOUT,
    AUTH_USER,
    AUTH_USER_SUCCESS,
    AUTH_USER_FAILED,
    LOGGED_IN_STATUS_CHANGED,
    LOGOUT_USER,
} from '../../constants/ActionTypes';

export const initialState = {
    error: null,
    loading: false,
    loggedIn: null,
    user: null,
    loggedOut: null,
};

/* ------------- Selectors ------------- */

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTH_USER:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AUTH_USER_SUCCESS:
            return {
                ...initialState,
                user: action.user,
                loggedIn: true,
            };
        case AUTH_USER_FAILED:
            return {
                ...state,
                error: action.error || 'Authentication Failed',
                password: '',
                loading: false,
                loggedIn: false,
            };
        case LOGOUT:
            return initialState;
        case LOGGED_IN_STATUS_CHANGED:
            return {
                ...state,
                loggedIn: action.loggedIn,
            };
        case LOGOUT_USER:
            return {
                ...state,
                loggedOut: action.loggedOut,
                loggedIn: action.loggedIn,
            };
        default:
            return state;
    }
};
