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
    UPDATE_DELTAS,
    SAVE_APOLLO_UPDATE_CONTRACTS,
    SAVE_APOLLO_UPDATE_CREDIT,
    SAVE_APOLLO_UPDATE_PRICING,
    SAVE_APOLLO_UPDATE_GLOBALTRADE,
} from '../../constants/ActionTypes';
import { getCustomerFromSAP } from '../../appRedux/actions/Customer';
import {
    setMdmMappingMatrix,
    updateDeltasStatus,
} from '../../appRedux/actions/UpdateFlowAction';
import { showMessage as showToast } from '../../appRedux/actions/Toast';
import { ajaxPostRequest, endpoints, ajaxPutFileRequest } from './config';
import { UploadFiles } from './Customer';
import {
    getFunctionalGroupData,
    showMessage,
    updateTaskStatus,
} from '../actions';
import { TASK_APPROVED, TASK_REJECTED } from '../../constants/WorkflowEnums';

export function* getMdmMatrix({ payload }) {
    var jsonBody = payload;
    try {
        var resp = { msg: '', color: '#FFF', delay: '' };
        var url = endpoints.mdmMappingMatrix;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showToast(resp));
        } else {
            yield put(setMdmMappingMatrix(result.ResultData));
        }
    } catch (error) {
        yield put(showToast(error));
    }
}

export function* updateDeltaDatas({ payload }) {
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
        console.log('res', result);
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

                const uploadResult = yield* UploadFiles(
                    files,
                    jsonBody.workflowId
                );
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

export function* saveTaskPricing(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload.formdata;

        var url = endpoints.saveApolloUpdatePricing;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showMessage(resp));
        } else {
            const postJson = {
                WorkflowId: jsonBody.WorkflowTaskModel.WorkflowId,
                CustomerNumber: '',
                DivisionTypeId: 0,
                SystemTypeId: 0,
                DistributionChannelTypeId: 0,
                CompanyCodeTypeId: '',
                SalesOrgTypeId: 0,
            };

            yield put(getCustomerFromSAP(postJson));
            // yield put(getStatusBarData(postJson));
            yield put(
                updateTaskStatus({
                    teamId: result.ResultData.WorkflowTeamType,
                    status:
                        result.ResultData.WorkflowTaskModel
                            .WorkflowTaskOperationType === 1
                            ? TASK_APPROVED
                            : TASK_REJECTED,
                })
            );

            resp = {
                msg: 'Successfully saved the data',
                color: SUCCESS_BGCOLOR,
                success: true,
            };
            yield put(showMessage(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showMessage(resp));
    }
}

export function* saveTaskCredits(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload.formdata;
        var url = endpoints.saveApolloUpdateCredit;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showMessage(resp));
        } else {
            const postJson = {
                workflowId: jsonBody.WorkflowTaskModel.WorkflowId,
                fuctionalGroup: 'credit',
                taskId: jsonBody.WorkflowTaskModel.TaskId,
            };

            yield put(getFunctionalGroupData(postJson));
            // yield put(getStatusBarData(postJson));
            yield put(
                updateTaskStatus({
                    teamId: result.ResultData.WorkflowTeamType,
                    status:
                        result.ResultData.WorkflowTaskModel
                            .WorkflowTaskOperationType === 1
                            ? TASK_APPROVED
                            : TASK_REJECTED,
                })
            );

            resp = {
                msg: 'Successfully saved the data',
                color: SUCCESS_BGCOLOR,
                success: true,
            };
            yield put(showMessage(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showMessage(resp));
    }
}

export function* fetch_mdm_mapping_matrix() {
    yield takeLatest(GET_MDM_MAPPING_MATRIX, getMdmMatrix);
}

export function* updateData() {
    yield takeLatest(UPDATE_DELTAS, updateDeltaDatas);
}

export function* saveTaskCreditUpdate() {
    yield takeLatest(SAVE_APOLLO_UPDATE_CREDIT, saveTaskCredits);
}
export function* saveTaskPricingUpdate() {
    yield takeLatest(SAVE_APOLLO_UPDATE_PRICING, saveTaskPricing);
}
const updateFlowSagas = function* rootSaga() {
    yield all([
        fork(fetch_mdm_mapping_matrix),
        fork(updateData),
        fork(saveTaskPricingUpdate),
        fork(saveTaskCreditUpdate),
    ]);
};
export default updateFlowSagas;
