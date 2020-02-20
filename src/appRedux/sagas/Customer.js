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
} from '../../constants/ActionTypes';
import {
    showMessage,
    searchCustomerSuccess,
    getCustomerDetailSuccess,
} from '../../appRedux/actions/Customer';

import {
    customerMasterUrldomain,
    headerParams,
    ajaxsearchRequest,
    ajaxPostRequest,
} from './config';

export function* getCustomerDetail(customer_id) {
    const cust_id = customer_id.payload;
    const text = 'nam';
    const url = customerMasterUrldomain + '/customer/' + text + '/searchv2';
    try {
        // const res = yield call(fetch, url);
        // let data = yield call([res, 'json']);
        // console.log(data);
        // if (data.message) {
        //     //  no search results found
        //     let customerdata = [];
        //     yield put(getCustomerDetailSuccess(customerdata));
        // } else {
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
                Region: 'HI',
                PostalCode: '910210',
                Category:'oem',
                Country: 'US',
                SalesOrgId: 1,
                ErpSystemId: 1,
                SystemFields: Array(1),
                Role:'soldTo',
                0: {
                    System: 'SAP Apollo',
                    SoldTo: '',
                    PurposeOfRequest: '',
                    Role: '0001 sold to',
                    SalesOrg: '0150',
                },
            })
        );
        // }
    } catch (error) {
        yield put(showMessage(error));
    }
}

export function* searchCustomers(action) {
    const text = action.payload;
    const url = customerMasterUrldomain + '/customer/' + text + '/searchv2';
    try {
        const res = yield call(fetch, url);
        let json = yield call([res, 'json']);
        const data = {
            customers: [json],
        };
        if (data.customers[0].message) {
            //  no search results found
            let customerdata = [];
            yield put(searchCustomerSuccess(customerdata));
        } else {
            yield put(searchCustomerSuccess(data.customers[0].customers));
        }
    } catch (error) {
        yield put(showMessage(error));
    }
}

export function* retrieveCustomers() {
    yield takeEvery(SEARCH_CUSTOMER, searchCustomers);
}

export function* fetchCustomerDetail() {
    yield takeLatest(GET_CUSTOMER_DETAIL, getCustomerDetail);
}

const customerSagas = function* rootSaga() {
    yield all([fork(retrieveCustomers),
         fork(fetchCustomerDetail)
        ]);
};
export default customerSagas;
