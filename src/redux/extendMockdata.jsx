export const fetchExtendData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            MdmMappings: [
                {
                    System: 'MDM',
                    Role: ' ',
                    SystemAccountNo: '11111',
                    GlobalIndicator: ' ',
                },
                {
                    System: 'SAP APOLLO',
                    Role: 'SOLD TO ',
                    SystemAccountNo: '22222',
                    GlobalIndicator: 'X',
                },
                {
                    System: 'SAP APOLLO',
                    Role: 'SOLD TO',
                    SystemAccountNo: '33333',
                    GlobalIndicator: 'X',
                },
            ],
        })
    );
};

export const fetchSystemData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            SystemFields: [
                {
                    SystemAccountNo: '11111',
                    System: 'MDM',
                    Role: ' R1 ',
                    SoldTo: ' S1 ',
                    SalesOrg: ' Salesorg1 ',
                    PurposeOfRequest: ' P1 ',
                },
                {
                    SystemAccountNo: '22222',
                    System: 'SAP APPO',
                    Role: ' R2 ',
                    SoldTo: ' S2 ',
                    SalesOrg: ' Salesorg2 ',
                    PurposeOfRequest: ' P2 ',
                },
                {
                    SystemAccountNo: '33333',
                    System: 'MDM',
                    Role: ' R3 ',
                    SoldTo: ' S3 ',
                    SalesOrg: ' Salesorg3 ',
                    PurposeOfRequest: ' P3 ',
                },
            ],
        })
    );
};

export const fetchCustomerMasterData = () => {
    return new Promise((resolve, reject) =>
        resolve({
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
        })
    );
};
