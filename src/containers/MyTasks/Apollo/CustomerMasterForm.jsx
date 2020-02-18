import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    CheckBox,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import {
    Flex,
    Column,
    Card,
    Button,
    Box,
    Text,
} from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import GlobalMdmFields from '../../../components/GlobalMdmFields';
import DynamicSelect from '../../../components/DynamicSelect';
import debounce from 'lodash.debounce'
import { resolveDependencies, passFields ,yupFieldValidation} from '../../../constants/utils';
import {yupglobalMDMFieldRules,mytaskCustomerMasterRules } from '../../../constants/FieldRules';
import { getCustomerDetail } from '../../../appRedux/actions/Customer';
import { connect } from 'react-redux';
import {fetchCustomerMasterDropDownData } from '../../../redux/DropDownDatas';

const CheckBoxItem = ({ name,title,onValueChange, stateValue }) => (
    <>
        <Flex
            alignLeft
            style={{
                paddingTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 15,
                marginBottom: 10,
                marginHorizontal: 25,
                maxWidth: '350px',
                width: '100%',
            }}>
            <CheckBox name={name} value={stateValue} onValueChange={onValueChange} />
            <Text
                my={2}
                alignSelf="flex-start"
                fontSize="16px"
                fontWeight="500"
                fontFamily="Poppins"
                backgroundColor="transparent"
                color="#22438a"
                pl={4}>
                {title}
            </Text>
        </Flex>
    </>
);
const waitTime=1;
// CM_Data:{'Role':'soldTo',
//                     'Country':'US',
//                     'Region':'AB',
//                     'PostalCode':'610593',
//                     'Category':'OEdsM'},
class Page extends React.Component {
    
    
    constructor(props) {
        super(props);
        const editableProp={inline: false,
            variant:'solid',
            onChange:this.onFieldChange
            }
        this.state = {
            loading: false,
            dropDownDatas:{},
            CM_Data:this.props.customerdata,
            
            formData: {'OrderCombination':false,
                'PaymentHistoryRecord':false,
                'RejectionButton':false},            
            formErrors: {},
            displayRule:{'displayINCOT2':false,
                            'display_LN':false
                            },
            inputPropsForDefaultRules:{'CustomerGroup':editableProp}

            
        };
    }

    
    componentDidMount() {
        this.props.getCustomerDetail('002491624');
        fetchCustomerMasterDropDownData().then(res => {
                const data = res;
                this.setState({dropDownDatas:data})
            });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.singleCustomerDetail != this.props.singleCustomerDetail) {
            this.validateFromSourceData(newProps.singleCustomerDetail)
            this.setState({
                CM_Data: newProps.singleCustomerDetail,
            });            
        }
    }

    
    setFormErrors = (isValid,key,errors) =>{
        const {formErrors} = this.state;
        if (!isValid) {
              this.setState({formErrors: {...formErrors, [key]: errors}});
            } else {
              this.setState({formErrors: {...formErrors, [key]: null}});
            }
    }

    onFieldChange = ( value,e) => {   
        const {name}=e.target          
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value,
                },
            },
            ()=>{ 
                if(name==='CustomerClass' || name==='Incoterms1' || name==='CustomerGroup')
                { this.validateRules(name,value)  }
            });
        
       
        
    };

    parseAndHandleFieldChange = (value,e)=>{
        const {name}=e.target
        const val=parseInt(value,10)
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: val,
                },
            },
            ()=>{console.log(this.state.formData)});
    }

    setDisplayRule =(d_name, value) => {   
        this.setState(
            {
                displayRule: {
                    ...this.state.displayRule,
                    [d_name]: value
                },
            },
            ()=>{console.log(this.state.displayRule)})
                
    }
    setFormDataValues = (name,value)=>{
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value,
                },
            },
            ()=>{console.log(this.state.formData)});
    }

    setInputPropsForDefaultRules = (field_name,property) => {
        
        this.setState(
            {
                inputPropsForDefaultRules: {
                    ...this.state.inputPropsForDefaultRules,
                    [field_name]: property
                }
            });
        
    }
        // display or set input/dropdowns values based on rules
    validateRules =(stateKey,stateVal) =>
    {   
        const readOnlyInputprop={inline: true,variant:'outline' }
        const editInputProp={inline: false,variant:'solid',onChange:this.onFieldChange}
        const readOnlyDropDown={disabled:true}
        // check for CustPricProc
        if(stateKey==='CustomerClass'){
            var CC_val= stateVal
            if(['1','2','3','4','5'].includes(CC_val)){
                this.setFormDataValues('CustPricProc',2)
                this.setInputPropsForDefaultRules('CustPricProc',readOnlyDropDown)
            }else{
                this.setFormDataValues('CustPricProc','')
                this.setInputPropsForDefaultRules('CustPricProc',{disabled:false})
            }
        }
        // check for incoterms2         
        if(stateKey==='Incoterms1'){
            var INCOT1_val=stateVal
            if(INCOT1_val==='1'){
                this.setDisplayRule('displayINCOT2',true)
            }else{
                this.setDisplayRule('displayINCOT2',false)
            }
        }
        // check for accountType
        if(stateKey==='CustomerGroup'){
            var cg_val=stateVal
            const readOnlyDropDown={disabled:true}
                if(cg_val==='1' || cg_val==='10' )
                { this.setFormDataValues('AccountType','1')
                  this.setInputPropsForDefaultRules('AccountType',readOnlyDropDown)
                }else if(cg_val==='2' || cg_val==='7'){
                    this.setFormDataValues('AccountType','2')
                    this.setInputPropsForDefaultRules('AccountType',readOnlyDropDown)
                }else if(cg_val==='3' || cg_val==='4' || cg_val==='6' || cg_val==='11'){
                    this.setFormDataValues('AccountType','3')
                    this.setInputPropsForDefaultRules('AccountType',readOnlyDropDown)
                }else if(cg_val==='8' ){
                    this.setFormDataValues('AccountType','6')
                    this.setInputPropsForDefaultRules('AccountType',readOnlyDropDown)
                }else{
                    this.setFormDataValues('AccountType','')
                    this.setInputPropsForDefaultRules('AccountType',{disabled:false})
                }
        }
        
    }
    
    validateFromSourceData= (source_data) =>{ 
        const readOnlyDropDown={disabled:true}
        const newStateValue={},newStyleProps={};
        //check License Number 
        let d_LN_RegionsList=['DE','FL','GA','HI','IL','IN','KS','MA','ME','MN','NC','ND','NE','NM','OH','OK','RI','SD','VT','WA','WV'];
        if(['soldTo','shipTo','salesRep','dropShip'].includes(source_data.Role)){
            this.setDisplayRule('display_LN',true);
            if(source_data.Role==='salesRep'){
                newStateValue['LicenseNumber']='R-SALES REP EXEMPT'
                newStateValue['LicenseExpiratinDate']='9999-12-31'
            }else if(source_data.Country!='US'){
                newStateValue['LicenseNumber']='I-INTERNATIONAL EXEMPT'
                newStateValue['LicenseExpiratinDate']='9999-12-31'
            }else if(d_LN_RegionsList.includes(source_data.Region )){
                newStateValue['LicenseNumber']='S-IN STATE EXEMPT APPROVAL SM'
                newStateValue['LicenseExpiratinDate']='9999-12-31'
            }
        }
        //check transportation zone         
        let d_TransportationZone_RegionList=['NS','NT','NU','PE','SK','YT'];
        if(source_data.Country==='US' || source_data.Country==='PR'){  
            newStateValue['TransportationZone']=source_data.PostalCode.substring(0,3) 
        }else if(source_data.Country==='CA' && d_TransportationZone_RegionList.includes(source_data.Region ))
        {   newStateValue['TransportationZone']='INTL'
        }else if(source_data.Country==='CA') {
            newStateValue['TransportationZone']=source_data.Region
        }else{
            newStateValue['TransportationZone']='INTL'
        }

        //check price list 
        if(source_data.Country!='US'){
            newStateValue['PriceList']='5'
            newStyleProps['PriceList']=readOnlyDropDown
        }else{
            newStateValue['PriceList']=''
            newStyleProps['PriceList']={disabled:false}
        }
       

        //check Customer group  
        if(source_data.Category==='Self-Distributor'){
            newStateValue['CustomerGroup']='5'
            newStyleProps['CustomerGroup']=readOnlyDropDown
        }else if(source_data.Category==='OEM' || source_data.Category==='Kitter'){
            newStateValue['CustomerGroup']='9'
            newStyleProps['CustomerGroup']=readOnlyDropDown
        }else if(source_data.Category==='DropShip'){
            newStateValue['AccountType']='3'
            newStyleProps['AccountType']=readOnlyDropDown        
            newStateValue['CustomerGroup']='11'
            newStyleProps['CustomerGroup']=readOnlyDropDown           
        }

         //check shipping conditions
         if(source_data.Country!='US'){
            newStateValue['ShippingConditions']='2'
            newStyleProps['ShippingConditions']=readOnlyDropDown          
        }else{
            newStateValue['ShippingConditions']='1'
            newStyleProps['ShippingConditions']=readOnlyDropDown          
        }

        this.setState({
            formData: {
                ...this.state.formData,
                ...newStateValue
            },
            inputPropsForDefaultRules: {
                ...this.state.inputPropsForDefaultRules,
                ...newStyleProps
            }
        },()=>{console.log(this.state.formData)});

    }

    handleSubmit = (event,action,schema) => {
        if(action==='reject')
        {
            this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        RejectionButton: true,
                    },
                },
                () => {
                    yupFieldValidation(this.state.formData,schema,this.setFormErrors);
                }
                );
        }else{
            yupFieldValidation(this.state.formData,schema,this.setFormErrors);
            console.log(this.state.formData)
        }
        this.setState({
            formErrors:{}
          });
        
        console.log(schema.cast(this.state.formData))
    }
      
    render() {
        const { width, height, marginBottom, location } = this.props;
        const {CM_Data,dropDownDatas,inputPropsForDefaultRules,displayRule}=this.state;
        let barwidth = Dimensions.get('screen').width - 1000;
        let progressval = 40;
             
       
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 60 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <View style={styles.progressIndicator}>
                        <ProgressBarAnimated
                            width={barwidth}
                            value={progressval}
                            backgroundColor="#6CC644"
                            backgroundColorOnComplete="#6CC644"
                        />
                        <Text style={styles.statusText}>Status:</Text>
                    </View>

                    <Box fullHeight my={2}>
                        <Box
                            flexDirection="row"
                            justifyContent="space-around"
                            my={4}>
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Title"
                                name="title"
                                variant="outline"
                                type="text"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                            />
                        </Box>
                        <GlobalMdmFields  readOnly={true} formErrors={this.state.formErrors} onFieldChange={this.onFieldChange.bind(this,yupglobalMDMFieldRules)} />

                        <Text
                            mt={5}
                            mb={2}
                            alignSelf="flex-start"
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            SYSTEM FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput
                                    label="System"
                                    name="System"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Role"
                                    name="Role"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="SalesOrg"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Purpose of Request"
                                    name="PurposeOfRequest"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                               
                            </Box>
                        </Box>
                        <Text
                            mt={5}
                            mb={2}
                            alignSelf="flex-start"
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            CUSTOMER MASTER FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                            {displayRule['display_LN'] ?  
                                <>
                                <FormInput
                                    required
                                    readOnly
                                    label="License Number"
                                    name="LicenseNumber"
                                    value={this.state.formData ? this.state.formData['LicenseNumber'] : null }
                                    error={this.state.formErrors ? this.state.formErrors['LicenseNumber'] : null }
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="License Expiration Date"
                                    name="LicenseExpiratinDate"
                                    variant="solid"
                                    value={this.state.formData ? this.state.formData['LicenseExpiratinDate'] : null }
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['LicenseExpiratinDate'] : null }
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
                                    name="TransportationZone"
                                    variant="solid"
                                    value={this.state.formData ? this.state.formData['TransportationZone'] : null }
                                    error={this.state.formErrors ? this.state.formErrors['TransportationZone'] : null }
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
                                    arrayOfData={dropDownDatas.CustomerClass} 
                                    label='Customer Class ' 
                                    name='CustomerClass' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustomerClass'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.CustPricProc} 
                                    label='CustPricProc ' 
                                    name='CustPricProc' 
                                    value={this.state.formData ? this.state.formData['CustPricProc'] : null}
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustPricProc'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['CustPricProc']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.IndustryCode5} 
                                    label='Industry Code 5' 
                                    name='IndustryCode5' 
                                    isRequired={false}
                                    formErrors={this.state.formErrors? this.state.formErrors['IndustryCode5'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.Industry} 
                                    label='Industry' 
                                    name='Industry' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['Industry'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.ReconAccount} 
                                    label='Recon Account' 
                                    name='ReconAccount' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['ReconAccount'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.SalesOffice} 
                                    label='Sales Office' 
                                    name='SalesOffice' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['SalesOffice'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.CustomerGroup} 
                                    label='Customer Group' 
                                    name='CustomerGroup' 
                                    value={this.state.formData ? this.state.formData['CustomerGroup'] : null}
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustomerGroup'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['CustomerGroup']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.PPCustProc} 
                                    label='PP Cust Proc' 
                                    name='PPCustProc' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PPCustProc'] : null }
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
                                    arrayOfData={dropDownDatas.PriceList} 
                                    label='Price List' 
                                    name='PriceList' 
                                    value={this.state.formData ? this.state.formData['PriceList'] : null}
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PriceList'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['PriceList']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.CompanyCode} 
                                    label='Company Code' 
                                    name='CompanyCode' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CompanyCode'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.DeliveryPriority} 
                                    label='Delivery Priority' 
                                    name='DeliveryPriority' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['DeliveryPriority'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.ShippingConditions} 
                                    label='Shipping Conditions' 
                                    name='ShippingConditions' 
                                    isRequired={true}
                                    value={this.state.formData ? this.state.formData['ShippingConditions'] : null}
                                    formErrors={this.state.formErrors? this.state.formErrors['ShippingConditions'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['ShippingConditions']}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.Incoterms1} 
                                    label='Incoterms 1' 
                                    name='Incoterms1' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['Incoterms1'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                {displayRule['displayINCOT2'] ?
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
                                    arrayOfData={dropDownDatas.AcctAssgmtGroup} 
                                    label='Acct Assgmt Group' 
                                    name='AcctAssgmtGroup' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['AcctAssgmtGroup'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.PartnerFunction} 
                                    label='Partner Function' 
                                    name='PartnerFunction' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PartnerFunction'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.AccountType} 
                                    label='Account Type' 
                                    name='AccountType' 
                                    isRequired={true}
                                    value={this.state.formData ? this.state.formData['AccountType'] : null}
                                    formErrors={this.state.formErrors? this.state.formErrors['AccountType'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputPropsForDefaultRules['AccountType']}
                                 />                            
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.ShippingCustomerType} 
                                    label='Shipping Customer Type' 
                                    name='ShippingCustomerType' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['ShippingCustomerType'] : null }
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
                    </Box>

                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 15,
                            marginTop: 20,
                            marginBottom: 10,
                            marginHorizontal: 25,
                        }}>
                        <Button
                            onPress={(event) =>this.handleSubmit(event,'approve',mytaskCustomerMasterRules) }
                            title="Approve"
                        />
                        <Button
                            title="Reject"
                            onPress={(event) =>this.handleSubmit(event,'reject',mytaskCustomerMasterRules) }
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
    const { singleCustomerDetail,fetching } = customer;
    return { singleCustomerDetail,fetching };
};

export default connect(mapStateToProps, { getCustomerDetail })(Default);

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

