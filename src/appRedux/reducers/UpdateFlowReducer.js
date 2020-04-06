import {
    GET_MDM_MAPPING_MATRIX,
    SET_MDM_MAPPING_MATRIX,
    UPDATE_DELTAS,
    UPDATE_DELTAS_STATUS,
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

        default:
            return state;
    }
};

export default updateFlowReducer;
