import axios from 'axios';
import { user } from 'axios';
import { Auth } from 'aws-amplify';

export const customerMasterUrldomain =
    'https://cors-anywhere.herokuapp.com/https://oaa4qq34j6.execute-api.us-east-2.amazonaws.com/dev';

export const endpoints = {
    authUser: 'https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev',
    fetchMyRequests:
        'https://6mr4plmd1e.execute-api.us-east-2.amazonaws.com/Dev',
    withdrawRequest:
        'https://cors-anywhere.herokuapp.com/https://mcxteon4gd.execute-api.us-east-2.amazonaws.com/dev',
    getTaxJurisdiction:
        'https://jtty8uwg44.execute-api.us-east-2.amazonaws.com/dev',
    saveApolloCustMaster:
        'https://qx16em1ys5.execute-api.us-east-2.amazonaws.com/dev',
    saveApolloCredit:
        'https://2fgx2fk31e.execute-api.us-east-2.amazonaws.com/dev',
    saveApolloContracts:
        'https://th7uaolh43.execute-api.us-east-2.amazonaws.com/dev',
    addDocument: 'https://hap7d2tr48.execute-api.us-east-2.amazonaws.com/dev',
    saveApolloPricing:
        'https://twhfscuvx3.execute-api.us-east-2.amazonaws.com/dev',
    saveApolloGlobalTrade:
        'https://405kdrmo37.execute-api.us-east-2.amazonaws.com/dev',
    getFunctionalGroupDetails:
        'https://ojsjl6n8q7.execute-api.us-east-2.amazonaws.com/dev',
    getMyTasks: 'https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev/',
    getStatusBarDetails:
        'https://q43ik9wi02.execute-api.us-east-2.amazonaws.com/dev',
    MdmCreateCustomer:
        'https://cors-anywhere.herokuapp.com/https://ugrtoiy1ve.execute-api.us-east-2.amazonaws.com/dev',
    getSAPCustomerDetails:
        'https://4surjj7ore.execute-api.us-east-2.amazonaws.com/dev',
    searchCustomers:
        'https://xserl94dij.execute-api.us-east-2.amazonaws.com/dev',
    advanceSearchCustomers:
        'https://xserl94dij.execute-api.us-east-2.amazonaws.com/dev',
};

export const headerParams = {
    Authorization: localStorage.getItem('accessToken'),
};

export const filePartParams = {
    'Content-Type': 'multipart/form-data',
};

export const ajaxGetRequest = async url => {
    const userSession = await Auth.currentSession();
    // const userInfo = await Auth.currentUserInfo()
    return await axios
        .get(url, { headers: { Authorization: userSession.idToken.jwtToken } })
        .then(data => data.data)
        .catch(error => error);
};

export const ajaxPostRequest = async (url, data, passUserId = false) => {
    const userSession = await Auth.currentSession();

    // const userInfo = await Auth.currentUserInfo()
    let body = data;
    return await axios
        .post(url, body, {
            headers: { Authorization: userSession.idToken.jwtToken },
        })
        .then(data => data.data)
        .catch(error => error);
};

export const ajaxPutFileRequest = async (url, data) =>
    await axios
        .put(url, data, { headers: filePartParams })
        .then(data => data.data)
        .catch(error => error);

export const getMockSearchResult = async () =>
    new Promise((resolve, reject) => {
        resolve({
            WorkflowCustomerSearchResults: [
                {
                    WorkflowId: 'wf0098379',
                    WorkflowType: 1,
                    WorkflowTitle: 'My Workflow',
                    CustomerName: 'Cardinal Health',
                    WorkflowDateCreated: '2020-01-13T21:00:26.724359-06:00',
                    WorkflowStatusType: 1,
                },
                {
                    WorkflowId: 'wf234243',
                    WorkflowType: 2,
                    WorkflowTitle: 'My Workflow 2',
                    CustomerName: 'Cardinal Health 2',
                    WorkflowDateCreated: '2020-01-13T21:00:26.7415697-06:00',
                    WorkflowStatusType: 2,
                },
            ],
            MdmSearchResults: [
                {
                    MdmCustomerNumber: 'mdm233247',
                    CustomerName: 'Cardinal Health',
                    Street: 'Belmont',
                    City: 'Chicago',
                    State: 'IL',
                    ZipCode: '60657',
                    Country: 'USA',
                    DunsNumber: '878234h',
                    Role: 'SAP Apollo: Sold To (0001)',
                    SystemName: 'SAP Apollo',
                },
                {
                    MdmCustomerNumber: 'mdm23234',
                    CustomerName: 'Cardinal Health2',
                    Street: 'Monroe',
                    City: 'Chicago',
                    State: 'IL',
                    ZipCode: '60072',
                    Country: 'USA',
                    DunsNumber: '878234h',
                    Role: 'SAP Apollo: Sold To (0001)',
                    SystemName: 'SAP Apollo',
                },
            ],
        });
    });
