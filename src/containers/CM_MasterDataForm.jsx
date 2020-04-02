import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StyleSheet,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Column, Card, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';
import {
    resolveDependencies,
    passFields,
    yupFieldValidation,
} from '../constants/utils';
import {
    yupglobalMDMFieldRules,
    mytaskCustomerMasterRules,
} from '../constants/FieldRules';
import {
    getCustomerDetail,
    getCustomerFromSAP,
} from '../appRedux/actions/Customer';

import GlobalMdmFields from '../components/GlobalMdmFields';
import SystemFields from '../components/SystemFields';
import { CheckBoxItem } from '../components/CheckBoxItem';
import DynamicSelect from '../components/DynamicSelect';
import { connect } from 'react-redux';
import { fetchCustomerMasterDropDownData } from '../redux/DropDownDatas';
import Loading from '../components/Loading';
import FlashMessage from '../components/FlashMessage';
import { ajaxGetRequest } from '../appRedux/sagas/config';

const _ = require('lodash');

const initFormdData = {
    SystemTypeId: 1,
};
class Page extends React.Component {
    constructor(props) {
        super(props);
        const editableProp = {
            inline: false,
            variant: 'solid',
            onChange: this.onFieldChange,
        };
        this.state = {
            system: '',
            role: '',
            dropDownDatas: {},
            teamsNewUpdates:{},
            pricing:[],
            customermaster:[],
            credit:[],
            contracts:[],
            globaltrade:[],
            formData: {                
                displayINCOT2: false,
                display_LN: false,
                isContractsField:false,
            },
            formErrors: {},
            inputPropsForDefaultRules: { CustomerGroupTypeId: editableProp },
        };
    }

    
    generateWorkflowId() {
        const url =
            'https://jakegvwu5e.execute-api.us-east-2.amazonaws.com/dev';

        ajaxGetRequest(url).then(res => {
            if (res.IsSuccess)
                this.setState({
                    fetchingWorkflowId: false,
                    formData: {
                        ...initFormdData,
                        ...this.state.formData,
                        WorkflowId: res.ResultData,
                        UserId: this.state.userId,
                    },
                });
        });
    }


