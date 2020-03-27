import {
    GET_MDM_MAPPING_MATRIX,
    SET_MDM_MAPPING_MATRIX,
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
                fetching:true
            };
        }
        case SET_MDM_MAPPING_MATRIX: {
            console.log('intoset');
            return {
                ...state,
                fetching:false,
                mdmcustomerdata: action.payload
            };
        }
        default:
            return state;
    }
};

export default updateFlowReducer;
