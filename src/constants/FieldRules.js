  
import * as yup from 'yup'; 
import { otherwise } from 'ramda';


export const yupglobalMDMFieldRules = yup.object().shape({
  Name1: yup
    .string()
    .required()
    .min(3),
  Name2: yup
    .string()
    .notRequired(),
  Name3: yup
    .string()
    .notRequired(),
  Name4: yup
    .string()
    .notRequired(),
  Street: yup
    .string()
    .required(),
  Street2: yup
    .string()
    .notRequired(),
  City: yup
    .string()
    .required()
    .max(35),
  Region: yup
    .string()
    .required()
    .max(3),
  PostalCode: yup
    .number()
    .typeError('PostalCode must be a `number` type')
    .required()
    .max(10),  
  Country: yup
    .string()
    .required()
    .max(3),
  Telephone: yup
    .number()
    .typeError('Telephone must be a `number` type')
    .max(16),
  Fax: yup
    .number()
    .typeError('Fax must be a `number` type')
    .max(31),
  Email: yup
    .string()
    .nullable()
    .notRequired()
    .email(),
  Category: yup
    .string()
    .required()
    .oneOf(['distributor',"self-distributor",'oem','kitter',"direct","dropship","other"])
});

    
export const mytaskCustomerMasterRules= yup.object().shape({
  LicenseNumber: yup
    .string().required().max(20),
  LicenseExpiratinDate: yup
    .date()
    .required()
    .min(new Date(1900, 0, 1)),
  SearchTerm1: yup
    .string().max(20),
  SearchTerm2: yup
    .string().max(20),  
  DistributionChannel: yup
    .string().max(2)    
    .required(),
  Division: yup
    .string().max(2)
    .required(),
  TransportationZone: yup
    .string().max(10)    
    .required(),
  TaxNumber2: yup    
    .number()
    .typeError('TaxNumber2 must be a `number` type')
    .max(11),
  Incoterms1: yup    
    .string().required().max(3)
    .oneOf(['COL','CP2','CPT','DAP','DDP','DPA','EXW','FCA','PPA','PPD']),
  Incoterms2: yup    
    .string().max(28)
    .required(),
  TaxClassification: yup    
    .string().max(1)
    .required(),
  CustomerClass: yup      
    .string().required().max(2)
    .oneOf(['01','02','03','04','05','06']),
  IndustryCode5: yup        
    .string().notRequired().max(10)
    .oneOf(['0001','0002','00003','0004']),
  Industry: yup    
    .string().max(4)
    .required()
    .oneOf(['0001','0002']),
  CompanyCode: yup        
    .string().max(4).required()
    .oneOf(['0120','0150']),
  ReconAccount: yup    
    .string().max(10)
    .required()
    .oneOf(['12100','12900']),
  SalesOffice: yup
    .string().max(4)
    .required()    
    .oneOf(['2100','2120','2140','2200','3500','3700']),
  PPCustProc: yup
    .string().required().max(2)
    .oneOf(['A','B']),
  AdditionalNotes: yup.string(),
  CustPricProc: yup
    .string().required().max(1)
    .oneOf(['3','G','1']),
  DeliveryPriority: yup
    .string()
    .required().max(2)
    .oneOf(['30','35','40','45']),
  ShippingConditions: yup
    .string().max(2).required()
    .oneOf(['DM','EX']),
  AcctAssgmtGroup: yup
    .string().required().max(2)
    .oneOf(['01','02','ZA']),
  AccountType: yup
    .string().required().max(3)
    .oneOf(['DTR','INT','IDV','NRD','SDT','IEX','OEM','KTR']),
  ShippingCustomerType: yup
    .string().required().max(3)
    .oneOf(['DIR','DIS','INT','OEM']),
  SortKey: yup
    .string().required().max(3),
  PaymentMethods: yup
   .string().required().max(10),
  AcctgClerk: yup
    .string().required().max(2),
  AccountStatement: yup
    .string().required().max(1),
  CustomerGroup: yup
    .string().required().max(2)
    .oneOf(['01','02','03','04','05','06','08','09','10','12','14']),
  PriceList: yup
    .string().required().max(2)
    .oneOf(['A1','VA','GV','DM','IN']),
  OrderCombination:yup
    .bool().required().oneOf([true,false]),
  PaymentHistoryRecord: yup
    .bool().required().oneOf([true,false]),
  RejectionButton: yup.bool(),
  RejectionReason:yup
    .string().when('RejectionButton',{
      is:true,
      then:yup.string().required(),
      otherwise:yup.string().notRequired()
    }),  

});