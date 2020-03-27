import {
    all,
    call,
    fork,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import {
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,
    GET_MDM_MAPPING_MATRIX
} from '../../constants/ActionTypes';
import {
    setMdmMappingMatrix
} from '../../appRedux/actions/UpdateFlowAction';
import { showMessage as showToast } from '../../appRedux/actions/Toast';
import {
    ajaxPostRequest,
    endpoints,
    ajaxPutFileRequest,
} from './config';


export function* getMdmMatrix({payload}) {
    var jsonBody=payload;
    try {
        var resp = { msg: '', color: '#FFF', delay: '' };
        var url = endpoints.mdmMappingMatrix;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showToast(resp));
        } else {
            yield put(setMdmMappingMatrix(result.ResultData))            
        }
        } catch (error) {
            yield put(showToast(error));
        }
}


export function* fetch_mdm_mapping_matrix() {
    yield takeLatest(GET_MDM_MAPPING_MATRIX, getMdmMatrix);
}

const updateFlowSagas = function* rootSaga() {
    yield all([
        fork(fetch_mdm_mapping_matrix),
    ]);
};
export default updateFlowSagas;
