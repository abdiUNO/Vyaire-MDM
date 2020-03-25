import { all, call, takeLatest, fork, put, select } from 'redux-saga/effects';
import {
    getWorkflowsSuccess,
    getWorkflowsFailed,
    setStatusBarData,
    setFunctionalGroupData,
} from '../../appRedux/actions/Workflow.js';

import {
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,
    GET_WORKFLOW,
    GET_STATUS_BAR_DATA,
    GET_FUCTIONAL_GROUP_DATA,
} from '../../constants/ActionTypes';

import { ajaxPostRequest, endpoints } from './config';
import * as _ from 'lodash';

const camelCaseToPascalCase = (str = '') => _.upperFirst(_.camelCase(str));

const camelCaseHandler = {
    get: (target, prop) =>
        target[_.camelCase(prop)] || target[camelCaseToPascalCase(prop)],
    set: (target, prop, value) =>
        target[_.camelCase(prop)]
            ? (target[prop] = value)
            : (target[camelCaseToPascalCase(prop)] = value),
};

export function* getWorkflows() {
    const userId = localStorage.getItem('userId');

    var resp = { msg: '', color: '#FFF' };
    const url = endpoints.getMyTasks;
    try {
        var jsonBody = {
            WorkFlowEngineRequestType: 3,
            WorkFlowTaskFilterRequest: {
                UserId: userId,
                WorkflowTaskOperationType: 3,
            },
        };

        const result = yield call(ajaxPostRequest, url, jsonBody);

        if (result.IsSuccess) {
            yield put(getWorkflowsSuccess(result.ResultData));
        } else {
            resp = { msg: 'No data found', color: FAILED_BGCOLOR };
            yield put(getWorkflowsFailed(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(getWorkflowsFailed(resp));
    }
}

export function* getStatusBarDetails(data) {
    const userId = localStorage.getItem('userId');

    var resp = { msg: '', color: '#FFF' };
    var wfId = data.payload.workflowId;
    var taskId=data.payload.taskId ? data.payload.taskId : '' ;
    const url = endpoints.getStatusBarDetails;
    try {
        var jsonBody = {
            UserId: userId,
            Workflowid: wfId,
            taskId:taskId
        };
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (result.IsSuccess) {
            yield put(setStatusBarData(result.ResultData.WorkflowTaskStatus));
        } else {
            resp = { msg: 'No data found', color: FAILED_BGCOLOR };
            yield put(getWorkflowsFailed(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(getWorkflowsFailed(resp));
    }
}

export function* getFunctionalGroupDetails({ payload }) {
    const userId = localStorage.getItem('userId');

    var resp = { msg: '', color: '#FFF' };
    var workflowId = payload.workflowId;
    var fuctionalGroup = payload.fuctionalGroup;
    var TaskId = payload.taskId;
    const url = endpoints.getFunctionalGroupDetails;
    try {
        var jsonBody = {
            WorkflowId: workflowId,
            UserId: userId,
            FunctionalGroup: fuctionalGroup,
            TaskId,
        };
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (result.IsSuccess) {
            const { Customer, Credit: CreditObj, ...rest } = result.ResultData;
            // if (result.ResultData && result.)
            yield put(
                setFunctionalGroupData({
                    Customer,
                    Credit: CreditObj
                        ? new Proxy(CreditObj, camelCaseHandler)
                        : null,
                    ...rest,
                })
            );
        } else {
            resp = { msg: 'No data found', color: FAILED_BGCOLOR };
            yield put(setFunctionalGroupData(result.ResultData));
            // yield put(getWorkflowsFailed(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(getWorkflowsFailed(resp));
    }
}

export function* getWorkflowsData() {
    yield takeLatest(GET_WORKFLOW, getWorkflows);
}

export function* getStatusData() {
    yield takeLatest(GET_STATUS_BAR_DATA, getStatusBarDetails);
}

export function* getGlobalMDMRecords() {
    yield takeLatest(GET_FUCTIONAL_GROUP_DATA, getFunctionalGroupDetails);
}
const workflowSagas = function* rootSaga() {
    yield all([
        fork(getWorkflowsData),
        fork(getStatusData),
        fork(getGlobalMDMRecords),
    ]);
};
export default workflowSagas;
