import {
    SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    SEARCH_CUSTOMER_FAIL,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_DETAIL_SUCCESS,
    SHOW_MESSAGE,
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

export const searchCustomerFailed = error => {
    return {
        type: SEARCH_CUSTOMER_FAIL,
        payload: error,
    };
};
export const showMessage = (message) => {
    return {
      type: SHOW_MESSAGE,
      payload: message
    }
}