import { all } from 'redux-saga/effects';
import customerSagas from './Customer';
export default function* rootSaga(getState) {
    yield all([customerSagas()]);
}
