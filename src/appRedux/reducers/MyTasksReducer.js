import {
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
    SAVE_APOLLO_PRICING,
    SAVE_APOLLO_GLOBALTRADE,
    GET_TAX_JURISDICTION,
    SET_TAX_JURISDICTION,
} from '../../constants/ActionTypes';

const INITIAL_STATE = {
    fetching: false,
    loadingTaxJuri: false,
    taxJuriData: [],
    alert: { display: false, message: '', color: '#FFF' },
};

const myTasksReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE_APOLLO_CUSTOMER_MASTER: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SAVE_APOLLO_CONTRACTS: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SAVE_APOLLO_CREDIT: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SAVE_APOLLO_PRICING: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SAVE_APOLLO_GLOBALTRADE: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SHOW_MESSAGE: {
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
        case HIDE_MESSAGE: {
            return {
                ...state,
                alert: { display: false, message: '', color: '#FFF' },
            };
        }
        default:
            return state;
    }
};

export default myTasksReducer;
