export const fetchCustomerMasterDropDownData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            RoleTypeId: [
                {
                    id: 1,
                    value: 'SAP Apollo: Sold To (0001)',
                    description: 'SAP Apollo: Sold To (0001)',
                },
                {
                    id: 2,
                    value: 'SAP Apollo: Ship To (0001)',
                    description: 'SAP Apollo: Ship To (0001)',
                },
                {
                    id: 3,
                    value: 'SAP Apollo: Payer (0003)',
                    description: 'SAP Apollo: Payer (0003)',
                },
                {
                    id: 4,
                    value: 'SAP Apollo: Bill To (0004)',
                    description: 'SAP Apollo: Bill To (0004)',
                },
                {
                    id: 5,
                    value: 'SAP Apollo: Sales Rep (0001)',
                    description: 'SAP Apollo: Sales Rep (0001)',
                },
                {
                    id: 6,
                    value: 'SAP Apollo: Drop Ship (0001)',
                    description: 'SAP Apollo: Drop Ship (0001)',
                },
                {
                    id: 7,
                    value: 'SAP Olympus: Sold To',
                    description: 'SAP Olympus: Sold To',
                },
                {
                    id: 8,
                    value: 'SAP Olympus: Ship To',
                    description: 'SAP Olympus: Ship To',
                },
                {
                    id: 9,
                    value: 'SAP Olympus: Payer',
                    description: 'SAP Olympus: Payer',
                },
                {
                    id: 10,
                    value: 'SAP Olympus: Bill To',
                    description: 'SAP Olympus: Bill To',
                },
                {
                    id: 11,
                    value: 'SAP Olympus: Sales Rep',
                    description: 'SAP Olympus: Sales Rep',
                },
                {
                    id: 12,
                    value: 'Pointman: Sold To',
                    description: 'Pointman: Sold To',
                },
                {
                    id: 13,
                    value: 'Pointman: Ship To',
                    description: 'Pointman: Ship To',
                },
                {
                    id: 14,
                    value: 'Pointman: Sales Rep',
                    description: 'Pointman: Sales Rep',
                },
                {
                    id: 15,
                    value: 'Made2Manage: Sold To',
                    description: 'Made2Manage: Sold To',
                },
                {
                    id: 16,
                    value: 'Made2Manage: Ship To',
                    description: 'Made2Manage: Ship To',
                },
                {
                    id: 17,
                    value: 'Made2Manage: Sales Rep',
                    description: 'Made2Manage: Sales Rep',
                },
                {
                    id: 18,
                    value: 'JD Edwards: Sold To',
                    description: 'JD Edwards: Sold To',
                },
                {
                    id: 19,
                    value: 'JD Edwards: Ship To',
                    description: 'JD Edwards: Ship To',
                },
                {
                    id: 20,
                    value: 'JD Edwards: Sales Rep',
                    description: 'JD Edwards: Sales Rep',
                },
            ],
            CategoryTypeId: [
                { id: 1, description: 'Distributor' },
                { id: 2, description: 'Self-Distributor' },
                { id: 3, description: 'OEM' },
                { id: 4, description: 'Direct' },
                { id: 5, description: 'Internal' },
                { id: 6, description: 'Kitter' },
            ],
            AccountTypeId: [
                { id: 1, description: 'DTR' },
                { id: 2, description: 'INT' },
                { id: 3, description: 'IDV' },
                { id: 4, description: 'NRD' },
                { id: 5, description: 'SDT' },
                { id: 6, description: 'IEX' },
                { id: 7, description: 'OEM' },
                { id: 8, description: 'KTR' },
            ],
            CustomerGroupTypeId: [
                { id: 1, value: 1, description: 'Rbtd Dist - CAH' },
                { id: 2, value: 2, description: 'Affiliates' },
                { id: 3, value: 3, description: 'Alternate Site' },
                { id: 4, value: 4, description: 'Biomed Repair' },
                {
                    id: 5,
                    value: 5,
                    description: 'Non Rbtd Distributor/Self Distributor',
                },
                { id: 6, value: 6, description: 'Hospital' },
                { id: 7, value: 8, description: 'Internal' },
                { id: 8, value: 9, description: 'Intl Dealer/ Exporter' },
                { id: 9, value: 10, description: 'OEM/Kitter' },
                { id: 10, value: 12, description: 'Rbtd Dist - Non CAH' },
                { id: 11, value: 14, description: 'Third Party End User' },
            ],
            CustomerPriceProcTypeId: [
                { id: 1, value: 3, description: 'Affiliate' },
                { id: 2, value: 'G', description: 'MPT Gov pric proc' },
                { id: 3, value: 1, description: 'Standard' },
            ],
            PriceListTypeId: [
                { id: 1, value: 'A1', description: 'Intercompany' },
                { id: 2, value: 'VA', description: 'Government (VA)' },
                { id: 3, value: 'GV', description: 'Government (Non VA)' },
                {
                    id: 4,
                    value: 'DM',
                    description: 'Domestic (US, non-government)',
                },
                { id: 5, value: 'IN', description: 'International' },
            ],
            CustomerClassTypeId: [
                { id: 1, description: 'Dept of Defense' },
                { id: 2, description: 'Public Health Services' },
                { id: 3, description: 'General Services Admin' },
                { id: 4, description: 'Veterans Admin' },
                { id: 5, description: 'State/Local' },
                { id: 6, description: 'Non Government' },
            ],
            IndustryCodeTypeId: [
                { id: 1, value: '0001', description: 'Contract Manufacturing' },
                { id: 2, value: '0002', description: 'Internal/ICO' },
                { id: 3, value: '0003', description: 'GE/Armstrong' },
                { id: 4, value: '0004', description: 'Distributor' },
            ],
            IndustryTypeId: [
                { id: 1, description: 'Acute' },
                { id: 2, description: 'Non Acute' },
            ],
            ReconAccountTypeId: [
                {
                    id: 1,
                    value: '12100',
                    description: 'Customer/Trade Account',
                },
                { id: 2, value: '12900', description: 'Intercompany' },
            ],
            SalesOfficeTypeId: [
                { id: 1, value: '2100', description: 'Direct' },
                { id: 2, value: '2120', description: 'Sales Reps' },
                { id: 3, value: '2140', description: 'International' },
                { id: 4, value: '2200', description: 'Government' },
                { id: 5, value: '3500', description: 'Distributors' },
                { id: 6, value: '3700', description: 'OEM/Kitters' },
            ],
            PpcustProcTypeId: [
                { id: 1, value: 'A', description: 'Product Proposal' },
                { id: 2, value: 'B', description: 'Cross Selling' },
            ],
            CompanyCodeTypeId: [
                { id: 1, description: '0120' },
                { id: 2, description: '0150' },
            ],
            DeliveryPriorityTypeId: [
                {
                    id: 1,
                    value: '30',
                    description: 'Domestic Direct, Sales Rep, Trace,Government',
                },
                { id: 2, value: '35', description: 'Distributors' },
                { id: 3, value: '40', description: 'Canada and Mexico' },
                {
                    id: 4,
                    value: '45',
                    description: 'International, Puerto Rico',
                },
            ],
            ShippingConditionsTypeId: [
                { id: 1, description: 'DM' },
                { id: 2, description: 'EX' },
            ],
            Incoterms1TypeId: [
                { id: 1, description: 'COL' },
                { id: 2, description: 'CP2' },
                { id: 3, description: 'CPT' },
                { id: 4, description: 'DAP' },
                { id: 5, description: 'DDP' },
                { id: 6, description: 'DPA' },
                { id: 7, description: 'EXW' },
                { id: 8, description: 'FCA' },
                { id: 9, description: 'PPA' },
                { id: 10, description: 'PPD' },
            ],
            AcctAssignmentGroupTypeId: [
                { id: 1, value: '01', description: 'Domestic' },
                { id: 2, value: '02', description: 'International' },
                { id: 3, value: 'ZA', description: 'InterCompany' },
            ],
            PartnerFunctionTypeId: [
                { id: 1, description: 'BP' },
                { id: 2, description: 'PY' },
                { id: 3, description: 'SH' },
                { id: 4, description: 'Y0' },
                { id: 5, description: 'YO' },
                { id: 6, description: 'YL' },
                { id: 7, description: 'YS' },
            ],
            ShippingCustomerTypeId: [
                { id: 1, description: 'DIR' },
                { id: 2, description: 'DIS' },
                { id: 3, description: 'INT' },
                { id: 4, description: 'OEM' },
            ],
            IncoTermsTypeId: [
                { id: 1, description: 'COL' },
                { id: 2, description: 'CP2' },
                { id: 3, description: 'CPT' },
                { id: 4, description: 'DAP' },
                { id: 5, description: 'DDP' },
                { id: 6, description: 'DPA' },
                { id: 7, description: 'EXW' },
                { id: 8, description: 'FCA' },
                { id: 9, description: 'PPA' },
                { id: 10, description: 'PPD' },
            ],
            PaymentTermsTypeId: [
                { id: 1, value: 'Z000', description: 'Payable Immediately' },
                {
                    id: 2,
                    value: 'Z001',
                    description: 'Net 15 Days from invoice date',
                },
                {
                    id: 3,
                    value: 'Z002',
                    description: 'Net 30 Days from invoice date',
                },
                {
                    id: 4,
                    value: 'Z003',
                    description: 'Net 45 Days from invoice date',
                },
                {
                    id: 5,
                    value: 'Z004',
                    description: 'Net 60 Days from invoice date',
                },
                {
                    id: 6,
                    value: 'Z005',
                    description: 'Net 75 Days from invoice date',
                },
                {
                    id: 7,
                    value: 'Z006',
                    description: 'Net 90 Days from invoice date',
                },
                {
                    id: 8,
                    value: 'Z007',
                    description: 'Net 120 Days from invoice date',
                },
                {
                    id: 9,
                    value: 'Z008',
                    description: 'Net 180 Days from invoice date',
                },
                {
                    id: 10,
                    value: 'Z012',
                    description: 'Net 7 Days from invoice date',
                },
                {
                    id: 11,
                    value: 'Z020',
                    description: '1% discount within 15 days,net 30 days',
                },
                {
                    id: 12,
                    value: 'Z021',
                    description: '1% discount within 20 days,net 30 days',
                },
                {
                    id: 13,
                    value: 'Z022',
                    description: '1% discount within 30 days,net 31 days',
                },
                {
                    id: 14,
                    value: 'Z026',
                    description: '2% in 20 Days,Net 30 Days',
                },
                {
                    id: 15,
                    value: 'Z030',
                    description: '2% discount within 15 days,net 30 days',
                },
                {
                    id: 16,
                    value: 'Z032',
                    description: '1% discount within 10 days,net 30 days',
                },
                {
                    id: 17,
                    value: 'Z051',
                    description: 'Letter of Credit at 30 days',
                },
                {
                    id: 18,
                    value: 'Z052',
                    description: 'Letter of Credit at 60 Days',
                },
                {
                    id: 19,
                    value: 'Z053',
                    description: 'Letter of Credit at 90 Days',
                },
                { id: 20, value: 'Z058', description: 'Cash in advance' },
                { id: 21, value: 'Z060', description: 'Credit Card' },
                {
                    id: 22,
                    value: 'Z070',
                    description: '2% discount within 30 days,net 45 days',
                },
                {
                    id: 23,
                    value: 'Z080',
                    description: '.5% in 10 Days,Net 30 Days',
                },
                {
                    id: 24,
                    value: 'Z086',
                    description: '10 Days from Date of Invoice',
                },
                {
                    id: 25,
                    value: 'Z087',
                    description: '20 Days from Date of Invoice',
                },
                {
                    id: 26,
                    value: 'Z106',
                    description: '1.5% discount within 15 days,net 30 days',
                },
            ],
            riskCategoryTypeId: [
                { id: 1, description: '001' },
                { id: 2, description: '002' },
                { id: 3, description: '006' },
                { id: 4, description: '009' },
                { id: 5, description: 'Z01' },
                { id: 6, description: 'Z02' },
                { id: 7, description: 'Z06' },
                { id: 8, description: 'Z09' },
            ],
            creditRepGroupTypeId: [
                { id: 1, description: '001' },
                { id: 2, description: '003' },
                { id: 3, description: '004' },
                { id: 4, description: '005' },
                { id: 5, description: '008' },
                { id: 6, description: '009' },
                { id: 7, description: '013' },
                { id: 8, description: '018' },
                { id: 9, description: '019' },
                { id: 10, description: '020' },
                { id: 11, description: '021' },
                { id: 12, description: '022' },
                { id: 13, description: '023' },
                { id: 14, description: '024' },
                { id: 15, description: '025' },
                { id: 16, description: '026' },
                { id: 17, description: '027' },
                { id: 18, description: '028' },
                { id: 19, description: '029' },
                { id: 20, description: '030' },
                { id: 21, description: '031' },
                { id: 22, description: '099' },
            ],
            SpecialPricingTypeId: [
                { id: 1, description: 'S12' },
                { id: 2, description: 'S14' },
                { id: 3, description: 'S16' },
                { id: 4, description: 'S5' },
                { id: 5, description: 'S7' },
                { id: 6, description: 'S8' },
            ],
            DistLevelTypeId: [
                { id: 1, description: 'D1' },
                { id: 2, description: 'D2' },
                { id: 3, description: 'F1' },
                { id: 4, description: 'L1' },
                { id: 5, description: 'L2' },
            ],
        })
    );
};

