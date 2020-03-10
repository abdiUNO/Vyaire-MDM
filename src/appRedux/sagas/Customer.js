import {
    all,
    call,
    fork,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import {
    SEARCH_CUSTOMER,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_FROM_SAP,
    ADVANCE_SEARCH_CUSTOMER,
    SUCCESS_BGCOLOR,
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
} from '../../appRedux/actions/Customer';

import {
    customerMasterUrldomain,
    headerParams,
    ajaxsearchRequest,
    ajaxPostRequest,
} from './config';
import { getWorkflowsFailed, getWorkflowsSuccess } from '../actions';

export function* MdmCreateCustomer({ payload }) {
    const { history } = payload;

    const url =
        'https://cors-anywhere.herokuapp.com/https://82fpwwhs4i.execute-api.us-east-2.amazonaws.com/dev';
    try {
        const jsonBody = payload.data;
        const result = yield call(ajaxPostRequest, url, jsonBody);
        if (result.IsSuccess) {
            yield put(createCustomerSuccess(result.ResultData));
            history.push({
                pathname: '/customers/create-additional',
                state: result.ResultData,
            });
        }
    } catch (error) {
        // resp = { msg: error, color: FAILED_BGCOLOR };
        // yield put(getWorkflowsFailed(resp));
        console.log(error);
    }
}

export function* getCustomerDetail(customer_id) {
    const cust_id = customer_id.payload;
    const text = 'nam';
    const url = customerMasterUrldomain + '/customer/' + cust_id + '/searchv2';
    try {
        const res = yield call(fetch, url);
        let data = yield call([res, 'json']);
        console.log(data);
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

export function* getSAPCustomerDetails(data) {
    const postData = data.payload;
    var resp = { msg: '', color: '#FFF' };
    const url =
        'https://cors-anywhere.herokuapp.com/https://4surjj7ore.execute-api.us-east-2.amazonaws.com/dev';
    try {
        var jsonBody = {
            WorkflowId: 'wf12345678',
            CustomerNumber: '0000497077',
            RoleTypeId: 1,
            SalesOrgTypeId: 2,
            SystemType: 1,
        };

        const result = yield call(ajaxPostRequest, url, jsonBody);

        console.log('bapi70OnLoad', result);
        console.log(result.IsSuccess);
        if (result.IsSuccess) {
            console.log('camein');
            yield put(
                retrieveCustomerFromSAPSuccess(result.ResultData.CustomerData)
            );
            console.log('success');
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
    const url =
        'https://cors-anywhere.herokuapp.com/https://xserl94dij.execute-api.us-east-2.amazonaws.com/dev';
    
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
        console.log('searchresult', result);
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
    const jsonBody = action.payload;
    // const url = customerMasterUrldomain + '/customer/' + searchtext + '/searchv2';
    const url =
        'https://cors-anywhere.herokuapp.com/https://xserl94dij.execute-api.us-east-2.amazonaws.com/dev';

    try {
        const result = yield call(ajaxPostRequest, url, jsonBody);
        console.log('advsearchresult', result);
        if (result.IsSuccess) {
            yield put(
                advanceSearchCustomerSuccess(result.ResultData)
            );
        } else {
            let customerdata = [];
            yield put(advanceSearchCustomerSuccess(customerdata));
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
