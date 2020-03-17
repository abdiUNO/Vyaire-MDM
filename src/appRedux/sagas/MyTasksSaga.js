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
} from '../../constants/ActionTypes';
import {
    showMessage,
    setTaxJurisdictionData,
} from '../../appRedux/actions/MyTasks';

import { ajaxPostRequest, ajaxPutFileRequest, endpoints } from './config';

export function* getTaxJurisdictionDetails(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        var jsonBody = data.payload;
        var url = endpoints.getTaxJurisdiction;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        let msg, color;
        if (result.IsSuccess) {
            var data = result.ResultData.TaxJurisdictions;
            if (data.length === 0) {
                msg = 'No Valid Tax Jurisdiction Found';
                color = FAILED_BGCOLOR;
            } else {
                msg = 'Tax Jurisdiction Found';
                color = SUCCESS_BGCOLOR;
            }
            resp = { msg: msg, color: color, taxData: data };
            yield put(setTaxJurisdictionData(resp));
        } else {
            resp = {
                msg: 'No Valid Tax Jurisdiction Found',
                color: FAILED_BGCOLOR,
            };
            yield put(showMessage(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showMessage(resp));
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

export function* saveApolloContracts(data) {
    try {
        var resp = { msg: '', color: '#FFF' };
        let fileUploadStatus = 'Unsuccessful',
            formDataStatus = 'Unsuccessful';
        //save form inputs
        var formBody = data.payload.formdata;
        var url = endpoints.saveApolloContracts;
        const result = yield call(ajaxPostRequest, url, formBody);
        if (result.OperationResultMessages[0].OperationalResultType === 1) {
            formDataStatus = 'Successful';
        } else {
            formDataStatus = 'Unsuccessful';
        }

        // save document into aws
        if (data.payload.filedata) {
            var fileBody = data.payload.filedata;
            var formcontent = data.payload.fileFormcontent;
            // get pre-signed url
            var url = endpoints.addDocument;
            var docname = fileBody.name;

            const result = yield call(ajaxPostRequest, url, formcontent);

            const filedata = new FormData();
            filedata.append('file', fileBody);
            if (result.IsSuccess) {
                var presigned_url = result.ResultData.PreSignedURL;
                const res = yield call(
                    ajaxPutFileRequest,
                    presigned_url,
                    filedata
                );
                console.log(res);
                if (res.length === 0) {
                    fileUploadStatus = 'Successful';
                } else {
                    fileUploadStatus = 'Unsuccessful';
                }
            }
        }

        //set status message
        let fileUploadMsg = fileUploadStatus + ' file upload';
        let formDataMsg = formDataStatus + ' saving  data ';
        var message;
        if (data.payload.filedata) {
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

const myTasksSagas = function* rootSaga() {
    yield all([
        fork(saveApolloCustomerMasterData),
        fork(saveApolloContractsData),
        fork(saveApolloCreditData),
        fork(saveApolloPricingData),
        fork(saveApolloGlobalTradeData),
        fork(getTaxJurisdictionData),
    ]);
};
export default myTasksSagas;
