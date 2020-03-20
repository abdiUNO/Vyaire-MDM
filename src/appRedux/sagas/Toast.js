import { all, put, takeLatest } from 'redux-saga/effects';
import {
    ADD_TOAST,
    AUTH_USER,
    REMOVE_TOAST,
} from '../../constants/ActionTypes';
// import { showMessage, removeMessage } from '../actions/Toast';

// export function* actionAddToast(action) {
//     yield put(showMessage(action.payload));
// }
//
// export function* addToast() {
//     yield takeLatest(ADD_TOAST, actionAddToast);
// }

export function* removeToast(action) {
    // yield put(removeMessage(action.payload));
}

const toastSagas = function* rootSaga() {
    yield all([yield takeLatest(REMOVE_TOAST, removeToast)]);
};
export default toastSagas;
