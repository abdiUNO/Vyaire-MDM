import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
    SET_STATUS_BAR_DATA,
    GET_FUCTIONAL_GROUP_DATA,
    SET_FUCTIONAL_GROUP_DATA,
    SET_TAX_JURISDICTION,
    GET_TAX_JURISDICTION,
    GET_STATUS_BAR_DATA,
} from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    myTaskData: [],
    fetching: false,
    fetchingfnGroupData: false,
    error: null,
    statusBarData: [],
    functionalGroupDetails: [],
    alert: { display: false, message: '', color: '#FFF' },
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
                fetchingGlobaldata: false,
                fetchingStatusBar: false,
                myTaskData: action.payload,
            };
        }
        case GET_WORKFLOW_FAILURE: {
            return {
                ...state,
                fetching: false,
                fetchingfnGroupData: false,
                fetchingGlobaldata: false,
                fetchingStatusBar: false,
                alert: {
                    display: true,
                    message: action.payload.msg,
                    color: action.payload.color,
                },
            };
        }
        case GET_STATUS_BAR_DATA: {
            return {
                ...state,
                statusBarData: [],
                WorkflowStateById: null,
                fetchingStatusBar: true,
            };
        }
        case SET_STATUS_BAR_DATA: {
            const ByTeamId = {};

            action.payload.forEach(({ TeamId, WorkflowTaskStateTypeId }) => {
                ByTeamId[TeamId] = WorkflowTaskStateTypeId;
            });

            return {
                ...state,
                statusBarData: action.payload,
                WorkflowStateById: ByTeamId,
                fetchingStatusBar: false,
            };
        }
        case GET_FUCTIONAL_GROUP_DATA: {
            return {
                ...state,
                fetchingfnGroupData: true,
            };
        }
        case SET_FUCTIONAL_GROUP_DATA: {
            console.log(action.payload);
            return {
                ...state,
                functionalGroupDetails: action.payload,
                fetchingfnGroupData: false,
            };
        }
        default:
            return state;
    }
};

export default workflowsReducer;
