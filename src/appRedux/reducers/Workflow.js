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
    UPDATE_TASK_STATUS,
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
                TasksStatusByTeamId: null,
                fetchingStatusBar: true,
            };
        }
        case SET_STATUS_BAR_DATA: {
            return {
                ...state,
                statusBarData: action.payload.all,
                TasksStatusByTeamId: action.payload.byTeamId,
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
            return {
                ...state,
                functionalGroupDetails: action.payload,
                fetchingfnGroupData: false,
            };
        }
        case UPDATE_TASK_STATUS: {
            return {
                ...state,
                statusBarData: state.statusBarData.map((taskStatus) => {
                    if (taskStatus.TeamId === action.payload.teamId)
                        return {
                            ...taskStatus,
                            WorkflowTaskStateTypeId: action.payload.status,
                        };
                    else return taskStatus;
                }),
                TasksStatusByTeamId: {
                    ...state.TasksStatusByTeamId,
                    [action.payload.teamId]: {
                        TeamId: action.payload.teamId,
                        WorkflowTaskStateTypeId: action.payload.status,
                    },
                },
            };
        }
        default:
            return state;
    }
};

export default workflowsReducer;
