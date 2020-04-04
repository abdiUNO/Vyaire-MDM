import { all } from 'redux-saga/effects';
import customerSagas from './Customer';
import workflowSagas from './Workflow';
import myTasksSagas from './MyTasksSaga';
import myRequestsSagas from './MyRequests';
import authSagas from './Auth';
import toastSagas from './Toast';
import  updateFlowSagas from './UpdateFlowSaga';

export default function* rootSaga(getState) {
    yield all([
        customerSagas(),
        workflowSagas(),
        myTasksSagas(),
        authSagas(),
        myRequestsSagas(),
        updateFlowSagas()
    ]);
}
