import { all, call, takeLatest, fork, put } from 'redux-saga/effects';
import axios from 'axios';
import { getWorkflowsSuccess ,getWorkflowsFailed} from '../../appRedux/actions/Workflow.js';

import { 
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,GET_WORKFLOW } from '../../constants/ActionTypes';

import {
    ajaxPostRequest,
} from './config';

export function* getWorkflows() {
    var resp={'msg':'','color':'#FFF'}
    const url ='https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev/';
    try {
        var jsonBody={"workflowenginerequesttype": 3,
            "workflowtaskfilterrequest": 
            {
            "UserId": "customerservice.user",
            "WorkflowTaskOperationType":3 
            }
        }
        const result=yield call (ajaxPostRequest,url,jsonBody);
        
        console.log('mytasksOnload',result);
        if(result.IsSuccess){
            yield put(getWorkflowsSuccess(result.ResultData));
        }else{
            resp={'msg':'Error saving data','color':FAILED_BGCOLOR}
            yield put(getWorkflowsFailed(resp))
        }
    } catch (error) {
        resp={'msg':error,'color':FAILED_BGCOLOR}    
        yield put(getWorkflowsFailed(resp))
    }
}

const workflowSagas = function* rootSaga() {
    yield all([takeLatest(GET_WORKFLOW, getWorkflows)]);
};
export default workflowSagas;
