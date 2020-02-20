export const fetchCustomerMasterDropDownData = () => {
    return new Promise((resolve, reject) =>
        resolve({
            AccountTypeId: [
                { id:1, description:'DTR' },
                { id:2, description:'INT' },
                { id:3, description:'IDV' },
                { id:4, description:'NRD' },
                { id:5, description:'SDT' },
                { id:6, description:'IEX' },
                { id:7, description:'OEM' },
                { id:8, description:'KTR' }
            ],
            CustomerGroupTypeId:[
                { id:1,value:1, description:'Rbtd Dist - CAH' },
                { id:2,value:2, description:'Affiliates' },
                { id:3,value:3, description:'Alternate Site' },
                { id:4,value:4, description:'Biomed Repair' },
                { id:5,value:5, description:'Non Rbtd Distributor/Self Distributor' },
                { id:6,value:6, description:'Hospital' },
                { id:7,value:8, description:'Internal' },
                { id:8,value:9, description:'Intl Dealer/ Exporter' },
                { id:9,value:10, description:'OEM/Kitter' },
                { id:10,value:12, description:'Rbtd Dist - Non CAH' },
                { id:11,value:14, description:'Third Party End User' }
            ],
            CustomerPriceProcTypeId:[
                { id:1,value:3, description:'Affiliate' },
                { id:2,value:'G', description:'MPT Gov pric proc' },
                { id:3,value:1,description:'Standard' }
            ],
            PriceListTypeId:[
                { id:1,value:'A1', description:'Intercompany' },
                { id:2,value:'VA', description:'Government (VA)' },
                { id:3,value:'GV', description:'Government (Non VA)' },
                { id:4,value:'DM', description:'Domestic (US, non-government)' },
                { id:5,value:'IN', description:'International' }, 
            ],
            CustomerClassTypeId:[
                { id:1, description:'Dept of Defense' },
                { id:2, description:'Public Health Services' },
                { id:3, description:'General Services Admin' },
                { id:4, description:'Veterans Admin' },
                { id:5, description:'State/Local' },
                { id:6, description:'Non Government' }
            ],
            IndustryCodeTypeId:[
                { id:1, value:'0001',description:'Contract Manufacturing' },
                { id:2, value:'0002',description:'Internal/ICO' },
                { id:3, value:'0003',description:'GE/Armstrong' },
                { id:4, value:'0004',description:'Distributor' },
            ],
            IndustryTypeId: [
                { id:1, description:'Acute' },
                { id:2, description:'Non Acute' },
            ],
            ReconAccountTypeId: [
                { id:1,value:'12100', description:'Customer/Trade Account' },
                { id:2,value:'12900', description:'Intercompany' },
            ],
            SalesOfficeTypeId: [
                { id:1, value:"2100",description:'Direct' },
                { id:2, value:"2120", description:'Sales Reps' },
                { id:3, value:"2140", description:'International' },
                { id:4, value:"2200", description:'Government' },
                { id:5, value:"3500", description:'Distributors' },
                { id:6, value:"3700", description:'OEM/Kitters' }
            ],
            PpcustProcTypeId: [
                { id:1, value:"A", description:'Product Proposal' },
                { id:2, value:"B", description:'Cross Selling' },
            ],
            CompanyCodeTypeId: [
                { id:1, description:'0120' },
                { id:2, description:'0150' },
            ],
            DeliveryPriorityTypeId: [
                { id:1, value:"30", description:'Domestic Direct, Sales Rep, Trace,Government' },
                { id:2, value:"35", description:'Distributors' },
                { id:3, value:"40", description:'Canada and Mexico' },
                { id:4, value:"45", description:'International, Puerto Rico' },
            ],
            ShippingConditionsTypeId: [
                { id:1, description:'DM' },
                { id:2, description:'EX' },
            ],
            Incoterms1TypeId: [
                { id:1, description:'COL' },
                { id:2, description:'CP2' },
                { id:3, description:'CPT' },
                { id:4, description:'DAP' },
                { id:5, description:'DDP' },
                { id:6, description:'DPA' },
                { id:7, description:'EXW' },
                { id:8, description:'FCA' },
                { id:9, description:'PPA' },
                { id:10, description:'PPD' }
            ],
            AcctAssignmentGroupTypeId: [
                { id:1, value:"01",description:'Domestic' },
                { id:2, value:"02",description:'International' },
                { id:3, value:"ZA",description:'InterCompany' }
            ],
            PartnerFunctionTypeId: [
                { id:1, description:'BP' },
                { id:2, description:'PY' },
                { id:3, description:'SH' },
                { id:4, description:'Y0' },
                { id:5, description:'YO' },
                { id:6, description:'YL' },
                { id:7, description:'YS' },
            ],
            ShippingCustomerTypeId: [
                { id:1, description:'DIR' },
                { id:2, description:'DIS' },
                { id:3, description:'INT' },
                { id:4, description:'OEM' },
            ]
        })
    );
};  