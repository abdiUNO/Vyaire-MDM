import { all } from 'redux-saga/effects';
import customerSagas from './Customer';
import workflowSagas from './Workflow';
import myTasksSagas from './MyTasksSaga';
export default function* rootSaga(getState) {
    yield all([customerSagas(), 
        workflowSagas(),
    myTasksSagas()]);
}
