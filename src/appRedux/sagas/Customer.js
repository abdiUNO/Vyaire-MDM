import {all, call, fork, put, takeEvery,takeLatest} from "redux-saga/effects";
import axios from "axios";
import {
	SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_DETAIL_SUCCESS
} from "../../constants/ActionTypes";
import {showMessage, 
    searchCustomerSuccess,
    getCustomerDetailSuccess} from "../../appRedux/actions/Customer";

import {customerMasterUrldomain,headerParams,ajaxsearchRequest,ajaxPostRequest} from "./config";

export function* getCustomerDetail(customer_id){
    const cust_id = customer_id.payload;
    const text='nam';
    const url=customerMasterUrldomain+'/customer/'+text+'/searchv2'
    try{
        const res = yield call(fetch,url);
        let data = yield call([res, 'json']);
        console.log(data)       
        if(data.message){
            //  no search results found
            let customerdata=[]
            yield put(getCustomerDetailSuccess(customerdata))
        }else{
            yield put(getCustomerDetailSuccess(data.customers[0]))
        }
    }
    catch(error){
        yield put(showMessage(error))
    }
}


export function* searchCustomers(action) {
    const text = action.payload;
    const url=customerMasterUrldomain+'/customer/'+text+'/searchv2'
    try{
        const res = yield call(fetch,url);
        let json = yield call([res, 'json']);
        const data = {
            customers: [json],
        };
        if(data.customers[0].message){
            //  no search results found
            let customerdata=[]
            yield put(searchCustomerSuccess(customerdata))
        }else{
            yield put(searchCustomerSuccess(data.customers[0].customers))
        }
    }
    catch(error){
        yield put(showMessage(error))
    }    
}


export function* retrieveCustomers() {
    yield takeEvery(SEARCH_CUSTOMER, searchCustomers);
}


export function* fetchCustomerDetail() {
    yield takeLatest(GET_CUSTOMER_DETAIL, getCustomerDetail);
}
  
const customerSagas= function* rootSaga() {
    yield all([
    fork(retrieveCustomers),
    fork(fetchCustomerDetail)
]);
  }
  export default customerSagas;
  