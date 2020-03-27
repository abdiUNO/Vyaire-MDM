import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
    SAVE_APOLLO_PRICING,
    SAVE_APOLLO_GLOBALTRADE,
    GET_TAX_JURISDICTION,
    RELEASE_CHECKLIST,
} from '../../constants/ActionTypes';
import {
    showMessage,
    setTaxJurisdictionData,
} from '../../appRedux/actions/MyTasks';
import { showMessage as showToast } from '../../appRedux/actions/Toast';
import { UploadFiles } from './Customer';

import {
    getFunctionalGroupData,
    getStatusBarData,
    updateTaskStatus,
} from '../../appRedux/actions/Workflow';

import { TASK_APPROVED, TASK_REJECTED } from '../../constants/WorkflowEnums';

import { ajaxPostRequest, ajaxPutFileRequest, endpoints } from './config';

export function* getTaxJurisdictionDetails(data) {
    yield put(
        showToast({
            msg: 'Fetching Tax Jurisdiction',
            color: '#2980b9',
            delay: 100,
        })
    );
    try {
        var resp = { msg: '', color: '#FFF', delay: '' };
        var jsonBody = data.payload;
        var url = endpoints.getTaxJurisdiction;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        let msg, color, delay;
        if (result.IsSuccess) {
            var data = result.ResultData.TaxJurisdictions;
            if (data.length === 0) {
                msg = 'No Valid Tax Jurisdiction Found';
                color = FAILED_BGCOLOR;
                delay: 10000;
            } else {
                msg = 'Tax Jurisdiction Found';
                color = SUCCESS_BGCOLOR;
            }
            resp = { msg: msg, color: color, taxData: data };
            yield put(showToast(resp));
            yield put(setTaxJurisdictionData(resp));
        } else {
            resp = {
                msg: 'No Valid Tax Jurisdiction Found',
                color: FAILED_BGCOLOR,
                delay: 10000,
            };
            yield put(showToast(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showToast(resp));
    }
}

export function* saveApolloCustMaster(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload;
        var url = endpoints.saveApolloCustMaster;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showMessage(resp));
        } else {
            const postJson = {
                workflowId: jsonBody.WorkflowTaskModel.WorkflowId,
                fuctionalGroup: 'customermaster',
                taskId: jsonBody.WorkflowTaskModel.TaskId,
            };

            console.log();

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

export function* saveApolloCredits(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload.formdata;
        var url = endpoints.saveApolloCredit;
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

export function* saveApolloContracts(data) {
    try {
        let resp = { msg: '', color: '#FFF' };
        let fileUploadStatus = 'Unsuccessful',
            formDataStatus = 'Unsuccessful';
        //save form inputs

        var formBody = data.payload.formdata;
        var url = endpoints.saveApolloContracts;
        const result = yield call(ajaxPostRequest, url, formBody);
        if (result.IsSuccess) {
            const postJson = {
                workflowId: formBody.WorkflowTaskModel.WorkflowId,
                fuctionalGroup: 'contracts',
                taskId: formBody.WorkflowTaskModel.TaskId,
            };

            resp.taskStatus = {
                taskStatus: { teamId: 5, status: TASK_APPROVED },
            };

            yield put(getFunctionalGroupData(postJson));
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

            formDataStatus = 'Successful';
        } else {
            formDataStatus = 'Unsuccessful';
        }

        // save document into aws
        if (data.payload.files && data.payload.files.length > 0) {
            var files = data.payload.files;

            const uploadResult = yield* UploadFiles(
                files,
                formBody.WorkflowTaskModel.WorkflowId
            );
            if (uploadResult[0].length === 0) {
                fileUploadStatus = 'Successful';
            } else {
                fileUploadStatus = 'UnSuccessful';
            }
        }

        const postJson = {
            workflowId: formBody.WorkflowTaskModel.WorkflowId,
            fuctionalGroup: 'contracts',
            taskId: formBody.WorkflowTaskModel.TaskId,
        };

        yield put(getFunctionalGroupData(postJson));

        //set status message
        let fileUploadMsg = fileUploadStatus + ' file upload';
        let formDataMsg = formDataStatus + ' saving  data ';
        var message;
        if (data.payload.files && data.payload.files.length > 0) {
            message = formDataMsg + ' & ' + fileUploadMsg;
            if (
                formDataStatus === 'Unsuccessful' ||
                fileUploadStatus === 'Unsuccessful'
            ) {
                resp = { msg: message, color: FAILED_BGCOLOR };
                yield put(showMessage(resp));
            } else {
                resp = { msg: message, color: SUCCESS_BGCOLOR };
                yield put(showMessage(resp));
            }
        } else {
            message = formDataMsg;
            if (formDataStatus === 'Unsuccessful') {
                resp = { msg: message, color: FAILED_BGCOLOR };
                yield put(showMessage(resp));
            } else {
                resp = { msg: message, color: SUCCESS_BGCOLOR };
                yield put(showMessage(resp));
            }
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showMessage(resp));
    }
}

export function* saveApolloPricing(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload.formdata;

        var url = endpoints.saveApolloPricing;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showMessage(resp));
        } else {
            const postJson = {
                workflowId: jsonBody.WorkflowTaskModel.WorkflowId,
                fuctionalGroup: 'pricing',
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

export function* saveApolloGlobalTrade(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload;
        var url = endpoints.saveApolloGlobalTrade;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showMessage(resp));
        } else {
            const postJson = {
                workflowId: jsonBody.WorkflowTaskModel.WorkflowId,
                fuctionalGroup: 'globaltrade',
                taskId: jsonBody.WorkflowTaskModel.TaskId,
            };

            yield put(getFunctionalGroupData(postJson));
            yield put(getStatusBarData(postJson));

            resp = {
                msg: 'Successfully saved the data',
                color: SUCCESS_BGCOLOR,
            };
            yield put(showMessage(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showMessage(resp));
    }
}

export function* release_check_list({ payload }) {
    var jsonBody = payload.formData;
    var teamId = payload.teamId;
    var url = endpoints.releaseCheckList;
    var resp = { msg: '', color: '#FFF' };
    try {
        console.log('py', payload);
        const result = yield call(ajaxPostRequest, url, jsonBody);

        console.log('re0', result);
        if (!result.IsSuccess) {
            resp = { msg: 'Error saving data', color: FAILED_BGCOLOR };
            yield put(showMessage(resp));
        } else {
            yield put(
                updateTaskStatus({
                    teamId: teamId,
                    status:
                        result.ResultData.WorkflowTaskOperationType === 1
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

export function* saveApolloCustomerMasterData() {
    yield takeLatest(SAVE_APOLLO_CUSTOMER_MASTER, saveApolloCustMaster);
}
export function* saveApolloContractsData() {
    yield takeLatest(SAVE_APOLLO_CONTRACTS, saveApolloContracts);
}

export function* saveApolloCreditData() {
    yield takeLatest(SAVE_APOLLO_CREDIT, saveApolloCredits);
}

export function* saveApolloPricingData() {
    yield takeLatest(SAVE_APOLLO_PRICING, saveApolloPricing);
}

export function* saveApolloGlobalTradeData() {
    yield takeLatest(SAVE_APOLLO_GLOBALTRADE, saveApolloGlobalTrade);
}

export function* getTaxJurisdictionData() {
    yield takeLatest(GET_TAX_JURISDICTION, getTaxJurisdictionDetails);
}

export function* release_task_check_list() {
    yield takeLatest(RELEASE_CHECKLIST, release_check_list);
}

const myTasksSagas = function* rootSaga() {
    yield all([
        fork(saveApolloCustomerMasterData),
        fork(saveApolloContractsData),
        fork(saveApolloCreditData),
        fork(saveApolloPricingData),
        fork(saveApolloGlobalTradeData),
        fork(getTaxJurisdictionData),
        fork(release_task_check_list),
    ]);
};
export default myTasksSagas;
