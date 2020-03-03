import axios from "axios";

export const customerMasterUrldomain =
    'https://cors-anywhere.herokuapp.com/https://oaa4qq34j6.execute-api.us-east-2.amazonaws.com/dev';
export const headerParams = {
    Authorization: localStorage.getItem('accessToken'),
};

export const filePartParams = {
    'Content-Type': 'multipart/form-data'
}

export const ajaxGetRequest = async url =>
    await axios
        .get(url)
        .then(data => data)
        .catch(error => error);

export const ajaxPostRequest = async (url, data) =>
    await axios
        .post(url, data, { headers: headerParams })
        .then(data => data.data)
        .catch(error => error);

export const ajaxPutFileRequest = async (url,data) =>
    await axios
        .put(url,data,{headers:filePartParams })
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
