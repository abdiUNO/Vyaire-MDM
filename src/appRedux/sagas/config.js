import axios from 'axios';
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
        'https://cors-anywhere.herokuapp.com/https://4surjj7ore.execute-api.us-east-2.amazonaws.com/dev',
    searchCustomers:
        'https://xserl94dij.execute-api.us-east-2.amazonaws.com/dev',
    advanceSearchCustomers:
        'https://xserl94dij.execute-api.us-east-2.amazonaws.com/dev',
    releaseCheckList:
        'https://jh5ri1exw5.execute-api.us-east-2.amazonaws.com/dev',
    mdmMappingMatrix:
        'https://r1uag7p7vf.execute-api.us-east-2.amazonaws.com/dev/',
    deltaUpdate: 'https://v1mjrrxwwh.execute-api.us-east-2.amazonaws.com/dev',
};

export const headerParams = {
    Authorization: localStorage.getItem('accessToken'),
};

export const filePartParams = {
    'Content-Type': 'multipart/form-data',
};

export const ajaxGetRequest = async (url) => {
    const userSession = await Auth.currentSession();
    // const userInfo = await Auth.currentUserInfo()
    return await axios
        .get(url, { headers: { Authorization: userSession.idToken.jwtToken } })
        .then((data) => data.data)
        .catch((error) => error);
};

export const ajaxPostRequest = async (url, data, passUserId = false) => {
    const userSession = await Auth.currentSession();
    console.log('jwt', userSession.idToken.jwtToken);
    // const userInfo = await Auth.currentUserInfo()
    let body = data;

    return await axios
        .post(url, body, {
            headers: { Authorization: userSession.idToken.jwtToken },
        })
        .then((data) => data.data)
        .catch((error) => error);
};

export const ajaxPutFileRequest = async (url, data) =>
    await axios
        .put(url, data, { headers: filePartParams })
        .then((data) => data.data)
        .catch((error) => error);

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

export const normalize = (arr) => {
    const reducer = (accumulator, currentValue) => {
        accumulator[currentValue.Name] = currentValue;
        console.log({ accumulator, currentValue });

        return accumulator;
    };

    console.log(arr.reduce(reducer, {}));

    return arr.reduce(reducer, {});
};

export const getMockUpdateTaskDetail = async () => {
    const data = {
        OperationName: 'GetCustomerWithDeltas',
        IsSuccess: true,
        OperationResultMessages: [],
        ResultData: {
            CustomerData: {
                SystemType: 1,
                Title: '',
                Name1: 'dd asdf',
                Name2: '',
                Name3: '',
                Name4: '',
                Street: '1 Dell Way',
                Street2: '',
                City: 'Round Rock',
                Region: 'TX',
                Postalcode: '78682',
                Country: 'US',
                Telephone: '',
                Fax: '',
                Email: '',
                Taxnumber: '',
                VatRegNo: '',
                SicCode4: '5614',
                SicCode6: '561499',
                SicCode8: '',
                NaicsCode: '',
                DunsNumber: '081204664',
                License: '33',
                LicenseExpDate: '2020-03-28',
                SearchTerm1: '',
                SearchTerm2: '',
                DistributionChannel: '',
                Division: '',
                TransporationZone: '',
                TaxNumber2: '',
                SortKey: '009',
                PaymentHistoryRecord: 'F',
                PaymentMethods: 'c',
                AcctgClerk: '01',
                AccountStatement: '2',
                OrderCombination: '',
                IncoTerms2: '',
                TaxClassification: '1',
                CreditLimit: '0',
                CredInfoNumber: '',
                LastExtReview: '0000-00-00',
                Rating: '',
                PaymentIndex: '',
                ContactFirstName: 'dd asdf',
                ContactLastName: '',
                ContactPhone: '',
                ContactFax: '',
                ContactEmail: '',
                RoleTypeId: 0,
                SalesOrgTypeId: 0,
                CustomerClassTypeId: 0,
                IndustryCodeTypeId: 0,
                CompanyCodeTypeId: 2,
                IndustryTypeId: 0,
                ReconAccountTypeId: 2,
                SalesOfficeTypeId: 0,
                CustomerGroupTypeId: 0,
                PPCustProcTypeId: 0,
                CustomerPriceProcTypeId: 0,
                PriceListTypeId: 0,
                DeliveryPriorityTypeId: 0,
                IncoTerms1TypeId: 0,
                AcctAssignmentGroupTypeId: 0,
                AccountTypeId: 0,
                ShippingCustomerTypeId: 0,
                PaymentTermsTypeId: 0,
                CreditRepGroupTypeId: 0,
                RiskCategoryTypeId: 0,
                ShippingConditionsTypeId: 0,
            },
            Deltas: [
                {
                    Name: 'Name1',
                    OriginalValue: 'test1',
                    UpdatedValue: 'test2',
                },
                {
                    Name: 'Name2',
                    OriginalValue: '122',
                    UpdatedValue: '14',
                },
                {
                    Name: 'Name3',
                    OriginalValue: '12',
                    UpdatedValue: '9',
                },
                {
                    Name: 'CreditLimit',
                    OriginalValue: '1.00',
                    UpdatedValue: '3.00',
                },
                {
                    Name: 'GTField1',
                    OriginalValue: 'CARDINALS',
                    UpdatedValue: 'CARDINALS NEW 1',
                },
                {
                    Name: 'GTField2',
                    OriginalValue: 'LUBBOCK',
                    UpdatedValue: 'HOUSTON',
                },
            ],
            CreateWorkflowId: '0000497427',
        },
    };

    const payload = {
        ...data.ResultData,
        Deltas: normalize(data.ResultData.Deltas),
    };

    return payload;
};

export const GetMockWorkflowTaskStatus = async () => {
    const data = {
        OperationName: 'ProcessGetWorkflowTaskStatusData',
        IsSuccess: false,
        OperationResultMessages: [
            { Message: 'No workflow tasks found', OperationalResultType: 3 },
        ],
        ResultData: {
            WorkflowId: 'TEST',
            TaskId: 115,
            UserId: 'abdullahi.mahamed',
            WorkflowTaskStatus: null,
        },
    };

    return data.ResultData;
};
