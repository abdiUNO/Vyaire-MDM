import {
    all,
    call,
    fork,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import { fetchWorkFlows } from './config.js';

import { getWorkflowsSuccess } from '../../appRedux/actions/Workflow.js';

export function* getWorkflows(action) {
    const url =
        'https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev';
    try {
        const res = yield call(fetch, url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                WorkflowTask: {
                    RequestorUserId: 'customerservice.user',
                    WorkflowTaskOperation: 3,
                },
            }),
        });
        let json = yield call([res, 'json']);
        // const data = json.ResultData;

        // if (data.customers[0].message) {
        //  no search results found
        yield put(getWorkflowsSuccess(json));
        // } else {
        //     yield put(searchCustomerSuccess(data.customers[0].customers));
        // }
    } catch (error) {
        // yield put(showMessage(error));
    }
}

const workflowSagas = function* rootSaga() {
    yield all([fork(getWorkflows)]);
};
export default workflowSagas;
