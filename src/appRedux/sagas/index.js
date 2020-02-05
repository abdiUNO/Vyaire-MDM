import { all } from 'redux-saga/effects';
import customerSagas from './Customer';
import workflowSagas from './Workflow';
export default function* rootSaga(getState) {
    yield all([customerSagas(), workflowSagas()]);
}
