import {
	  SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    SHOW_MESSAGE,
    HIDE_MESSAGE
} from "../../constants/ActionTypes";

export const searchCustomer = (customerString) => {
    return {
      type: SEARCH_CUSTOMER,
      payload:customerString
    };
  };
export const searchCustomerSuccess = (data) => {
    return {
        type: SEARCH_CUSTOMER_SUCCESS,
        payload: data
    };
};

export const searchCustomerFailed = (error) => {
    return {
        type: SEARCH_CUSTOMER_FAIL,
        payload: error
    };
};

export const showMessage = (message) => {
    return {
      type: SHOW_MESSAGE,
      payload: message
    };
  };


export const hideMessage = () => {
    return {
      type: HIDE_MESSAGE,
    };
  };