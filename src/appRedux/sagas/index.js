import { all } from 'redux-saga/effects';
import customerSagas from './Customer';
import workflowSagas from './Workflow';
import authSagas from './Auth';
export default function* rootSaga(getState) {
    yield all([customerSagas(), workflowSagas(), authSagas()]);
}
