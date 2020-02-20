  
import * as yup from 'yup'; 
import * as Moment from 'moment';
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
  display_LN: yup.bool().notRequired(),  
  License: yup.string().when('display_LN',{
      is:true,
      then: yup.string().required().max(20),
      otherwise: yup.string().notRequired()
    }),
    LicenseExpDate:yup.string().when('display_LN',{
    is:true,
    then: yup.string().required(),
    otherwise: yup.string().notRequired()
  }),
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
  TransporationZone: yup
    .string().max(10)    
    .required(),
  TaxNumber2: yup    
    .number()
    .typeError('TaxNumber2 must be a `number` type'),    
  TaxClassification: yup    
    .string().max(1)
    .required(),
  SortKey: yup
    .string().required().max(3),
  PaymentMethods: yup
   .string().required().max(10),
  AcctgClerk: yup
    .string().required().max(2),
  AccountStatement: yup
    .string().required().max(1),  
  OrderCombination:yup
    .bool().required().oneOf([true,false]),
  PaymentHistoryRecord: yup
    .bool().required().oneOf([true,false]),
  AdditionalNotes: yup.string(),
  displayINCOT2: yup.bool().notRequired(),  
  Incoterms2: yup    
    .string().when('displayINCOT2',{
      is:true,
      then: yup.string().required().max(28),
      otherwise: yup.string().notRequired()
    }),
  RejectionButton: yup.bool(),
  RejectionReason:yup
    .string().when('RejectionButton',{
      is:true,
      then:yup.string().required(),
      otherwise:yup.string().notRequired()
    }),
  AccountTypeId: yup.number().required(),  
  CustomerGroupTypeId: yup.number().required(),
  CustomerPriceProcTypeId: yup.number().required(),
  PriceListTypeId: yup.number().required(),
  CustomerClassTypeId: yup.number().required(),
  IndustryCodeTypeId: yup.number().notRequired(),
  IndustryTypeId: yup.number().required(),
  ReconAccountTypeId: yup.number().required(),
  SalesOfficeTypeId: yup.number().required(),
  PpcustProcTypeId: yup.number().required(),
  CompanyCodeTypeId: yup.number().required(),
  DeliveryPriorityTypeId: yup.number().required(),
  ShippingConditionsTypeId: yup.number().required(),
  Incoterms1TypeId: yup.number().required(),
  AcctAssignmentGroupTypeId: yup.number().required(),
  PartnerFunctionTypeId: yup.number().required(),
  ShippingCustomerTypeId: yup.number().required(),

});

export const mytaskContractsRules= yup.object().shape({
  
  RejectionButton: yup.bool(),
  RejectionReason:yup
    .string().when('RejectionButton',{
      is:true,
      then:yup.string().required(),
      otherwise:yup.string().notRequired()
    }),
  AccountTypeId: yup.number().required(),  
  CustomerGroupTypeId: yup.number().required(),
  Incoterms1TypeId: yup.number().required(),
  PaymentTermsTypeId: yup.number().required(), 

});
