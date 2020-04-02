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
    GET_MDM_MAPPING_MATRIX,
    UPDATE_DELTAS
} from '../../constants/ActionTypes';
import {
    setMdmMappingMatrix,updateDeltasStatus
} from '../../appRedux/actions/UpdateFlowAction';
import { showMessage as showToast } from '../../appRedux/actions/Toast';
import {
    ajaxPostRequest,
    endpoints,
    ajaxPutFileRequest,
} from './config';
import { UploadFiles } from './Customer';


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

export function* updateDeltaDatas({payload}) {
    const { history, data: jsonBody, files } = payload;
    try {
        var resp = { msg: '', color: '#FFF', delay: '' };
        var url = endpoints.deltaUpdate;
        yield put(
            showToast({
                msg: 'Saving new updates',
                color: '#2980b9',
            })
        );
        const result = yield call(ajaxPostRequest, url, jsonBody);
        console.log('res',result);
        if (!result.IsSuccess) {
            resp = { msg: 'Error updating data', color: FAILED_BGCOLOR };
            yield put(showToast(resp));
            yield put(updateDeltasStatus());
        } else {
            window.scrollTo(0, 0);
            if (files && files.length > 0) {
                yield put(
                    showToast({
                        msg: 'Uploading files',
                        color: '#2980b9',
                    })
                );

                const uploadResult =  yield* UploadFiles(files, jsonBody.workflowId);
                if (uploadResult[0].length === 0) {
                    yield put(
                        updateDeltasStatus({
                            msg: 'Successfully uploaded file ',
                            color: SUCCESS_BGCOLOR,
                        })
                    );
                } else {
                    yield put(
                        updateDeltasStatus({
                            msg: 'Failed uploading file',
                            color: FAILED_BGCOLOR,
                        })
                    );
                }
            }
            if (result.IsSuccess) {
                yield put(
                    updateDeltasStatus({
                        msg: 'Successfully updated ',
                        color: SUCCESS_BGCOLOR,
                    })
                );
                history.push({
                    pathname: '/my-requests',
                });
            } else {
                resp = {
                    msg: 'Error uploading files',
                    color: FAILED_BGCOLOR,
                };
                yield put(updateDeltasStatus(resp));
                window.scrollTo(0, 0);
            }
  
        }
        } catch (error) {
            yield put(showToast(error));
        }
}


export function* fetch_mdm_mapping_matrix() {
    yield takeLatest(GET_MDM_MAPPING_MATRIX, getMdmMatrix);
}

export function* updateData() {
    yield takeLatest(UPDATE_DELTAS, updateDeltaDatas);
}

const updateFlowSagas = function* rootSaga() {
    yield all([
        fork(fetch_mdm_mapping_matrix),
        fork(updateData)
    ]);
};
export default updateFlowSagas;
