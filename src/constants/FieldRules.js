  
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
    .string().required().max(3),
  Incoterms2: yup    
    .string().max(28)
    .required(),
  TaxClassification: yup    
    .string().max(1)
    .required(),
  CustomerClass: yup      
    .string().required().max(2),
  IndustryCode5: yup        
    .string().notRequired().max(10),
  Industry: yup    
    .string().max(4)
    .required(),
  CompanyCode: yup        
    .string().max(4).required(),
  ReconAccount: yup    
    .string().max(10)
    .required(),
  SalesOffice: yup
    .string().max(4)
    .required(),
  PPCustProc: yup
    .string().required().max(2),
  AdditionalNotes: yup.string(),
  CustPricProc: yup
    .string().required().max(1),
  DeliveryPriority: yup
    .string()
    .required().max(2),
  ShippingConditions: yup
    .string().max(2).required(),
  AcctAssgmtGroup: yup
    .string().required().max(2),
  AccountType: yup
    .string().required().max(3),
  ShippingCustomerType: yup
    .string().required().max(3),
  SortKey: yup
    .string().required().max(3),
  PaymentMethods: yup
   .string().required().max(10),
  AcctgClerk: yup
    .string().required().max(2),
  AccountStatement: yup
    .string().required().max(1),
  CustomerGroup: yup
    .string().required().max(2),
  PriceList: yup
    .string().required().max(2),
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