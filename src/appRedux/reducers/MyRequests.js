/**
 * @prettier
 */

import {
    GET_MYREQUESTS,
    GET_MYREQUESTS_SUCCESS,
    GET_MYREQUESTS_FAILURE,
    WITHDRAW_REQUEST,
    WITHDRAW_REQUESTS_SUCCESS,
    WITHDRAW_REQUESTS_FAILURE,
} from '../../constants/ActionTypes';

import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    myTaskData: [],
    fetching: false,
    fetchingGlobaldata: false,
    error: null,
    statusBarData: [],
    globalMdmDetail: [],
    alert: { display: false, message: '', color: '#FFF' },
};

const myRequestsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_MYREQUESTS: {
            return {
                ...state,
                fetching: true,
            };
        }
        case GET_MYREQUESTS_SUCCESS: {
            return {
                ...state,
                fetching: false,
                data: action.payload.MyRequests,
            };
        }
        case GET_MYREQUESTS_FAILURE: {
            return {
                ...state,
                fetching: false,
                alert: {
                    display: true,
                    message: action.payload.msg,
                    color: action.payload.color,
                },
            };
        }
        case WITHDRAW_REQUEST: {
            return {
                ...state,
                fetching: true,
            };
        }
        case WITHDRAW_REQUESTS_SUCCESS: {
            return {
                ...state,
                fetching: false,
                data: action.payload.MyRequests,
            };
        }
        case WITHDRAW_REQUESTS_FAILURE: {
            return {
                ...state,
                fetching: false,
                alert: {
                    display: true,
                    message: action.payload.msg,
                    color: action.payload.color,
                },
            };
        }
        default:
            return state;
    }
};

export default myRequestsReducer;
