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
    GET_TAX_JURISDICTION,
    SET_TAX_JURISDICTION,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    UPLOAD_FILE,
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    customerdata: [],
    searchResult: [],
    singleCustomerDetail: [],
    bapi70CustData: [],
    bapiFullSet:[],
    loadingTaxJuri: false,
    taxJuriData: [],
    fetching: false,
    alert: { display: false, message: '', color: '#FFF' },
};

const normalize = (arr) => {
    const reducer = (accumulator, currentValue) => {
        accumulator[currentValue.Name] = currentValue;

        return accumulator;
    };

    return arr.reduce(reducer, {});
};

const customerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_MESSAGE: {
            window.scrollTo(0, 0);
            return {
                ...state,
                alert: {
                    display: true,
                    message: action.payload.msg,
                    color: action.payload.color,
                },
            };
        }
        case HIDE_MESSAGE: {
            return {
                ...state,
                alert: { display: false, message: '', color: '#FFF' },
            };
        }
        case CREATE_CUSTOMER_REQUEST: {
            return {
                ...state,
                fetching: true,
                alert: { display: false, message: '', color: '#FFF' },
            };
        }
        case CREATE_CUSTOMER_SUCCESS: {
            return {
                ...state,
                fetching: false,
                customerdata: action.payload,
                alert: {
                    display: true,
                    message: action.payload.msg,
                    color: action.payload.color,
                },
            };
        }
        case CREATE_CUSTOMER_FAILURE: {
            return {
                ...state,
                fetching: false,
                error: action.payload.msg,
                alert: {
                    display: true,
                    message: action.payload.msg,
                    color: action.payload.color,
                },
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
            return {
                ...state,
                fetching: false,
                bapiFullSet:action.payload,
                bapi70CustData: action.payload.CustomerData,
                deltas: normalize(action.payload.Deltas),
                denormalizedDeltas: action.payload.Deltas,
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
                customerdata: action.payload.Customers,
                searchResult: action.payload,
            };
        }
        case ADVANCE_SEARCH_CUSTOMER: {
            return {
                ...state,
                fetching: true,
                alert: { display: false },
            };
        }
        case ADVANCE_SEARCH_CUSTOMER_SUCCESS: {
            return {
                ...state,
                fetching: false,
                customerdata: action.payload.Customers,
                searchResult: action.payload,
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
        case GET_TAX_JURISDICTION: {
            return {
                ...state,
                loadingTaxJuri: true,
                taxJuriData: [],
            };
        }
        case SET_TAX_JURISDICTION: {
            return {
                ...state,
                loadingTaxJuri: false,
                taxJuriData: action.payload.taxData,
            };
        }
        default:
            return state;
    }
};

export default customerReducer;
