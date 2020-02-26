import {
    GET_WORKFLOW,
    GET_WORKFLOW_SUCCESS,
    GET_WORKFLOW_FAILURE,
} from '../../constants/ActionTypes';

export const getWorkflows = () => {
    return {
        type: GET_WORKFLOW,
    };
};

export const getWorkflowsSuccess = res => {
    const workflowsData = res.ResultData;
    const globalFields = res.WorkflowCustomerGlobalModel;
    return {
        type: GET_WORKFLOW_SUCCESS,
        payload: {
            workflowsData,
            globalFields,
        },
    };
};
