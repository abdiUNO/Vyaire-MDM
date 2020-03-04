import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StyleSheet
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Column, Card, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';
import { resolveDependencies, passFields ,yupFieldValidation} from '../constants/utils';
import {yupglobalMDMFieldRules,mytaskCustomerMasterRules } from '../constants/FieldRules';
import { getCustomerDetail,getCustomerFromSAP } from '../appRedux/actions/Customer';

import GlobalMdmFields from '../components/GlobalMdmFields';
import SystemFields from '../components/SystemFields';
import {CheckBoxItem} from '../components/CheckBoxItem';
import DynamicSelect from '../components/DynamicSelect';
import { connect } from 'react-redux';
import {fetchCustomerMasterDropDownData } from '../redux/DropDownDatas';
import Loading from '../components/Loading';
import FlashMessage from '../components/FlashMessage';

const _ = require('lodash');
const getApollo = {
    system: 'sap-apollo',
    role: {
        label: 'Role',
        values: [
            'Sold To (0001)',
            'Ship To (0001)',
            'Payer (0003)',
            'Bill To (0004)',
            'Sales Rep (0001)',
            'Drop Ship (0001)',
        ],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: 2 }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    salesOrg: {
        label: 'Sales Org',
        display: 'block',
    },
};

const getPTMN = {
    system: 'pointman',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: 2 }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 3 }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 3 }],
        },
    },
};

const getM2M = {
    system: 'made2manage',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: true,
    },
    costCenter: {
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    subCostCenter: {
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            oneOf: [{ role: 1 }, { role: 2 }],
        },
    },
    salesOrg: {
        label: 'Sales Org',
        display: 'none',
    },
};

const getOlympus = {
    system: 'sap-olympus',
    role: {
        label: 'Role',
        values: ['Sold To', 'Ship To', 'Payer', 'Bill To', 'Sales Rep'],
        required: true,
    },
    costCenter: {
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    subCostCenter: {
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            oneOf: [{ role: 1 }, { role: 2 }, { role: 3 }],
        },
    },
    salesOrg: {
        label: 'Sales Org',
        values: [
            '0001 Sales Org',
            '0500 Vyaire AUS',
            '0524 Vyaire China',
            '0525 Vyaire Japan',
            '0700 Vyaire UK 306 Dom',
            '0720 Vyaire Germany',
            '0730 Vyaire Sweden',
            '0735 Vyaire Norway',
            '0736 Vyaire Finland',
            '0737 Vyaire Denmark',
            '0745 Vyaire Spain',
            '0750 Vyaire France',
            '0755 Vyaire Nth',
            '0760 Vyaire Italy',
            '0785 SDC',
            '0789 NDC Nijmegen',
            '0790 Vyaire Switzerland',
        ],
        display: 'none',
    },
};

