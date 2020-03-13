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

export const getMyRequests = () => {
    return {
        type: GET_MYREQUESTS,
    };
};

export const getMyRequestsSuccess = res => {
    return {
        type: GET_MYREQUESTS_SUCCESS,
        payload: res,
    };
};

export const getMyRequestsFailed = resp => {
    return {
        type: GET_MYREQUESTS_FAILURE,
        payload: resp,
    };
};

export const withDrawRequest = (data, history) => {
    console.log(data, history);
    return {
        type: WITHDRAW_REQUEST,
        payload: {
            data,
            history,
        },
    };
};

export const withDrawRequestSuccess = res => {
    return {
        type: WITHDRAW_REQUESTS_SUCCESS,
        payload: res,
    };
};

export const withDrawRequestFailed = resp => {
    return {
        type: WITHDRAW_REQUESTS_FAILURE,
        payload: resp,
    };
};
