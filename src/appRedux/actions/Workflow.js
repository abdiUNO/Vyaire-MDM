import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
    GET_CUSTOMER_DETAIL,
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
