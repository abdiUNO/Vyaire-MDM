export const customerMasterUrldomain =
    'https://cors-anywhere.herokuapp.com/https://oaa4qq34j6.execute-api.us-east-2.amazonaws.com/dev';
export const headerParams = {
    Authorization: localStorage.getItem('accessToken'),
};

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
                },
            ],
        });
    });

export const fetchWorkFlows = () => {
    return new Promise(resolve =>
        resolve({
            OperationName: 'GetUserTasks',
            IsSuccess: true,
            OperationResultMessages: [],
            ResultData: [
                {
                    RequestorUserId: 'customerservice.user',
                    RequestorId: 4,
                    WorkflowType: 1,
                    WorkflowStateType: 1,
                    WorkflowId: 'wf001',
                    WorkflowCreatedDateTime: '2020-01-22T06:32:04Z',
                    WorkflowOperation: null,
                    WorkflowTasks: [
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 3,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 1,
                            WorkflowId: 'wf001',
                        },
                    ],
                    WorkflowCustomerGlobalModel: {
                        Id: 2,
                        WorkflowId: 'wf001',
                        MdmCustomerId: null,
                        SystemRecordId: null,
                        Title: 'My Title',
                        Name1: 'my name1',
                        Name2: null,
                        Name3: null,
                        Name4: null,
                        Street: 'my street 1',
                        Street2: null,
                        City: 'mycity',
                        Region: 'IL',
                        PostalCode: '60035',
                        Country: 'usa',
                        VatRegNo: '23sdf',
                        Telephone: '2222222222',
                        Fax: '4444444444',
                        Email: 'e@e.com',
                        TaxNumber: '234sdf',
                        DunsNumber: '234ser',
                        NaicsCode: '234er',
                        SicCode4: '123er',
                        SicCode6: '1234',
                        SicCode8: '123sa',
                        Purpose: 'purp',
                        CategoryTypeId: 1,
                        SoldToNumber: null,
                        RoleTypeId: 1,
                        SalesOrgTypeId: 1,
                        SystemTypeId: 1,
                        EffectiveDate: '2020-01-27T00:00:00',
                        CreatedOn: '2020-01-27T22:09:14Z',
                        ModifiedOn: '2020-01-27T22:09:14Z',
                    },
                    Role: 'SAP Apollo: Sold To (0001)',
                    SystemName: 'SAP Apollo',
                },
                {
                    RequestorUserId: 'customerservice.user',
                    RequestorId: 3,
                    WorkflowType: 4,
                    WorkflowStateType: 1,
                    WorkflowId: 'wf002',
                    WorkflowCreatedDateTime: '2020-01-22T08:32:04Z',
                    WorkflowOperation: null,
                    WorkflowTasks: [
                        {
                            WorkflowTaskType: 1,
                            WorkflowTaskStateType: 3,
                            WorkflowTeamType: 1,
                            WorkflowTaskContextType: 1,
                            WorkTaskflowOperation: 3,
                            WorkflowTaskNote: null,
                            TaskId: 2,
                            WorkflowId: 'wf002',
                        },
                    ],
                    WorkflowCustomerGlobalModel: {
                        Id: 58,
                        WorkflowId: 'wf002',
                        MdmCustomerId: null,
                        SystemRecordId: null,
                        Title: '1My Title',
                        Name1: '1FirstName LastName1',
                        Name2: null,
                        Name3: null,
                        Name4: null,
                        Street: '123 test1',
                        Street2: null,
                        City: 'City1',
                        Region: '1Region',
                        PostalCode: '90210',
                        Country: 'USA',
                        VatRegNo: '123test',
                        Telephone: '7737772244',
                        Fax: null,
                        Email: null,
                        TaxNumber: null,
                        DunsNumber: '12341',
                        NaicsCode: null,
                        SicCode4: null,
                        SicCode6: null,
                        SicCode8: null,
                        Purpose: null,
                        CategoryTypeId: 1,
                        SoldToNumber: null,
                        RoleTypeId: 1,
                        SalesOrgTypeId: 1,
                        SystemTypeId: 1,
                        EffectiveDate: '2020-01-28T20:38:55',
                        CreatedOn: '2020-01-29T02:39:08Z',
                        ModifiedOn: '2020-01-29T05:14:58Z',
                    },
                    Role: 'SAP Apollo: Sold To (0001)',
                    SystemName: 'SAP Apollo',
                },
            ],
        })
    );
    // return fetch(
    //     'https://cors-anywhere.herokuapp.com/https://33p9kiusdk.execute-api.us-east-2.amazonaws.com/dev',
    //     {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             WorkflowTask: {
    //                 RequestorUserId: 'customerservice.user',
    //                 WorkflowTaskOperation: 3,
    //             },
    //         }),
    //     }
    // ).then(res => res.json());
};
