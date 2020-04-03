import {
    all,
    call,
    fork,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import {
    SEARCH_CUSTOMER,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_FROM_SAP,
    ADVANCE_SEARCH_CUSTOMER,
    CREATE_CUSTOMER_REQUEST,
    FAILED_BGCOLOR,
} from '../../constants/ActionTypes';
import {
    showCustMessage,
    searchCustomerSuccess,
    getCustomerDetailSuccess,
    retrieveCustomerFromSAPSuccess,
    advanceSearchCustomerSuccess,
    createCustomerSuccess,
    createCustomerFailure,
} from '../../appRedux/actions/Customer';
import { showMessage as showToast } from '../../appRedux/actions/Toast';
import {
    customerMasterUrldomain,
    ajaxPostRequest,
    endpoints,
    ajaxPutFileRequest,
} from './config';

export function* UploadFiles(files, workflowId) {
    let filesBody = {};
    let filesData = files.map(file => {
        const { DocumentType, DocumentName, data } = file;
        const filedata = new FormData();
        filedata.append('file', data);

        filesBody[DocumentName] = filedata;

        return {
            userId: localStorage.getItem('userId'),
            workflowId,
            documentType: DocumentType,
            documentName: DocumentName,
        };
    });
    const url = endpoints.addDocument;
    const result = yield call(ajaxPostRequest, url, filesData);

    if (!result.IsSuccess) {
        throw new Error(result.OperationResultMessages[0]);
    }

    const { ResultData: resp } = result;

    let requests = resp.map(({ PreSignedURL, DocumentName }) => {
        event.preventDefault();

        var options = {
            headers: {
                'Content-Type': filesBody[DocumentName],
            },
        };

        return call(
            ajaxPutFileRequest,
            `https://cors-anywhere.herokuapp.com/${PreSignedURL}`,
            filesBody[DocumentName],
            {
                'Content-Type': 'multipart/form-data',
                'x-amz-acl': 'public-read',
            }
        );
    });

    const uploadedFiles = yield all(requests);
    return uploadedFiles;
}

export function* MdmCreateCustomer({ payload }) {
    const { history, data: jsonBody, files } = payload;
    const url = endpoints.MdmCreateCustomer;
    var resp = { msg: '', color: '#FFF' };
    try {
        yield put(
            showToast({
                msg: 'Saving new customer',
                color: '#2980b9',
            })
        );
        const createResult = yield call(ajaxPostRequest, url, jsonBody);
        if (createResult.IsSuccess) {
            window.scrollTo(0, 0);

            let result = { IsSuccess: true };
            if (files && files.length > 0) {
                yield put(
                    showToast({
                        msg: 'Uploading files',
                        color: '#2980b9',
                    })
                );

                yield* UploadFiles(files, jsonBody.WorkflowId);
            }

            if (result.IsSuccess) {
                yield put(
                    createCustomerSuccess({
                        msg: 'Successfully created new customer',
                        color: '#27ae60',
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
                yield put(createCustomerFailure(resp));
                window.scrollTo(0, 0);
            }
        } else {
            resp = {
                msg: `Internal Error: \nCould not create customer`,
                color: FAILED_BGCOLOR,
            };
            yield put(showToast(resp));
            yield put(createCustomerFailure(resp));
        }

        // const jsonBody = data;
        // const result = yield call(ajaxPostRequest, url, jsonBody);
        // if (result.IsSuccess) {
        //     yield put(createCustomerSuccess(result.ResultData));
        //     history.push({
        //         pathname: '/my-requests',
        //     });
        // }
    } catch (error) {
        // resp = { msg: error, color: FAILED_BGCOLOR };
        // yield put(getWorkflowsFailed(resp));

        resp = {
            msg: error.message,
            color: FAILED_BGCOLOR,
        };
        yield put(createCustomerFailure(resp));
    }
}

export function* getCustomerDetail(customer_id) {
    const cust_id = customer_id.payload;
    const text = 'nam';
    const url = customerMasterUrldomain + '/customer/' + cust_id + '/searchv2';
    try {
        const res = yield call(fetch, url);
        let data = yield call([res, 'json']);
        if (data.message) {
            //  no search results found
            let customerdata = [];
            yield put(getCustomerDetailSuccess(customerdata));
        } else {
            // yield put(getCustomerDetailSuccess(data.customers[0]));

            yield put(
                getCustomerDetailSuccess({
                    MdmNumber: '002491624',
                    ContactFirstName: '91CntctFirstName',
                    ContactLastName: '91CntctLastName ',
                    ContactFunction: '91Sales Contact ',
                    ContactTelephone: '91444444444',
                    ContactFax: '91883334444',
                    ContactEmailAddress: '91test@test.com',
                    Name: 'Name Test002491624',
                    Name2: '',
                    Name3: '',
                    Name4: '',
                    Street: '91123 test',
                    Street2: '91ste 123 ',
                    City: '91Dallas',
                    Region: '91TX',
                    PostalCode: '910210',
                    Country: 'USA',
                    SalesOrgId: 1,
                    ErpSystemId: 1,
                    SystemFields: Array(1),
                    0: {
                        System: 'SAP Apollo',
                        SoldTo: '',
                        PurposeOfRequest: '',
                        Role: 'Sold To (0001)',
                        SalesOrg: '0150',
                    },
                })
            );
        }
    } catch (error) {
        yield put(showCustMessage(error));
    }
}

export function* getSAPCustomerDetails({payload}) {
    const postData = payload;
    var resp = { msg: '', color: '#FFF' };
    const url = endpoints.getSAPCustomerDetails;
    
    try {        
        yield put(
            showToast({
                msg: 'Fetching Data From The ERP',
                color: '#2980b9',
            })
        );
        const result = yield call(ajaxPostRequest, url, postData);

        if (result.IsSuccess) {
            yield put(
                retrieveCustomerFromSAPSuccess(result.ResultData.CustomerData)
            );
        } else {
            resp = { msg: 'No data found', color: FAILED_BGCOLOR };
            yield put(showCustMessage(resp));
        }
    } catch (error) {
        resp = { msg: error, color: FAILED_BGCOLOR };
        yield put(showCustMessage(resp));
    }
}

export function* searchCustomers(action) {
    const jsonBody = action.payload;
    // const url = customerMasterUrldomain + '/customer/' + searchtext + '/searchv2';
    const url = endpoints.searchCustomers;
    try {
        // const res = yield call(fetch, url);
        // console.log('res',res);
        // let json = yield call([res, 'json']);
        // const data = {
        //     customers: [json],
        // };
        // if (data.customers[0].message) {
        //     //  no search results found
        //     let customerdata = [];
        //     yield put(searchCustomerSuccess(customerdata));
        // } else {
        //     console.log('searchresult',data);
        //     yield put(searchCustomerSuccess(data.customers[0].customers));
        // }
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (result.IsSuccess) {
            yield put(searchCustomerSuccess(result.ResultData));
        } else {
            let customerdata = [];
            yield put(searchCustomerSuccess(customerdata));
        }
    } catch (error) {
        yield put(showCustMessage(error));
    }
}

export function* advanceSearchCustomers(action) {
    const { jsonBody, history } = action.payload;
    const userId = localStorage.getItem('userId');
    // const url = customerMasterUrldomain + '/customer/' + searchtext + '/searchv2';
    const url = endpoints.advanceSearchCustomers;
    try {
        const result = yield call(ajaxPostRequest, url, {
            ...jsonBody,
            userId,
        });
        if (result.IsSuccess) {
            yield put(
                advanceSearchCustomerSuccess(result.ResultData.Customers)
            );
            history.push({
                pathname: `/search-results`,
                state: result.ResultData,
            });
        } else {
            let customerdata = [];
            yield put(advanceSearchCustomerSuccess(customerdata));
            history.push({
                pathname: `/search-results`,
                state: { ...result.ResultData, Customers: [], Workflows: [] },
            });
        }
    } catch (error) {
        yield put(showCustMessage(error));
    }
}

export function* retrieveCustomers() {
    yield takeEvery(SEARCH_CUSTOMER, searchCustomers);
}

export function* advSearch() {
    yield takeEvery(ADVANCE_SEARCH_CUSTOMER, advanceSearchCustomers);
}
export function* fetchCustomerDetail() {
    yield takeLatest(GET_CUSTOMER_DETAIL, getCustomerDetail);
}

export function* retrieveCustomersFromSAP() {
    yield takeLatest(GET_CUSTOMER_FROM_SAP, getSAPCustomerDetails);
}

export function* createCustomer() {
    yield takeLatest(CREATE_CUSTOMER_REQUEST, MdmCreateCustomer);
}

const customerSagas = function* rootSaga() {
    yield all([
        fork(retrieveCustomers),
        fork(fetchCustomerDetail),
        fork(retrieveCustomersFromSAP),
        fork(advSearch),
        fork(createCustomer),
    ]);
};
export default customerSagas;
