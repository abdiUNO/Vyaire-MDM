import {
    GET_MDM_MAPPING_MATRIX,
    SET_MDM_MAPPING_MATRIX,
    UPDATE_DELTAS,
    UPDATE_DELTAS_STATUS,
    SAVE_APOLLO_UPDATE_CONTRACTS,
    SAVE_APOLLO_UPDATE_CREDIT,
    SAVE_APOLLO_UPDATE_PRICING,
    SAVE_APOLLO_UPDATE_GLOBALTRADE,
    SAVE_APOLLO_UPDATE_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
    SAVE_APOLLO_PRICING,
    SAVE_APOLLO_GLOBALTRADE,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    mdmcustomerdata: [],
    fetching: false,
    alert: { display: false, message: '', color: '#FFF' },
};

const updateFlowReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_MDM_MAPPING_MATRIX: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SET_MDM_MAPPING_MATRIX: {
            console.log('intoset');
            return {
                ...state,
                fetching: false,
                mdmcustomerdata: action.payload,
            };
        }
        case UPDATE_DELTAS: {
            return {
                ...state,
                fetching: true,
            };
        }
        case UPDATE_DELTAS_STATUS: {
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

        case SAVE_APOLLO_UPDATE_CUSTOMER_MASTER: {
            return {
                ...state,
                fetching: true,
                readOnly: undefined,
                success: action.payload.success,
            };
        }
        case SAVE_APOLLO_UPDATE_CONTRACTS:
        case SAVE_APOLLO_UPDATE_CREDIT:
        case SAVE_APOLLO_UPDATE_PRICING:
        case SAVE_APOLLO_UPDATE_GLOBALTRADE: {
            return {
                ...state,
                fetching: true,
            };
        }
        case SHOW_MESSAGE: {
            return {
                ...state,
                fetching: false,
                readOnly: action.payload.readOnly || undefined,
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

export default updateFlowReducer;