export const fetchCreateCustomerDropDownData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            RoleTypeId: [
                {
                    id: 1,
                    systemId: 1,
                    value: 'SAP Apollo: Sold To (0001)',
                    description: 'Sold To (0001)',
                },
                {
                    id: 2,
                    systemId: 1,
                    value: 'SAP Apollo: Ship To (0001)',
                    description: 'Ship To (0001)',
                },
                {
                    id: 3,
                    systemId: 1,
                    value: 'SAP Apollo: Payer (0003)',
                    description: 'Payer (0003)',
                },
                {
                    id: 4,
                    systemId: 1,
                    value: 'SAP Apollo: Bill To (0004)',
                    description: 'Bill To (0004)',
                },
                {
                    id: 5,
                    systemId: 1,
                    value: 'SAP Apollo: Sales Rep (0001)',
                    description: 'Sales Rep (0001)',
                },
                {
                    id: 6,
                    systemId: 1,
                    value: 'SAP Apollo: Drop Ship (0001)',
                    description: 'Drop Ship (0001)',
                },
                {
                    id: 7,
                    systemId: 2,
                    value: 'SAP Olympus: Sold To',
                    description: 'SAP Olympus: Sold To',
                },
                {
                    id: 8,
                    systemId: 2,
                    value: 'SAP Olympus: Ship To',
                    description: 'SAP Olympus: Ship To',
                },
                {
                    id: 9,
                    systemId: 2,
                    value: 'SAP Olympus: Payer',
                    description: 'SAP Olympus: Payer',
                },
                {
                    id: 10,
                    systemId: 2,
                    value: 'SAP Olympus: Bill To',
                    description: 'SAP Olympus: Bill To',
                },
                {
                    id: 11,
                    systemId: 2,
                    value: 'SAP Olympus: Sales Rep',
                    description: 'SAP Olympus: Sales Rep',
                },
                {
                    id: 12,
                    systemId: 3,
                    value: 'Pointman: Sold To',
                    description: 'Pointman: Sold To',
                },
                {
                    id: 13,
                    systemId: 3,
                    value: 'Pointman: Ship To',
                    description: 'Pointman: Ship To',
                },
                {
                    id: 14,
                    systemId: 3,
                    value: 'Pointman: Sales Rep',
                    description: 'Pointman: Sales Rep',
                },
                {
                    id: 15,
                    systemId: 4,
                    value: 'Made2Manage: Sold To',
                    description: 'Made2Manage: Sold To',
                },
                {
                    id: 16,
                    systemId: 4,
                    value: 'Made2Manage: Ship To',
                    description: 'Made2Manage: Ship To',
                },
                {
                    id: 17,
                    systemId: 4,
                    value: 'Made2Manage: Sales Rep',
                    description: 'Made2Manage: Sales Rep',
                },
                {
                    id: 18,
                    systemId: 5,
                    value: 'JD Edwards: Sold To',
                    description: 'JD Edwards: Sold To',
                },
                {
                    id: 19,
                    systemId: 5,
                    value: 'JD Edwards: Ship To',
                    description: 'JD Edwards: Ship To',
                },
                {
                    id: 20,
                    systemId: 5,
                    value: 'JD Edwards: Sales Rep',
                    description: 'JD Edwards: Sales Rep',
                },
            ],
            CompanyCodeTypeId: [
                { id: 1, systemId: 1, description: '0120' },
                { id: 2, systemId: 1, description: '0150' },
            ],
            DistributionChannelType: [
                {
                    id: 1,
                    systemId: 1,
                    description: '10',
                },
            ],
            DivisionType: [
                {
                    id: 1,
                    systemId: 1,
                    description: '99',
                },
            ],
        })
    );
};

