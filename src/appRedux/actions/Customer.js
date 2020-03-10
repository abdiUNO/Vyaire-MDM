import {
    SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    SEARCH_CUSTOMER_FAIL,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_DETAIL_SUCCESS,
    GET_CUSTOMER_FROM_SAP,
    RETRIEVE_CUSTOMER_FROM_SAP_SUCCESS,
    CUSTOMER_ACTION_MESSAGE,
    ADVANCE_SEARCH_CUSTOMER,
    ADVANCE_SEARCH_CUSTOMER_SUCCESS,
    CREATE_CUSTOMER_REQUEST,
    CREATE_CUSTOMER_SUCCESS,
    CREATE_CUSTOMER_FAILURE,
} from '../../constants/ActionTypes';

export const getCustomerDetail = id => {
    return {
        type: GET_CUSTOMER_DETAIL,
        payload: id,
    };
};

export const getCustomerDetailSuccess = data => {
    return {
        type: GET_CUSTOMER_DETAIL_SUCCESS,
        payload: data,
    };
};
export const searchCustomer = customerString => {
    return {
        type: SEARCH_CUSTOMER,
        payload: customerString,
    };
};
export const searchCustomerSuccess = data => {
    return {
        type: SEARCH_CUSTOMER_SUCCESS,
        payload: data,
    };
};

export const advanceSearchCustomer = data => {
    return {
        type: ADVANCE_SEARCH_CUSTOMER,
        payload: data,
    };
};
export const advanceSearchCustomerSuccess = data => {
    return {
        type: ADVANCE_SEARCH_CUSTOMER_SUCCESS,
        payload: data,
    };
};
export const searchCustomerFailed = error => {
    return {
        type: SEARCH_CUSTOMER_FAIL,
        payload: error,
    };
};

export const getCustomerFromSAP = data => {
    return {
        type: GET_CUSTOMER_FROM_SAP,
        payload: data,
    };
};

export const retrieveCustomerFromSAPSuccess = custdata => {
    return {
        type: RETRIEVE_CUSTOMER_FROM_SAP_SUCCESS,
        payload: custdata,
    };
};

export const showCustMessage = message => {
    return {
        type: CUSTOMER_ACTION_MESSAGE,
        payload: message,
    };
};

export const createCustomer = payload => {
    return {
        type: CREATE_CUSTOMER_REQUEST,
        payload,
    };
};

export const createCustomerSuccess = data => {
    return {
        type: CREATE_CUSTOMER_SUCCESS,
        payload: data,
    };
};

export const createCustomerFailure = error => {
    return {
        type: CREATE_CUSTOMER_FAILURE,
        payload: error,
    };
};
