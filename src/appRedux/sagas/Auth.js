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
import { endpoints } from './config';

const capitalize = s => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export function* authUser(action) {
    const url = endpoints.authUser;
    try {
        const currentAuthenticatedUser = () =>
            Auth.currentAuthenticatedUser({
                bypassCache: true,
            });

        const user = yield call(currentAuthenticatedUser);

        const userAttributes = user.attributes;
        const fullName = userAttributes.email.slice(0, -11).split('.');
        const username =
            capitalize(fullName[0]) + ' ' + capitalize(fullName[1]);
        const userId =
            fullName[0].toLowerCase() + '.' + fullName[1].toLowerCase();
        localStorage.setItem('userId', userId);

        yield put(authUserSuccess(user));
    } catch (error) {
        console.log(error);
        yield put(authUserFail('error'));
    }
}

const authSagas = function* rootSaga() {
    yield all([takeLatest(AUTH_USER, authUser)]);
};
export default authSagas;
