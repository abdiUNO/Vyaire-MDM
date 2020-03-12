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
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
    SAVE_APOLLO_PRICING,
    SAVE_APOLLO_GLOBALTRADE
} from '../../constants/ActionTypes';
import {
    showMessage,
} from '../../appRedux/actions/MyTasks';

import {
    ajaxPostRequest,ajaxPutFileRequest
} from './config';


export function* saveApolloCustMaster(data){
    try{
        var resp={'msg':'','color':'#FFF'}
        var jsonBody=data.payload;
        var url='https://cors-anywhere.herokuapp.com/https://9tqwkgmyvl.execute-api.us-east-2.amazonaws.com/dev';
        const result=yield call (ajaxPostRequest,url,jsonBody);
        if(!result.IsSuccess){
            resp={'msg':'Error saving data','color':FAILED_BGCOLOR}
            yield put(showMessage(resp))
        }else{
            resp={'msg':'Successfully saved the data','color':SUCCESS_BGCOLOR}
            yield put(showMessage(resp))
        }
    }catch(error){
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(showMessage(resp))
    }
}



export function* saveApolloCredits(data){
    try{
        var resp={'msg':'','color':'#FFF'}
        var jsonBody=data.payload.formdata;
        var url='https://cors-anywhere.herokuapp.com/https://le20ua4yy8.execute-api.us-east-2.amazonaws.com/dev';
        const result=yield call (ajaxPostRequest,url,jsonBody);
        if(!result.IsSuccess){
            resp={'msg':'Error saving data','color':FAILED_BGCOLOR}
            yield put(showMessage(resp))
        }else{
            resp={'msg':'Successfully saved the data','color':SUCCESS_BGCOLOR}
            yield put(showMessage(resp))
        }
    }catch(error){
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(showMessage(resp))
    }
}

export function* saveApolloContracts(data){
    try{
        var resp={'msg':'','color':'#FFF'}
        let fileUploadStatus = 'Unsuccessful' , formDataStatus='Unsuccessful';
         //save form inputs
         var formBody=data.payload.formdata;
         var url='https://cors-anywhere.herokuapp.com/https://4n9j07d74f.execute-api.us-east-2.amazonaws.com/dev';
         const result=yield call (ajaxPostRequest,url,formBody);
         if(result.OperationResultMessages[0].OperationalResultType === 1){
             formDataStatus='Successful'
         }else{
             formDataStatus='Unsuccessful'
         }

        // save document into aws
        if(data.payload.filedata){
            var fileBody=data.payload.filedata;
            var formcontent=data.payload.fileFormcontent;
            // get pre-signed url
            var url='https://cors-anywhere.herokuapp.com/https://hap7d2tr48.execute-api.us-east-2.amazonaws.com/dev';
            var docname=fileBody.name;

            const result=yield call (ajaxPostRequest,url,formcontent);

            const filedata = new FormData()
            filedata.append('file', fileBody)
            if(result.OperationResultMessages[0].OperationalResultType === 1){
                var presigned_url='https://cors-anywhere.herokuapp.com/'+result.ResultData.PreSignedURL
                const res= yield call(ajaxPutFileRequest,presigned_url,filedata);
                console.log(res)
                if(res.length === 0 ){
                    fileUploadStatus='Successful';
                }else{
                    fileUploadStatus='Unsuccessful';
                }
            }
        }

        //set status message
        let fileUploadMsg=fileUploadStatus+' file upload'
        let formDataMsg=formDataStatus+' saving  data '
        var message;
        if(data.payload.filedata){
            message=formDataMsg+' & '+fileUploadMsg;
            if(formDataStatus==='Unsuccessful' ||fileUploadStatus=== 'Unsuccessful'){
                resp={'msg':message,'color':FAILED_BGCOLOR}
                yield put(showMessage(resp))
            }else{
                resp={'msg':message,'color':SUCCESS_BGCOLOR}
                yield put(showMessage(resp))
            }
        }else{
            message=formDataMsg;
            if(formDataStatus==='Unsuccessful'){
                resp={'msg':message,'color':FAILED_BGCOLOR}
                yield put(showMessage(resp))
            }else{
                resp={'msg':message,'color':SUCCESS_BGCOLOR}
                yield put(showMessage(resp))
            }
        }

    } catch(error){
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(showMessage(resp))
    }
}


export function* saveApolloPricing(data){
    try{
        var resp={'msg':'','color':'#FFF'}
        var jsonBody=data.payload.formdata;
        var url='https://cors-anywhere.herokuapp.com/https://5zdqyo520e.execute-api.us-east-2.amazonaws.com/dev';
        const result=yield call (ajaxPostRequest,url,jsonBody);
        if(!result.IsSuccess){
            resp={'msg':'Error saving data','color':FAILED_BGCOLOR}
            yield put(showMessage(resp))
        }else{
            resp={'msg':'Successfully saved the data','color':SUCCESS_BGCOLOR}
            yield put(showMessage(resp))
        }
    }catch(error){
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(showMessage(resp))
    }
}


export function* saveApolloGlobalTrade(data){
    try{
        var resp={'msg':'','color':'#FFF'}
        var jsonBody=data.payload;
        var url='https://cors-anywhere.herokuapp.com/https://4c4mjyf70b.execute-api.us-east-2.amazonaws.com/dev';
        const result=yield call (ajaxPostRequest,url,jsonBody);
        if(!result.IsSuccess){
            resp={'msg':'Error saving data','color':FAILED_BGCOLOR}
            yield put(showMessage(resp))
        }else{
            resp={'msg':'Successfully saved the data','color':SUCCESS_BGCOLOR}
            yield put(showMessage(resp))
        }
    }catch(error){
        resp={'msg':error,'color':FAILED_BGCOLOR}
        yield put(showMessage(resp))
    }
}


export function* saveApolloCustomerMasterData(){
    yield takeLatest(SAVE_APOLLO_CUSTOMER_MASTER,saveApolloCustMaster)
}
export function* saveApolloContractsData(){
    yield takeLatest(SAVE_APOLLO_CONTRACTS,saveApolloContracts)
}

export function* saveApolloCreditData(){
    yield takeLatest(SAVE_APOLLO_CREDIT,saveApolloCredits)
}

export function* saveApolloPricingData(){
    yield takeLatest(SAVE_APOLLO_PRICING,saveApolloPricing)
}

export function* saveApolloGlobalTradeData(){
    yield takeLatest(SAVE_APOLLO_GLOBALTRADE,saveApolloGlobalTrade)

}

const myTasksSagas = function* rootSaga() {
    yield all([
         fork(saveApolloCustomerMasterData),
         fork(saveApolloContractsData),
         fork(saveApolloCreditData),
         fork(saveApolloPricingData),
         fork(saveApolloGlobalTradeData)
        ]);
};
export default myTasksSagas;
