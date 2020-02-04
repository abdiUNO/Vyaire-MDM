import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    data: [],
    fetching: false,
    error: null,
};

const customerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_WORKFLOW: {
            return {
                ...state,
                fetching: true,
            };
        }
        case GET_WORKFLOW_SUCCESS: {
            return {
                ...state,
                fetching: false,
                workflowsData: action.payload.workflowsData,
                globalFields: action.payload.globalFields,
            };
        }
        case GET_WORKFLOW_FAILURE: {
            return {
                ...state,
                fetching: true,
            };
        }
        default:
            return state;
    }
};

export default customerReducer;
