import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
    GET_STATUS_BAR_DATA,
    SET_STATUS_BAR_DATA,
    GET_GLOBAL_MDM_DATA,
    SET_GLOBAL_MDM_DATA
} from '../../constants/ActionTypes';

export const getWorkflows = () => {
    return {
        type: GET_WORKFLOW,
    };
};

export const getWorkflowsSuccess = res => {
    return {
        type: GET_WORKFLOW_SUCCESS,
        payload:res,
    };
};

export const getWorkflowsFailed = (resp) => {
    return {
        type: GET_WORKFLOW_FAILURE,
        payload:resp
    };
};


export const getGlobalMDMData = (data) => {
    return{
        type:GET_GLOBAL_MDM_DATA,
        payload:data
    }
}
export const setGlobalMDMData = (data) => {
    return{
        type:SET_GLOBAL_MDM_DATA,
        payload:data
    }
}


export const getStatusBarData = (data) => {
    return{
        type:GET_STATUS_BAR_DATA,
        payload:data
    }
}
export const setStatusBarData = (data) => {
    return{
        type:SET_STATUS_BAR_DATA,
        payload:data
    }
}
