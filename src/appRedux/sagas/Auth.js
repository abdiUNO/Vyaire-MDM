import {
    all,
    call,
    fork,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import { authUserSuccess, authUserFail } from '../../appRedux/actions/Auth.js';
import { Auth } from 'aws-amplify';
import { AUTH_USER } from '../../constants/ActionTypes';
import {endpoints} from './config';

export function* authUser(action) {
    const url =endpoints.authUser;
        try {

        const currentAuthenticatedUser = () =>
            Auth.currentAuthenticatedUser({
                bypassCache: true,
            });

        const user = yield call(currentAuthenticatedUser);
        yield put(authUserSuccess(user));
    } catch (error) {
        yield put(authUserFail('error'));
    }
}

const authSagas = function* rootSaga() {
    yield all([takeLatest(AUTH_USER, authUser)]);
};
export default authSagas;
