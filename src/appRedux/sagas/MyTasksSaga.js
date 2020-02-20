import {
    all,
    call,
    fork,
    put,
    takeLatest,
} from 'redux-saga/effects';
import {
    SUCCESS_BGCOLOR,
    FAILED_BGCOLOR,
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS
} from '../../constants/ActionTypes';
import {
    showMessage,
} from '../../appRedux/actions/MyTasks';

import {
    ajaxPostRequest,
} from './config';


export function* saveApolloCustMaster(data){
    var resp={'msg':'','color':'#FFF'}
    var jsonBody=data.payload;
    var url='https://cors-anywhere.herokuapp.com/https://9tqwkgmyvl.execute-api.us-east-2.amazonaws.com/dev';
    const result=yield call (ajaxPostRequest,url,jsonBody);
    console.log(result);   
    if(result.OperationResultMessages[0].OperationalResultType != 1){
        resp={'msg':'Error saving data','color':FAILED_BGCOLOR}
        yield put(showMessage(resp))
    }else{
        resp={'msg':'Successfully saved the data','color':SUCCESS_BGCOLOR}
        yield put(showMessage(resp))
    }
}

export function* saveApolloContracts(data){
    var resp={'msg':'','color':'#FFF'}
    var jsonBody=data.payload;
    var url='https://cors-anywhere.herokuapp.com/https://4n9j07d74f.execute-api.us-east-2.amazonaws.com/dev';
    const result=yield call (ajaxPostRequest,url,jsonBody);
    
    console.log(result);   
    if(result.IsSuccess){
        resp={'msg':'Successfully saved the data','color':SUCCESS_BGCOLOR}
        yield put(showMessage(resp))
    }else{
        resp={'msg':'Error saving data','color':FAILED_BGCOLOR}        
        yield put(showMessage(resp))
    }
}

export function* saveApolloCustomerMasterData(){
    yield takeLatest(SAVE_APOLLO_CUSTOMER_MASTER,saveApolloCustMaster)
}
export function* saveApolloContractsData(){
    yield takeLatest(SAVE_APOLLO_CONTRACTS,saveApolloContracts)
}

const myTasksSagas = function* rootSaga() {
    yield all([
         fork(saveApolloCustomerMasterData),
         fork(saveApolloContractsData)
        ]);
};
export default myTasksSagas;
