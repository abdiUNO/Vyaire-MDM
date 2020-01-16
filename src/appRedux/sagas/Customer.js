import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import axios from "axios";
import {
	SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS
} from "../../constants/ActionTypes";
import {showMessage, 
    searchCustomerSuccess} from "../../appRedux/actions/Customer";

import {customerMasterUrldomain,headerParams,ajaxsearchRequest,ajaxPostRequest} from "./config";

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
  
const customerSagas= function* rootSaga() {
    yield all([
    fork(retrieveCustomers)]);
  }
  export default customerSagas;
  