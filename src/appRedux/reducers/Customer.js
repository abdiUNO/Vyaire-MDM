import {
    CUSTOMER_ACTION_MESSAGE,
    SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_DETAIL_SUCCESS,
    GET_CUSTOMER_FROM_SAP,
    RETRIEVE_CUSTOMER_FROM_SAP_SUCCESS,
    ADVANCE_SEARCH_CUSTOMER,
    ADVANCE_SEARCH_CUSTOMER_SUCCESS,
    CREATE_CUSTOMER_REQUEST,
    CREATE_CUSTOMER_SUCCESS,
    CREATE_CUSTOMER_FAILURE,
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    customerdata: [],
    singleCustomerDetail: [],
    bapi70CustData: [],
    fetching: false,
    alert: { display: false, message: '', color: '#FFF' },
};

const customerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATE_CUSTOMER_REQUEST: {
            return {
                ...state,
                fetching: true,
            };
        }
        case CREATE_CUSTOMER_SUCCESS: {
            return {
                ...state,
                fetching: false,
                customerdata: action.payload,
            };
        }
        case CREATE_CUSTOMER_FAILURE: {
            return {
                ...state,
                fetching: false,
                error: action.payload,
            };
        }
        case GET_CUSTOMER_DETAIL: {
            return {
                ...state,
                fetching: true,
            };
        }
        case GET_CUSTOMER_DETAIL_SUCCESS: {
            return {
                ...state,
                fetching: false,
                singleCustomerDetail: action.payload,
            };
        }
        case GET_CUSTOMER_FROM_SAP: {
            return {
                ...state,
                fetching: true,
            };
        }
        case RETRIEVE_CUSTOMER_FROM_SAP_SUCCESS: {
            console.log('cat', action.payload);
            return {
                ...state,
                fetching: false,
                bapi70CustData: action.payload,
            };
        }
        case SEARCH_CUSTOMER: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SEARCH_CUSTOMER_SUCCESS: {
            return {
                ...state,
                fetching: false,
                customerdata: action.payload,
            };
        }
        case ADVANCE_SEARCH_CUSTOMER: {
            return {
                ...state,
                fetching: true,
            };
        }
        case ADVANCE_SEARCH_CUSTOMER_SUCCESS: {
            return {
                ...state,
                fetching: false,
                customerdata: action.payload,
            };
        }
        case CUSTOMER_ACTION_MESSAGE: {
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

export default customerReducer;