class Page extends React.Component {
    constructor(props) {
        super(props);
        const editableProp={inline: false,
            variant:'solid',
            onChange:this.onFieldChange
            }
        console.log('propsbapi',this.props.bapi70CustData);
        this.state = {
            system: '',
            role: '',
            formSchema: passFields(getPTMN, {}),

            loading: this.props.fetching ,          
            dropDownDatas:{},
            CM_Data:this.props.bapi70CustData,
            
            formData: {
                'creditLimit':1,
                'OrderCombination':false,
                'PaymentHistoryRecord':false,
                'RejectionButton':false,
                'displayINCOT2':false,
                'display_LN':false},            
            formErrors: {},
            inputPropsForDefaultRules:{'CustomerGroupTypeId':editableProp}          
        };
    }
    
    
    componentDidMount() {
        this.props.getCustomerFromSAP('002491624');
        console.log('hey')
        fetchCustomerMasterDropDownData().then(res => {
                const data = res;
                this.setState({dropDownDatas:data})
            });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.bapi70CustData != this.props.bapi70CustData) {
            // this.validateFromSourceData(newProps.singleCustomerDetail)
            console.log('bapibapi');
            this.setState({
                CM_Data: newProps.bapi70CustData,
            });            
        }
        if (newProps.fetching != this.props.fetching) {
            this.setState({
                loading: newProps.fetching,
            });            
        }
        if (newProps.alert != this.props.alert) {
            this.setState({
                alert: newProps.alert,
            });            
        }

    }

    updateSchema = () => {
        let system = this.state.formData.system;
        var objects = [
            passFields(getPTMN, this.state.formData),
            passFields(getM2M, this.state.formData),
            passFields(getApollo, this.state.formData),
            passFields(getOlympus, this.state.formData),
        ];

        const formSchema = _.filter(
            objects,
            _.conforms({
                system(n) {
                    return n === system;
                },
            })
        )[0];

        console.log(formSchema);

        this.setState({
            formSchema,
        });
    };

    onFieldChange = (value, e) => {
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value,
                },
            },
            () => {
                if (this.state.formData.system) this.updateSchema();
            }
        );
    };

    render() {
        const { width, height, marginBottom, location } = this.props;
        const {CM_Data,dropDownDatas,inputPropsForDefaultRules}=this.state;
        let disp_payterms=false;
        if(this.state && this.state.CM_Data &&  this.state.CM_Data.Category!=undefined){
            var source_category=CM_Data.Category.toLowerCase();
            if(source_category==='direct'||source_category==='dropship'||source_category==='other'){
                disp_payterms=true;
            }
        }
        console.log('cm',CM_Data)

        if(this.state.loading){
            return <Loading/>
        }    
       

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <Box fullHeight my={2}>
                        <Box
                            flexDirection="row"
                            justifyContent="space-around"
                            my={4}
                            alignItems="center">
                            <FormInput
                                padding="8px 25px 0px 25px"
                                style={{ lineHeight: '2', paddingBottom: 0 }}
                                flex={1 / 4}
                                mb={2}
                                label="Title"
                                name="title"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                            />
                        </Box>

                        <GlobalMdmFields formData={CM_Data} onFieldChange={this.onFieldChange} />
                       
                        <React.Fragment key='customer-master'>
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                {this.props.title ? this.props.title : 'CUSTOMER MASTER FIELDS'}
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box width={1 / 2} mx="auto" alignItems="center">
                                    
                                {this.state.formData['display_LN'] ?  
                                    <>
                                    <FormInput
                                        required
                                        readOnly
                                        label="License Number"
                                        name="License"
                                        value={this.state.formData ? this.state.formData['License'] : null }
                                        error={this.state.formErrors ? this.state.formErrors['License'] : null }
                                        onChange={this.onFieldChange}
                                        variant="solid"
                                        type="text"
                                    />
                                    <FormInput
                                        label="License Expiration Date"
                                        name="LicenseExpDate"
                                        variant="solid"
                                        value={this.state.formData ? this.state.formData['LicenseExpDate'] : null }
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['LicenseExpDate'] : null }
                                        type="date"
                                        required
                                    />
                                    </>:null
                                }
                                    <FormInput
                                        label="Search Term 1"
                                        name="SearchTerm1"
                                        variant="solid"
                                        error={this.state.formErrors ? this.state.formErrors['SearchTerm1'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Search Term 2"
                                        name="SearchTerm2"
                                        variant="solid"
                                        error={this.state.formErrors ? this.state.formErrors['SearchTerm2'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Distribution Channel"
                                        name="DistributionChannel"
                                        variant="solid"
                                        error={this.state.formErrors ? this.state.formErrors['DistributionChannel'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Division"
                                        name="Division"
                                        variant="solid"
                                        error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Transportation Zone"
                                        name="TransporationZone"
                                        variant="solid"
                                        value={this.state.formData ? this.state.formData['TransporationZone'] : null }
                                        error={this.state.formErrors ? this.state.formErrors['TransporationZone'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Partner Function Number"
                                        name="PartnerFunctionNumber"
                                        variant="solid"
                                        error={this.state.formErrors ? this.state.formErrors['PartnerFunctionNumber'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                </Box>
                                <Box width={1 / 2} mx="auto" alignItems="center">
                                    <FormInput
                                        label="Tax Number 2"
                                        name="TaxNumber2"
                                        variant="solid"
                                        error={this.state.formErrors ? this.state.formErrors['TaxNumber2'] : null }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Sort Key"
                                        name="SortKey"
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['SortKey'] : null }
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Payment Methods"
                                        name="PaymentMethods"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['PaymentMethods'] : null }
                                        variant="solid"
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Acctg Clerk"
                                        name="AcctgClerk"
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['AcctgClerk'] : null }
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Account Statement"
                                        name="AccountStatement"
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['AccountStatement'] : null }
                                        type="text"
                                        required
                                    />
                                    
                                    <FormInput
                                        label="Tax Classification"
                                        name="TaxClassification"
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['TaxClassification'] : null }
                                        type="text"
                                        required
                                    />
                                </Box>
                            </Box>
                            <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.CustomerClassTypeId} 
                                    label='Customer Class ' 
                                    name='CustomerClassTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustomerClassTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.CustomerPriceProcTypeId} 
                                    label='CustPricProc ' 
                                    name='CustomerPriceProcTypeId' 
                                    value={this.state.formData ? this.state.formData['CustomerPriceProcTypeId'] : null}
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustomerPriceProcTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['CustomerPriceProcTypeId']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.IndustryCodeTypeId} 
                                    label='IndustryCode 5' 
                                    name='IndustryCodeTypeId' 
                                    isRequired={false}
                                    formErrors={this.state.formErrors? this.state.formErrors['IndustryCodeTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.IndustryTypeId} 
                                    label='Industry' 
                                    name='IndustryTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['IndustryTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.ReconAccountTypeId} 
                                    label='Recon Account' 
                                    name='ReconAccountTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['ReconAccountTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.SalesOfficeTypeId} 
                                    label='Sales Office' 
                                    name='SalesOfficeTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['SalesOfficeTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.CustomerGroupTypeId} 
                                    label='Customer Group' 
                                    name='CustomerGroupTypeId' 
                                    value={this.state.formData ? this.state.formData['CustomerGroupTypeId'] : null}
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustomerGroupTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['CustomerGroupTypeId']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.PpcustProcTypeId} 
                                    label='PP Cust Proc' 
                                    name='PpcustProcTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PpcustProcTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                
                                
                                <FormInput
                                    label="Additional Notes"
                                    name="AdditionalNotes"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AdditionalNotes'] : null }
                                    multiline
                                    numberOfLines={2}                                    
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['RejectionReason'] : null }
                                        multiline
                                        numberOfLines={2}
                                        variant="solid"
                                        type="text"
                                />
                            
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.PriceListTypeId} 
                                    label='Price List' 
                                    name='PriceListTypeId' 
                                    value={this.state.formData ? this.state.formData['PriceListTypeId'] : null}
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PriceListTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['PriceListTypeId']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.CompanyCodeTypeId} 
                                    label='Company Code' 
                                    name='CompanyCodeTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CompanyCodeTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.DeliveryPriorityTypeId} 
                                    label='Delivery Priority' 
                                    name='DeliveryPriorityTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['DeliveryPriorityTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.ShippingConditionsTypeId} 
                                    label='Shipping Conditions' 
                                    name='ShippingConditionsTypeId' 
                                    isRequired={true}
                                    value={this.state.formData ? this.state.formData['ShippingConditionsTypeId'] : null}
                                    formErrors={this.state.formErrors? this.state.formErrors['ShippingConditionsTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['ShippingConditionsTypeId']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.Incoterms1TypeId} 
                                    label='Incoterms 1' 
                                    name='Incoterms1TypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['Incoterms1TypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                {this.state.formData['displayINCOT2'] ?
                                    <FormInput
                                        label="Incoterms 2"
                                        name="Incoterms2"
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['Incoterms2'] : null }
                                        type="text"
                                        required
                                    /> : null
                                }
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.AcctAssignmentGroupTypeId} 
                                    label='Acct Assgmt Group' 
                                    name='AcctAssignmentGroupTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['AcctAssignmentGroupTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.PartnerFunctionTypeId} 
                                    label='Partner Function' 
                                    name='PartnerFunctionTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PartnerFunctionTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.AccountTypeId} 
                                    label='Account Type' 
                                    name='AccountTypeId' 
                                    isRequired={true}
                                    value={this.state.formData ? this.state.formData['AccountTypeId'] : null}
                                    formErrors={this.state.formErrors? this.state.formErrors['AccountTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['AccountTypeId']}
                                 />                            
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.ShippingCustomerTypeId} 
                                    label='Shipping Customer Type' 
                                    name='ShippingCustomerTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['ShippingCustomerTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />  
                                <CheckBoxItem
                                    title="Order Combination"
                                    name="OrderCombination"
                                    stateValue={this.state.formData.OrderCombination}
                                    onValueChange={() =>
                                        this.setState(
                                            {
                                                formData: {
                                                    ...this.state.formData,
                                                    OrderCombination: !this.state.formData.OrderCombination
                                                }
                                            })
                                        }
                                                                        
                                />
                                <CheckBoxItem
                                    title="Payment History Record"
                                    name="PaymentHistoryRecord"
                                    stateValue={this.state.formData.PaymentHistoryRecord}
                                    onValueChange={() =>
                                        this.setState(
                                            {
                                                formData: {
                                                    ...this.state.formData,
                                                    PaymentHistoryRecord: !this.state.formData.PaymentHistoryRecord
                                                }
                                            })
                                        }
                                />

                                    
                            </Box>
                        </Box>
                        </React.Fragment>     
                        <React.Fragment key='credit'>
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                {this.props.title ? this.props.title : 'CREDIT FIELDS'}
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                {disp_payterms && 
                                    <DynamicSelect 
                                        arrayOfData={dropDownDatas.PaymentTermsTypeId} 
                                        label='Payment Terms' 
                                        name='PaymentTermsTypeId' 
                                        value={this.state.formData ? this.state.formData['PaymentTermsTypeId'] : null}
                                        formErrors={this.state.formErrors? this.state.formErrors['PaymentTermsTypeId'] : null }
                                        onFieldChange={this.onFieldChange}
                                    />
                                }
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.riskCategoryTypeId} 
                                    label='Risk Category' 
                                    name='riskCategoryTypeId' 
                                    formErrors={this.state.formErrors? this.state.formErrors['riskCategoryTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.creditRepGroupTypeId} 
                                    label='Credit Rep Group' 
                                    name='creditRepGroupTypeId' 
                                    formErrors={this.state.formErrors? this.state.formErrors['creditRepGroupTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput    
                                    label="Credit Limit"
                                    name="creditLimit"
                                    value={this.state.formData['creditLimit']}
                                    error={this.state.formErrors ? this.state.formErrors['creditLimit'] : null }
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    type="text"
                                />
                                 <FormInput
                                    label="Cred Info Number"
                                    name="CredInfoNumber"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Payment Index"
                                    name="paymentIndex"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Last Ext Review"
                                    name="LastExtReview"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Rating"
                                    name="Rating"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                
                            </Box>
                            </Box>                        
                        </React.Fragment>    
                        <React.Fragment key='Contact Info'>
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                {this.props.title ? this.props.title : 'CONTACT FIELDS'}
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                            
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput
                                    label="First Name"
                                    name="contactFirstName"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['contactFirstName'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"                                    
                                />
                                <FormInput
                                    label="Last Name"
                                    name="contactLastName"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['contactLastName'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Telephone"
                                    name="contactTelephone"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['contactTelephone'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />                                
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Fax"
                                    name="contactFax"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['contactFax'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Email"
                                    name="contactEmail"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['contactEmail'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                            </Box>
                        </Box>
                        </React.Fragment>        
                        <React.Fragment key='Pricing'>
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                {this.props.title ? this.props.title : 'PRICING FIELDS'}
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                    <DynamicSelect 
                                        arrayOfData={dropDownDatas.SpecialPricingTypeId} 
                                        label='Special Pricing' 
                                        name='SpecialPricingTypeId' 
                                        formErrors={this.state.formErrors? this.state.formErrors['SpecialPricingTypeId'] : null }
                                        onFieldChange={this.onFieldChange}
                                    />
                                
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.DistLevelTypeId} 
                                    label='Dist Level Pricing' 
                                    name='DistLevelTypeId' 
                                    formErrors={this.state.formErrors? this.state.formErrors['DistLevelTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />                          
                                                                 
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput
                                    label="Additional Notes"
                                    multiline
                                    numberOfLines={2}
                                    name="AdditionalNotes"
                                    variant="solid"
                                    type="text"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AdditionalNotes'] : null }
                                />
                                <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['RejectionReason'] : null }
                                        multiline
                                        numberOfLines={2}
                                        variant="solid"
                                        type="text"
                                />
                                
                            </Box>
                        </Box>
                        </React.Fragment>
                    </Box>
                        
                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 65,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 15,
                            marginTop: 20,
                            marginBottom: 10,
                            marginHorizontal: 25,
                        }}>
                        <Button
                            onPress={() => this.props.history.goBack()}
                            title="Cancel"
                        />
                        <Button title="Save As Draft" />

                        <Button
                            onPress={() =>
                                this.props.history.push(
                                    '/customers/create-additional'
                                )
                            }
                            title="Submit"
                        />
                    </Flex>
                </View>
            </ScrollView>
        );
    }
}

class Default extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        return (
            <DimensionAware
                render={dimensions => (
                    <Page
                        {...{
                            ...props,
                            width: getWindowWidth(dimensions),
                            height: getWindowHeight(dimensions),
                            marginBottom: 25,
                        }}
                    />
                )}
            />
        );
    }
}

const mapStateToProps = ({ customer }) => {
    const { bapi70CustData,fetching,alert} = customer;
    return { bapi70CustData,fetching,alert };
};

export default connect(mapStateToProps, { getCustomerDetail,getCustomerFromSAP })(Default);

const styles = StyleSheet.create({
    progressIndicator: {
        flex: 1,
        paddingBottom: 5,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 15,
        color: '#1D4289',	
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 20,
    },
});

