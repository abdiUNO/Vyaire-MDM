import { all, call, takeLatest, fork, put, select } from 'redux-saga/effects';
import axios from 'axios';
import { getWorkflowsSuccess ,getWorkflowsFailed,setStatusBarData,setFunctionalGroupData} from '../../appRedux/actions/Workflow.js';

import {
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,
    GET_WORKFLOW,
    GET_STATUS_BAR_DATA,
    GET_FUCTIONAL_GROUP_DATA } from '../../constants/ActionTypes';

import {
    ajaxPostRequest,endpoints
} from './config';

const userId=localStorage.getItem('userId');

export function* getWorkflows() {
    var resp={'msg':'','color':'#FFF'}
    const url =endpoints.getMyTasks;
    try {
        var jsonBody={"workflowenginerequesttype": 3,
            "workflowtaskfilterrequest":
            {
            "UserId":userId,
            "WorkflowTaskOperationType":3
            }
        }

        const result=yield call(ajaxPostRequest,url,jsonBody);

        if(result.IsSuccess){
            yield put(getWorkflowsSuccess(result.ResultData));
        }else{
            resp={'msg':'No data found','color':FAILED_BGCOLOR}
            yield put(getWorkflowsFailed(resp))
        }
    } catch (error) {
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(getWorkflowsFailed(resp))
    }
}

export function* getStatusBarDetails(data){
    var resp={'msg':'','color':'#FFF'}
    var wfId=data.payload;
    const url =endpoints.getStatusBarDetails;
    try {
        var jsonBody={
            "userId": userId,
            "workflowid": wfId
        }
        const result=yield call (ajaxPostRequest,url,jsonBody);
        if(result.IsSuccess){
            yield put(setStatusBarData(result.ResultData.WorkflowTaskStatus));
        }else{
            resp={'msg':'No data found','color':FAILED_BGCOLOR}
            yield put(getWorkflowsFailed(resp))
        }
    } catch (error) {
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(getWorkflowsFailed(resp))
    }
}

export function* getFunctionalGroupDetails({payload}){
    var resp={'msg':'','color':'#FFF'}
    var workflowId=payload.workflowId;
    var fuctionalGroup=payload.fuctionalGroup;
    const url =endpoints.getFunctionalGroupDetails;
    try {
        var jsonBody={
            "workflowId": workflowId,
            "userId":userId,
            "functionalGroup":fuctionalGroup
            }
        const result=yield call (ajaxPostRequest,url,jsonBody);        
        if(result.IsSuccess){
            yield put(setFunctionalGroupData(result.ResultData));
        }else{
            resp={'msg':'No data found','color':FAILED_BGCOLOR}
            yield put(getWorkflowsFailed(resp))
        }
    } catch (error) {
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(getWorkflowsFailed(resp))
    }
}

export function* getWorkflowsData(){
    yield takeLatest(GET_WORKFLOW,getWorkflows);
}

export function* getStatusData(){
    yield takeLatest(GET_STATUS_BAR_DATA,getStatusBarDetails);
}

export function* getGlobalMDMRecords(){
    yield takeLatest(GET_FUCTIONAL_GROUP_DATA,getFunctionalGroupDetails)
}
const workflowSagas = function* rootSaga() {
    yield all([
        fork(getWorkflowsData),
        fork(getStatusData),
        fork(getGlobalMDMRecords),
       ]);
};
export default workflowSagas;
