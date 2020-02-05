import { all, call, takeLatest, fork, put } from 'redux-saga/effects';
import axios from 'axios';
import { getWorkflowsSuccess } from '../../appRedux/actions/Workflow.js';

import { GET_WORKFLOW } from '../../constants/ActionTypes';

export function* getWorkflows(action) {
    const url =
        'https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev';
    try {
        const fetchWorkFlows = () =>
            axios.post(url, {
                WorkflowTask: {
                    RequestorUserId: 'customerservice.user',
                    WorkflowTaskOperation: 3,
                },
            });

        const res = yield call(fetchWorkFlows);

        console.log(res);

        yield put(getWorkflowsSuccess(res.data));
    } catch (error) {
        // yield put(showMessage(error));
    }
}

const workflowSagas = function* rootSaga() {
    yield all([takeLatest(GET_WORKFLOW, getWorkflows)]);
};
export default workflowSagas;
