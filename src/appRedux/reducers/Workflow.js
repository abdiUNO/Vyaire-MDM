import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
    SET_STATUS_BAR_DATA,
    GET_GLOBAL_MDM_DATA,
    SET_GLOBAL_MDM_DATA
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    myTaskData: [],
    fetching: false,
    fetchingGlobaldata:false,
    error: null,
    statusBarData:[],
    globalMdmDetail:[],
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
                fetchingGlobaldata:false,
                myTaskData: action.payload,
            };
        }
        case GET_WORKFLOW_FAILURE: {
            return {
                ...state,
                fetching: false,
                fetchingGlobaldata:false,
                alert:{'display':true,'message':action.payload.msg,'color':action.payload.color},
            };
        }
        case SET_STATUS_BAR_DATA:{
            return{
                ...state,
                statusBarData:action.payload
            }
        }
        case GET_GLOBAL_MDM_DATA:{
            return{
                ...state,
                fetchingGlobaldata:true
            }
        }
        case SET_GLOBAL_MDM_DATA:{
            return{
                ...state,
                globalMdmDetail:action.payload,
                fetchingGlobaldata:false
            }
        }
        default:
            return state;
    }
};

export default workflowsReducer;
