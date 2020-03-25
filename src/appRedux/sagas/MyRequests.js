/**
 * @prettier
 */

import { all, call, takeLatest, fork, put, select } from 'redux-saga/effects';
import {
    getMyRequestsSuccess,
    getMyRequestsFailed,
    withDrawRequestSuccess,
    withDrawRequestFailed,
} from '../../appRedux/actions/MyRequests.js';

import {
    GET_MYREQUESTS,
    WITHDRAW_REQUEST,
    FAILED_BGCOLOR,
} from '../../constants/ActionTypes';

import { ajaxPostRequest, endpoints } from './config';

export function* fetchMyRequests() {
    const userId = localStorage.getItem('userId');

    var resp = { msg: '', color: '#FFF' };
    const url = endpoints.fetchMyRequests;
    try {
        const result = yield call(ajaxPostRequest, url, { UserId: userId });

        if (result.IsSuccess) {
            yield put(getMyRequestsSuccess(result.ResultData));
        } else {
            resp = { msg: 'No data found', color: FAILED_BGCOLOR };
            yield put(getMyRequestsFailed(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(getMyRequestsFailed(resp));
    }
}

export function* withDraw({ payload }) {
    const userId = localStorage.getItem('userId');

    const { data, history } = payload;
    var resp = { msg: '', color: '#FFF' };
    const url = endpoints.withdrawRequest;

    try {
        const result = yield call(ajaxPostRequest, url, {
            UserId: userId,
            ...data,
        });

        console.log(result);

        if (result.IsSuccess) {
            history.push({
                pathname: '/my-requests',
            });

            yield put(withDrawRequestSuccess(result.ResultData));
        } else {
            resp = { msg: 'No data found', color: FAILED_BGCOLOR };
            yield put(withDrawRequestFailed(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(withDrawRequestFailed(resp));
    }
}

export function* getMyRequestsData() {
    yield takeLatest(GET_MYREQUESTS, fetchMyRequests);
}

export function* withDrawRequest() {
    yield takeLatest(WITHDRAW_REQUEST, withDraw);
}

const myRequestsSagas = function* rootSaga() {
    yield all([fork(getMyRequestsData), fork(withDrawRequest)]);
};
export default myRequestsSagas;
