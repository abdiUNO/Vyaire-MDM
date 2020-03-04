import {
    all,
    call,
    fork,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import { authUserSuccess, authUserFail } from '../../appRedux/actions/Auth.js';
// import { Auth } from 'aws-amplify';
import { AUTH_USER } from '../../constants/ActionTypes';
export function* authUser(action) {
    const url =
        'https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev';
    // try {
    //     console.log('CALLING');

    // const currentAuthenticatedUser = () =>
    //     Auth.currentAuthenticatedUser({
    //         bypassCache: true,
    //     });

    // const user = yield call(currentAuthenticatedUser);

    // console.log(user);
    // console.log('CALLED');
    // yield put(authUserSuccess(user));
    // } catch (error) {
    yield put(authUserFail('error'));
    // }
}

const authSagas = function* rootSaga() {
    yield all([takeLatest(AUTH_USER, authUser)]);
};
export default authSagas;
