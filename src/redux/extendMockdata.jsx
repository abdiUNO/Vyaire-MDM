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
