import {
    SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_DETAIL_SUCCESS,
    SAVE_APOLLO_CUSTOMER_MASTER
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    customerdata: [],
    singleCustomerDetail: [],
    fetching: false,
    alert:{'display':false,'message':'','color':'#FFF'},
};

const customerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
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


        case SAVE_APOLLO_CUSTOMER_MASTER:{
            return {
                ...state,
                fetching: true,
            };
        }


        case SHOW_MESSAGE: {
            return {
                ...state,
                fetching:false,
                alert:{'display':true,'message':action.payload.msg,'color':action.payload.color},
                
            };
        }
        case HIDE_MESSAGE: {
            return {
                ...state,
                alert:{'display':false,'message':'','color':'#FFF'},
            };
        }
        default:
            return state;
    }
};

export default customerReducer;
