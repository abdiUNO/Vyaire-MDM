import { all, call, takeLatest, fork, put, select } from 'redux-saga/effects';
import axios from 'axios';
import { getWorkflowsSuccess ,getWorkflowsFailed,setStatusBarData,setGlobalMDMData} from '../../appRedux/actions/Workflow.js';

import {
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,
    GET_WORKFLOW,
    GET_STATUS_BAR_DATA,
    GET_GLOBAL_MDM_DATA } from '../../constants/ActionTypes';

import {
    ajaxPostRequest,
} from './config';


export const selectAuthToken = state =>
    state.auth.user ? state.auth.user.signInUserSession.idToken.jwtToken : null


const testUser='contracts.user';
export function* getWorkflows() {

    //Select the JWT from the current user
    const authToken = yield select(selectAuthToken)

    var resp={'msg':'','color':'#FFF'}
    const url ='https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev/';
    try {
        var jsonBody={"workflowenginerequesttype": 3,
            "workflowtaskfilterrequest":
            {
            "UserId":testUser,
            "WorkflowTaskOperationType":3
            }
        }

        //pass the JWT in the headers
        const res = yield call(fetch, url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':authToken
            },
            body: JSON.stringify(jsonBody),
        });

        let result = yield call([res, 'json']);

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
    const url ='https://cors-anywhere.herokuapp.com/https://q43ik9wi02.execute-api.us-east-2.amazonaws.com/dev';
    try {
        var jsonBody={
            "userId": testUser,
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

export function* getGlobalMDMDetails(data){
    var resp={'msg':'','color':'#FFF'}
    var wfId=data.payload;
    const url ='https://cors-anywhere.herokuapp.com/https://ojsjl6n8q7.execute-api.us-east-2.amazonaws.com/dev';
    try {
        var jsonBody={
            "workflowid": wfId
        }
        const result=yield call (ajaxPostRequest,url,jsonBody);
        if(result.IsSuccess){
            yield put(setGlobalMDMData(result.ResultData.Customer));
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
    yield takeLatest(GET_GLOBAL_MDM_DATA,getGlobalMDMDetails)
}
const workflowSagas = function* rootSaga() {
    yield all([
        fork(getWorkflowsData),
        fork(getStatusData),
        fork(getGlobalMDMRecords),
       ]);
};
export default workflowSagas;