export const fetchContractsDropDownData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            AccountTypeId: [
                { id: 1, description: 'DTR' },
                { id: 2, description: 'INT' },
                { id: 3, description: 'IDV' },
                { id: 4, description: 'NRD' },
                { id: 5, description: 'SDT' },
                { id: 6, description: 'IEX' },
                { id: 7, description: 'OEM' },
                { id: 8, description: 'KTR' },
            ],
            CustomerGroupTypeId: [
                { id: 1, value: 1, description: 'Rbtd Dist - CAH' },
                { id: 2, value: 2, description: 'Affiliates' },
                { id: 3, value: 3, description: 'Alternate Site' },
                { id: 4, value: 4, description: 'Biomed Repair' },
                {
                    id: 5,
                    value: 5,
                    description: 'Non Rbtd Distributor/Self Distributor',
                },
                { id: 6, value: 6, description: 'Hospital' },
                { id: 7, value: 8, description: 'Internal' },
                { id: 8, value: 9, description: 'Intl Dealer/ Exporter' },
                { id: 9, value: 10, description: 'OEM/Kitter' },
                { id: 10, value: 12, description: 'Rbtd Dist - Non CAH' },
                { id: 11, value: 14, description: 'Third Party End User' },
            ],
            IncoTermsTypeId: [
                { id: 1, description: 'COL' },
                { id: 2, description: 'CP2' },
                { id: 3, description: 'CPT' },
                { id: 4, description: 'DAP' },
                { id: 5, description: 'DDP' },
                { id: 6, description: 'DPA' },
                { id: 7, description: 'EXW' },
                { id: 8, description: 'FCA' },
                { id: 9, description: 'PPA' },
                { id: 10, description: 'PPD' },
            ],
            PaymentTermsTypeId: [
                { id: 1, value: 'Z000', description: 'Payable Immediately' },
                {
                    id: 2,
                    value: 'Z001',
                    description: 'Net 15 Days from invoice date',
                },
                {
                    id: 3,
                    value: 'Z002',
                    description: 'Net 30 Days from invoice date',
                },
                {
                    id: 4,
                    value: 'Z003',
                    description: 'Net 45 Days from invoice date',
                },
                {
                    id: 5,
                    value: 'Z004',
                    description: 'Net 60 Days from invoice date',
                },
                {
                    id: 6,
                    value: 'Z005',
                    description: 'Net 75 Days from invoice date',
                },
                {
                    id: 7,
                    value: 'Z006',
                    description: 'Net 90 Days from invoice date',
                },
                {
                    id: 8,
                    value: 'Z007',
                    description: 'Net 120 Days from invoice date',
                },
                {
                    id: 9,
                    value: 'Z008',
                    description: 'Net 180 Days from invoice date',
                },
                {
                    id: 10,
                    value: 'Z012',
                    description: 'Net 7 Days from invoice date',
                },
                {
                    id: 11,
                    value: 'Z020',
                    description: '1% discount within 15 days,net 30 days',
                },
                {
                    id: 12,
                    value: 'Z021',
                    description: '1% discount within 20 days,net 30 days',
                },
                {
                    id: 13,
                    value: 'Z022',
                    description: '1% discount within 30 days,net 31 days',
                },
                {
                    id: 14,
                    value: 'Z026',
                    description: '2% in 20 Days,Net 30 Days',
                },
                {
                    id: 15,
                    value: 'Z030',
                    description: '2% discount within 15 days,net 30 days',
                },
                {
                    id: 16,
                    value: 'Z032',
                    description: '1% discount within 10 days,net 30 days',
                },
                {
                    id: 17,
                    value: 'Z051',
                    description: 'Letter of Credit at 30 days',
                },
                {
                    id: 18,
                    value: 'Z052',
                    description: 'Letter of Credit at 60 Days',
                },
                {
                    id: 19,
                    value: 'Z053',
                    description: 'Letter of Credit at 90 Days',
                },
                { id: 20, value: 'Z058', description: 'Cash in advance' },
                { id: 21, value: 'Z060', description: 'Credit Card' },
                {
                    id: 22,
                    value: 'Z070',
                    description: '2% discount within 30 days,net 45 days',
                },
                {
                    id: 23,
                    value: 'Z080',
                    description: '.5% in 10 Days,Net 30 Days',
                },
                {
                    id: 24,
                    value: 'Z086',
                    description: '10 Days from Date of Invoice',
                },
                {
                    id: 25,
                    value: 'Z087',
                    description: '20 Days from Date of Invoice',
                },
                {
                    id: 26,
                    value: 'Z106',
                    description: '1.5% discount within 15 days,net 30 days',
                },
            ],
        })
    );
};