    componentDidMount() {      
        
        fetchCustomerMasterDropDownData().then(res => {
            const data = res;
            this.setState({ dropDownDatas: data }, this.generateWorkflowId);
        });
        const {state}= this.props.location
        var jsonBody=state.sysFieldsData
        // var jsonBody={
        //     "WorkflowId": "",
        //     "CustomerNumber": "0000497070",
        //     "DivisionTypeId": 99,
        //     "SystemType": 1,
        //     "DistributionChannelTypeId": 10,
        //     "CompanyCodeTypeId": "120",
        //     "SalesOrgTypeId": 2
        //    }
        //this.props.getCustomerFromSAP(jsonBody);
        this.validateFromSourceData(state.globalMdmDetail)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.bapi70CustData != this.props.bapi70CustData) {
            this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        ...newProps.bapi70CustData,
                    },
                },
            );
        }
        
      
    }

    formatDeltaObj=() => {
        let functionElements=[] , teams=['pricing','customermaster','contract','credit','globaltrade']
        for(var i=0;i<teams.length;i++){
            let team=teams[i]
            if(this.state[team].length > 0 ){
                let functionalDelta={};
                functionalDelta['functionName']=team
                functionalDelta['customerElements']=this.state[team]
                functionElements.push(functionalDelta)
            }
        }
    }

    onFieldChange = (value, e) => {
        const { name } = e.target;
        console.log('e',e);
        var team=e.target.getAttribute('team')
        console.log('t',team);
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value,
                },
                teamsNewUpdates:{
                    ...this.state.teamsNewUpdates,
                    [name]:{
                            'team':team,
                            'newValue':value
                        }
                },                
            },
            () => {
                console.log('tu',this.state)
                if (
                    name === 'CustomerClassTypeId' ||
                    name === 'Incoterms1TypeId' ||
                    name === 'CustomerGroupTypeId'
                ) {
                    this.validateRules(name, value);
                }
            }
        )
        

        let origdata=this.props.bapi70CustData;
        if(origdata[name]!=value)
        {
            let newDeltaValue={
                'name':name,
                'originalValue':origdata[name],
                'updatedValue':value

            }
            this.setState(state=>{
                const list = [...state[team],newDeltaValue];
                return {
                    ...this.state,
                    [team]:list
                }
            },()=>console.log('tupp',this.state))

                
        }

    };

    setFormErrors = (isValid, key, errors) => {
        const { formErrors } = this.state;
        if (!isValid) {
            this.setState({ formErrors: { ...formErrors, [key]: errors } });
        } else {
            this.setState({ formErrors: { ...formErrors, [key]: null } });
        }
    };

    setFormDataValues = (name, value) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value,
            },
        });
    };

    setInputPropsForDefaultRules = (field_name, property) => {
        this.setState({
            inputPropsForDefaultRules: {
                ...this.state.inputPropsForDefaultRules,
                [field_name]: property,
            },
        });
    };
    // display or set input/dropdowns values based on rules
    validateRules = (stateKey, stateVal) => {
        const readOnlyInputprop = { inline: true, variant: 'outline' };
        const editInputProp = {
            inline: false,
            variant: 'solid',
            onChange: this.onFieldChange,
        };
        const readOnlyDropDown = { disabled: true };
        // check for CustomerPriceProcTypeId
        if (stateKey === 'CustomerClassTypeId') {
            var CC_val = stateVal;
            if (['1', '2', '3', '4', '5'].includes(CC_val)) {
                this.setFormDataValues('CustomerPriceProcTypeId', 2);
                this.setInputPropsForDefaultRules(
                    'CustomerPriceProcTypeId',
                    readOnlyDropDown
                );
            } else {
                this.setFormDataValues('CustomerPriceProcTypeId', '');
                this.setInputPropsForDefaultRules('CustomerPriceProcTypeId', {
                    disabled: false,
                });
            }
        }
        // check for incoterms2
        if (stateKey === 'Incoterms1TypeId') {
            var INCOT1_val = stateVal;
            if (INCOT1_val === '1') {
                this.setFormDataValues('displayINCOT2', true);
            } else {
                this.setFormDataValues('displayINCOT2', false);
            }
        }
        // check for AccountTypeId
        if (stateKey === 'CustomerGroupTypeId') {
            var cg_val = stateVal;
            const readOnlyDropDown = { disabled: true };
            if (cg_val === '1' || cg_val === '10') {
                this.setFormDataValues('AccountTypeId', '1');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (cg_val === '2' || cg_val === '7') {
                this.setFormDataValues('AccountTypeId', '2');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (
                cg_val === '3' ||
                cg_val === '4' ||
                cg_val === '6' ||
                cg_val === '11'
            ) {
                this.setFormDataValues('AccountTypeId', '3');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (cg_val === '8') {
                this.setFormDataValues('AccountTypeId', '6');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else {
                this.setFormDataValues('AccountTypeId', '');
                this.setInputPropsForDefaultRules('AccountTypeId', {
                    disabled: false,
                });
            }
        }
    };

    validateFromSourceData = source_data => {
        const readOnlyDropDown = { disabled: true };
        const newStateValue = {},
            newStyleProps = {};
        //check License Number
        let d_LN_RegionsList = [
            'DE',
            'FL',
            'GA',
            'HI',
            'IL',
            'IN',
            'KS',
            'MA',
            'ME',
            'MN',
            'NC',
            'ND',
            'NE',
            'NM',
            'OH',
            'OK',
            'RI',
            'SD',
            'VT',
            'WA',
            'WV',
        ];
        if (
            source_data.RoleTypeId === 1 ||
            source_data.RoleTypeId === 2 ||
            source_data.RoleTypeId === 5 ||
            source_data.RoleTypeId === 6
        ) {
            newStateValue['display_LN'] = true;
            if (source_data.RoleTypeId === 5) {
                newStateValue['License'] = 'R-SALES REP EXEMPT';
                newStateValue['LicenseExpDate'] = '9999-12-31';
            } else if (source_data.Country != 'US') {
                newStateValue['License'] = 'I-INTERNATIONAL EXEMPT';
                newStateValue['LicenseExpDate'] = '9999-12-31';
            } else if (d_LN_RegionsList.includes(source_data.Region)) {
                newStateValue['License'] = 'S-IN STATE EXEMPT APPROVAL SM';
                newStateValue['LicenseExpDate'] = '9999-12-31';
            }
        }
        //check transportation zone
        let d_TransporationZone_RegionList = [
            'NS',
            'NT',
            'NU',
            'PE',
            'SK',
            'YT',
        ];
        if (source_data.Country === 'US' || source_data.Country === 'PR') {
            newStateValue[
                'TransporationZone'
            ] = source_data.PostalCode.substring(0, 3);
        } else if (
            source_data.Country === 'CA' &&
            d_TransporationZone_RegionList.includes(source_data.Region)
        ) {
            newStateValue['TransporationZone'] = 'INTL';
        } else if (source_data.Country === 'CA') {
            newStateValue['TransporationZone'] = source_data.Region;
        } else {
            newStateValue['TransporationZone'] = 'INTL';
        }

        //check price list
        if (source_data.Country != 'US') {
            newStateValue['PriceListTypeId'] = '5';
            newStyleProps['PriceListTypeId'] = readOnlyDropDown;
        } else {
            newStateValue['PriceListTypeId'] = '';
            newStyleProps['PriceListTypeId'] = { disabled: false };
        }

        //check Customer group
        let categoryTypeid = parseInt(source_data.CategoryTypeId);
        if (source_data.CategoryTypeId != undefined) {            
            if (categoryTypeid === 2) {
                //if self-distributor
                newStateValue['CustomerGroupTypeId'] = '5';
                newStyleProps['CustomerGroupTypeId'] = readOnlyDropDown;
            } else if (categoryTypeid === 3 || categoryTypeid === 6) {
                //if oem or kitter
                newStateValue['CustomerGroupTypeId'] = '9';
                newStyleProps['CustomerGroupTypeId'] = readOnlyDropDown;
            } else if (categoryTypeid === 7) {
                // if dropship
                newStateValue['AccountTypeId'] = '3';
                newStyleProps['AccountTypeId'] = readOnlyDropDown;
                newStateValue['CustomerGroupTypeId'] = '11';
                newStyleProps['CustomerGroupTypeId'] = readOnlyDropDown;
            }
        }
        //check shipping conditions
        if (source_data.Country != 'US') {
            newStateValue['ShippingConditionsTypeId'] = '2';
            newStyleProps['ShippingConditionsTypeId'] = readOnlyDropDown;
        } else {
            newStateValue['ShippingConditionsTypeId'] = '1';
            newStyleProps['ShippingConditionsTypeId'] = readOnlyDropDown;
        }

        //check if Category = Distributor, OEM, Kitter, Self-Distributor then Contract else Customermaster
        if (categoryTypeid === 1 || categoryTypeid === 2 || categoryTypeid === 3 || categoryTypeid === 6) {
            newStateValue['isContractsField'] = true;
        }
       
        
            
        this.setState({
            formData: {
                ...this.state.formData,
                ...newStateValue,
            },
            inputPropsForDefaultRules: {
                ...this.state.inputPropsForDefaultRules,
                ...newStyleProps,
            },
        });
    };

    render() {
        const { width, height, marginBottom, location ,alert} = this.props;
        const { dropDownDatas, inputPropsForDefaultRules } = this.state;
        const {state}= location ; 

        let disp_payterms = false;
        if (this.state && this.state.formData.Category != undefined) {
            var source_category = this.state.formData.Category.toLowerCase();
            if (
                source_category === 'direct' ||
                source_category === 'dropship' ||
                source_category === 'other'
            ) {
                disp_payterms = true;
            }
        }
        var bgcolor = alert.color || '#FFF';
        if (this.props.fetching) {
            return <Loading />;
        }

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                { alert.display && (
                    <FlashMessage
                        bg={{ backgroundColor: bgcolor }}
                        message={ alert.message}
                    />
                )}
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
                                name="Title"
                                variant="outline"
                                type="text"
                                value={this.state.formData.Title  || '' }
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="WorkflowId"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={this.state.formData.WorkflowId  || '' }
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="MdmNumber"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={state.MdmNumber || '' }
                            />
                        </Box>

                        <GlobalMdmFields
                            formData={state.globalMdmDetail}
                            readOnly
                        />

                        <React.Fragment key="customer-master">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                CUSTOMER MASTER FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Transportation Zone"
                                        name="TransporationZone"
                                        team="customermaster"
                                        readOnly
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TransporationZone'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        value={this.state.formData['TransporationZone']}
                                        variant="outline"
                                        inline
                                    />
                                       
                                    <FormInput
                                        label="Search Term 1"
                                        name="SearchTerm1"
                                        variant="solid"
                                        team="customermaster"
                                        maxLength={20}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SearchTerm1'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SearchTerm1'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Search Term 2"
                                        name="SearchTerm2"
                                        maxLength={20}
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SearchTerm2'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SearchTerm2'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Partner Function Number"
                                        name="PartnerFunctionNumber"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PartnerFunctionNumber'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PartnerFunctionNumber'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Tax Number 2"
                                        name="TaxNumber2"
                                        maxLength={11}
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'TaxNumber2'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TaxNumber2'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Sort Key"
                                        name="SortKey"
                                        team="customermaster"
                                        maxLength={3}
                                        defaultValue="099"
                                        value={
                                            this.state.formData
                                                ? this.state.formData['SortKey']
                                                : null
                                        }
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SortKey'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Payment Methods"
                                        name="PaymentMethods"
                                        team="customermaster"
                                        maxLength={10}
                                        defaultValue="C"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PaymentMethods'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PaymentMethods'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Acctg Clerk"
                                        name="AcctgClerk"
                                        team="customermaster"
                                        maxLength={2}
                                        defaultValue="01"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AcctgClerk'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AcctgClerk'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Account Statement"
                                        name="AccountStatement"
                                        team="customermaster"
                                        maxLength={1}
                                        defaultValue="2"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AccountStatement'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AccountStatement'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />

                                    <FormInput
                                        label="Tax Classification"
                                        name="TaxClassification"
                                        defaultValue="1"
                                        maxLength={1}
                                        team="customermaster"
                                        variant="solid"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'TaxClassification'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TaxClassification'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />
                                </Box>
                            </Box>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CustomerClassTypeId
                                        }
                                        label="Customer Class "
                                        name="CustomerClassTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CustomerClassTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerClassTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CustomerPriceProcTypeId
                                        }
                                        label="CustPricProc "
                                        name="CustomerPriceProcTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CustomerPriceProcTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerPriceProcTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'CustomerPriceProcTypeId'
                                            ]
                                        }
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.IndustryCodeTypeId
                                        }
                                        label="IndustryCode 5"
                                        name="IndustryCodeTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'IndustryCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={false}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IndustryCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.IndustryTypeId
                                        }
                                        label="Industry"
                                        name="IndustryTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'IndustryTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IndustryTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.ReconAccountTypeId
                                        }
                                        label="Recon Account"
                                        name="ReconAccountTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'ReconAccountTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ReconAccountTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.SalesOfficeTypeId
                                        }
                                        label="Sales Office"
                                        name="SalesOfficeTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SalesOfficeTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SalesOfficeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                {!this.state.isContractsField && 
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CustomerGroupTypeId
                                        }
                                        label="Customer Group"
                                        name="CustomerGroupTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CustomerGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'CustomerGroupTypeId'
                                            ]
                                        }
                                    />
                                }
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.PpcustProcTypeId
                                        }
                                        label="PP Cust Proc"
                                        name="PpcustProcTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PpcustProcTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PpcustProcTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.PriceListTypeId
                                        }
                                        label="Price List"
                                        name="PriceListTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PriceListTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PriceListTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'PriceListTypeId'
                                            ]
                                        }
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CompanyCodeTypeId
                                        }
                                        label="Company Code"
                                        name="CompanyCodeTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CompanyCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CompanyCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.DeliveryPriorityTypeId
                                        }
                                        label="Delivery Priority"
                                        name="DeliveryPriorityTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'DeliveryPriorityTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DeliveryPriorityTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.ShippingConditionsTypeId
                                        }
                                        label="Shipping Conditions"
                                        name="ShippingConditionsTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'ShippingConditionsTypeId'
                                            ]
                                        }
                                    /> 
                                    {!this.state.isContractsField && 
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.Incoterms1TypeId
                                        }
                                        label="Incoterms 1"
                                        name="Incoterms1TypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'Incoterms1TypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'Incoterms1TypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    }
                                    {this.state.formData['displayINCOT2'] ? (
                                        <FormInput
                                            team="customermaster"
                                            label="Incoterms 2"
                                            name="Incoterms2"
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'Incoterms2'
                                                      ]
                                                    : null
                                            }
                                            variant="solid"
                                            onChange={this.onFieldChange}
                                            error={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'Incoterms2'
                                                      ]
                                                    : null
                                            }
                                            type="text"
                                            required
                                        />
                                    ) : null}
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.AcctAssignmentGroupTypeId
                                        }
                                        label="Acct Assgmt Group"
                                        name="AcctAssignmentGroupTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AcctAssignmentGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AcctAssignmentGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.PartnerFunctionTypeId
                                        }
                                        label="Partner Function"
                                        name="PartnerFunctionTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PartnerFunctionTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PartnerFunctionTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                               {!this.state.isContractsField && 
                                    
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.AccountTypeId
                                        }
                                        label="Account Type"
                                        name="AccountTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AccountTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AccountTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'AccountTypeId'
                                            ]
                                        }
                                    />
                                    }
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.ShippingCustomerTypeId
                                        }
                                        label="Shipping Customer Type"
                                        name="ShippingCustomerTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'ShippingCustomerTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ShippingCustomerTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <CheckBoxItem
                                        team="customermaster"
                                        title="Order Combination"
                                        name="OrderCombination"
                                        stateValue={
                                            this.state.formData.OrderCombination
                                        }
                                        onValueChange={() =>
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    OrderCombination: !this
                                                        .state.formData
                                                        .OrderCombination,
                                                },
                                            })
                                        }
                                    />
                                    <CheckBoxItem
                                        team="customermaster"
                                        title="Payment History Record"
                                        name="PaymentHistoryRecord"
                                        stateValue={
                                            this.state.formData
                                                .PaymentHistoryRecord
                                        }
                                        onValueChange={() =>
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    PaymentHistoryRecord: !this
                                                        .state.formData
                                                        .PaymentHistoryRecord,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                        <React.Fragment key="credit">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px"> 
                                CREDIT FIELDS 
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {!this.state.isContractsField && (
                                        <DynamicSelect
                                            arrayOfData={
                                                dropDownDatas.PaymentTermsTypeId
                                            }
                                            label="Payment Terms"
                                            name="PaymentTermsTypeId"
                                            team='credit'
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'PaymentTermsTypeId'
                                                      ]
                                                    : null
                                            }
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'PaymentTermsTypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                        />
                                    )}
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.riskCategoryTypeId
                                        }
                                        label="Risk Category"
                                        team='credit'
                                        name="RiskCategoryTypeId"
                                        value={
                                            this.state.formData &&
                                            (this.state.formData[
                                                'RiskCategoryTypeId'
                                            ] ||
                                                this.state.formData[
                                                    'RiskCategoryTypeId'
                                                ])
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'RiskCategoryTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.creditRepGroupTypeId
                                        }
                                        label="Credit Rep Group"
                                        team='credit'
                                        name="CreditRepGroupTypeId"
                                        value={
                                            this.state.formData &&
                                            (this.state.formData[
                                                'CreditRepGroupTypeId'
                                            ] ||
                                                this.state.formData[
                                                    'CreditRepGroupTypeId'
                                                ])
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CreditRepGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Credit Limit"
                                        team='credit'
                                        name="CreditLimit"
                                        value={
                                            this.state.formData[
                                                'CreditLimit'
                                            ] ||
                                            this.state.formData['CreditLimit']
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CreditLimit'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        variant="solid"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Cred Info Number"
                                        name="CredInfoNumber"
                                        team='credit'
                                        value={
                                            this.state.formData[
                                                'CredInfoNumber'
                                            ]
                                        }
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Payment Index"
                                        name="PaymentIndex"
                                        team='credit'
                                        value={
                                            this.state.formData[
                                                'PaymentIndex'
                                            ] ||
                                            this.state.formData['PaymentIndex']
                                        }
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Last Ext Review"
                                        name="LastExtReview"
                                        team='credit'
                                        value={
                                            this.state.formData['LastExtReview']
                                        }
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Rating"
                                        name="Rating"
                                        team='credit'
                                        value={this.state.formData['Rating']}
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                        <React.Fragment key="Contact Info">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                    CONTACT FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="First Name"
                                        name="ContactFirstName"
                                        team='credit'
                                        variant="solid"
                                        value={
                                            this.state.formData.ContactFirstName
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactFirstName'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="ContactLastName"
                                        team='credit'
                                        variant="solid"
                                        value={
                                            this.state.formData.ContactLastName
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactLastName'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Telephone"
                                        name="ContactTelephone"
                                        team='credit'
                                        value={
                                            this.state.formData
                                                .ContactTelephone ||
                                            this.state.formData.ContactPhone
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactTelephone'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Fax"
                                        name="ContactFax"
                                        team='credit'
                                        value={this.state.formData.ContactFax}
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactFax'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Email"
                                        name="ContactEmail"
                                        team='credit'
                                        value={this.state.formData.ContactEmail}
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactEmail'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                    {this.state.isContractsField && 
                        <React.Fragment key="contract">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px"> 
                                CONTRACT FIELDS 
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.IncoTermsTypeId
                                        }
                                        label="Incoterms 1"
                                        name="IncoTermsTypeId"
                                        team="contracts"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IncoTermsTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            this.state.formData &&
                                            this.state.formData[
                                                    'IncoTermsTypeId'
                                                ]
                                         }
                                    />
                                
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.CustomerGroupTypeId
                                        }
                                        label="Customer Group"
                                        name="CustomerGroupTypeId"
                                        team="contracts"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={this.state.formData[ 'CustomerGroupTypeId' ]}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'CustomerGroupTypeId'
                                            ]
                                        }
                                    />
                                
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.PaymentTermsTypeId
                                        }
                                        label="Payment Terms"
                                        name="PaymentTermsTypeId"
                                        team="contracts"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PaymentTermsTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={this.state.formData[
                                                      'PaymentTermsTypeId'
                                                  ]}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'PaymentTermsTypeId'
                                            ]
                                        }
                                        
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.AccountTypeId
                                        }
                                        label="Account Type"
                                        name="AccountTypeId"
                                        team="contracts"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AccountTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={this.state.formData[
                                                      'AccountTypeId'
                                                  ]}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'AccountTypeId'
                                            ]
                                        }
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                        }

                        <React.Fragment key="Pricing">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                    PRICING FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.SpecialPricingTypeId
                                        }
                                        label="Special Pricing"
                                        name="SpecialPricingTypeId"
                                        team='pricing'
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SpecialPricingTypeId'
                                                  ]
                                                : null
                                        }
                                        value={this.state.formErrors[ 'SpecialPricingTypeId' ]}
                                        onFieldChange={this.onFieldChange}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.DistLevelTypeId
                                        }
                                        label="Dist Level Pricing"
                                        name="DistLevelTypeId"
                                        team='pricing'
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DistLevelTypeId'
                                                  ]
                                                : null
                                        }
                                        value={this.state.formErrors[ 'DistLevelTypeId' ]}
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center"/>
                                     
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
    const { bapi70CustData, fetching, alert } = customer;
    return { bapi70CustData, fetching, alert };
};

export default connect(mapStateToProps, {
    getCustomerDetail,
    getCustomerFromSAP,
})(Default);

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
