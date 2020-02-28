import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    myTaskData: [],
    fetching: false,
    error: null,
    alert:{'display':false,'message':'','color':'#FFF'},

};

const workflowsReducer = (state = INITIAL_STATE, action) => {
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
                myTaskData: action.payload,
                alert:{'display':true,'message':'Successfully saved the data','color':'green'},
            };
        }
        case GET_WORKFLOW_FAILURE: {
            return {
                ...state,
                fetching: false,
                alert:{'display':true,'message':action.payload.msg,'color':action.payload.color},
            };
        }
        default:
            return state;
    }
};

export default workflowsReducer;