export const fetchCreditDropDownData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            PaymentTermsTypeId: [
                { id: 1, value: 'Z000', description: 'Payable Immediately' },
                {
                    id: 2,
                    value: 'Z001',
                    description: 'Net 15 Days from invoice date',
                },
                {
                    id: 3,
                    value: 'Z002',
                    description: 'Net 30 Days from invoice date',
                },
                {
                    id: 4,
                    value: 'Z003',
                    description: 'Net 45 Days from invoice date',
                },
                {
                    id: 5,
                    value: 'Z004',
                    description: 'Net 60 Days from invoice date',
                },
                {
                    id: 6,
                    value: 'Z005',
                    description: 'Net 75 Days from invoice date',
                },
                {
                    id: 7,
                    value: 'Z006',
                    description: 'Net 90 Days from invoice date',
                },
                {
                    id: 8,
                    value: 'Z007',
                    description: 'Net 120 Days from invoice date',
                },
                {
                    id: 9,
                    value: 'Z008',
                    description: 'Net 180 Days from invoice date',
                },
                {
                    id: 10,
                    value: 'Z012',
                    description: 'Net 7 Days from invoice date',
                },
                {
                    id: 11,
                    value: 'Z020',
                    description: '1% discount within 15 days,net 30 days',
                },
                {
                    id: 12,
                    value: 'Z021',
                    description: '1% discount within 20 days,net 30 days',
                },
                {
                    id: 13,
                    value: 'Z022',
                    description: '1% discount within 30 days,net 31 days',
                },
                {
                    id: 14,
                    value: 'Z026',
                    description: '2% in 20 Days,Net 30 Days',
                },
                {
                    id: 15,
                    value: 'Z030',
                    description: '2% discount within 15 days,net 30 days',
                },
                {
                    id: 16,
                    value: 'Z032',
                    description: '1% discount within 10 days,net 30 days',
                },
                {
                    id: 17,
                    value: 'Z051',
                    description: 'Letter of Credit at 30 days',
                },
                {
                    id: 18,
                    value: 'Z052',
                    description: 'Letter of Credit at 60 Days',
                },
                {
                    id: 19,
                    value: 'Z053',
                    description: 'Letter of Credit at 90 Days',
                },
                { id: 20, value: 'Z058', description: 'Cash in advance' },
                { id: 21, value: 'Z060', description: 'Credit Card' },
                {
                    id: 22,
                    value: 'Z070',
                    description: '2% discount within 30 days,net 45 days',
                },
                {
                    id: 23,
                    value: 'Z080',
                    description: '.5% in 10 Days,Net 30 Days',
                },
                {
                    id: 24,
                    value: 'Z086',
                    description: '10 Days from Date of Invoice',
                },
                {
                    id: 25,
                    value: 'Z087',
                    description: '20 Days from Date of Invoice',
                },
                {
                    id: 26,
                    value: 'Z106',
                    description: '1.5% discount within 15 days,net 30 days',
                },
            ],
            riskCategoryTypeId: [
                { id: 1, description: '001' },
                { id: 2, description: '002' },
                { id: 3, description: '006' },
                { id: 4, description: '009' },
                { id: 5, description: 'Z01' },
                { id: 6, description: 'Z02' },
                { id: 7, description: 'Z06' },
                { id: 8, description: 'Z09' },
            ],
            creditRepGroupTypeId: [
                { id: 1, description: '001' },
                { id: 2, description: '003' },
                { id: 3, description: '004' },
                { id: 4, description: '005' },
                { id: 5, description: '008' },
                { id: 6, description: '009' },
                { id: 7, description: '013' },
                { id: 8, description: '018' },
                { id: 9, description: '019' },
                { id: 10, description: '020' },
                { id: 11, description: '021' },
                { id: 12, description: '022' },
                { id: 13, description: '023' },
                { id: 14, description: '024' },
                { id: 15, description: '025' },
                { id: 16, description: '026' },
                { id: 17, description: '027' },
                { id: 18, description: '028' },
                { id: 19, description: '029' },
                { id: 20, description: '030' },
                { id: 21, description: '031' },
                { id: 22, description: '099' },
            ],
        })
    );
};

export const fetchPricingDropDownData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            SpecialPricingTypeId: [
                { id: 1, description: 'S12' },
                { id: 2, description: 'S14' },
                { id: 3, description: 'S16' },
                { id: 4, description: 'S5' },
                { id: 5, description: 'S7' },
                { id: 6, description: 'S8' },
            ],
            DistLevelTypeId: [
                { id: 1, description: 'D1' },
                { id: 2, description: 'D2' },
                { id: 3, description: 'F1' },
                { id: 4, description: 'L1' },
                { id: 5, description: 'L2' },
            ],
        })
    );
};
