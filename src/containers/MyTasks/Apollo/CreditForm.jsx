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
import { getCustomerDetail } from '../../../appRedux/actions/Customer';
import {saveApolloMyTaskContracts} from '../../../appRedux/actions/MyTasks';
import { yupFieldValidation} from '../../../constants/utils';

import GlobalMdmFields from '../../../components/GlobalMdmFields';
import {mytaskContractsRules } from '../../../constants/FieldRules';

import DynamicSelect from '../../../components/DynamicSelect';
import {fetchCreditDropDownData } from '../../../redux/DropDownDatas';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import { connect } from 'react-redux';

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {            
            reject: false,
            loading: this.props.fetching,
            alert: this.props.alert,
            dropDownDatas:{},
            CM_Data:this.props.customerdata,
            formData: {'RejectionButton':false},            
            formErrors: {},
            inputPropsForDefaultRules:{},

        };
    }
    componentDidMount() {
        this.props.getCustomerDetail('002491624');
        fetchCreditDropDownData().then(res => {
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
                if(name==='CustomerGroupTypeId')
                { this.validateRules(name,value)  }
            });
        
       
        
    };


    setFormDataValues = (name,value)=>{
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value,
                },
            });
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
           
            // check for AccountTypeId
            if(stateKey==='CustomerGroupTypeId'){
                var cg_val=stateVal
                    if(cg_val==='1' || cg_val==='10' )
                    { this.setFormDataValues('AccountTypeId','1')
                      this.setInputPropsForDefaultRules('AccountTypeId',readOnlyDropDown)
                    }else if(cg_val==='2' || cg_val==='7'){
                        this.setFormDataValues('AccountTypeId','2')
                        this.setInputPropsForDefaultRules('AccountTypeId',readOnlyDropDown)
                    }else if(cg_val==='3' || cg_val==='4' || cg_val==='6' || cg_val==='11'){
                        this.setFormDataValues('AccountTypeId','3')
                        this.setInputPropsForDefaultRules('AccountTypeId',readOnlyDropDown)
                    }else if(cg_val==='8' ){
                        this.setFormDataValues('AccountTypeId','6')
                        this.setInputPropsForDefaultRules('AccountTypeId',readOnlyDropDown)
                    }else{
                        this.setFormDataValues('AccountTypeId','')
                        this.setInputPropsForDefaultRules('AccountTypeId',{disabled:false})
                    }
            }
            
        }
            
    validateFromSourceData= (source_data) =>{ 
        const readOnlyDropDown={disabled:true}
        const newStateValue={},newStyleProps={};
       
        //check Customer group  
        if(source_data.Category.toLowerCase()==='self-distributor'){
            newStateValue['CustomerGroupTypeId']='5'
            newStyleProps['CustomerGroupTypeId']=readOnlyDropDown
        }else if(source_data.Category.toLowerCase()==='oem' || source_data.Category.toLowerCase()==='kitter'){
            newStateValue['CustomerGroupTypeId']='9'
            newStyleProps['CustomerGroupTypeId']=readOnlyDropDown
        }else if(source_data.Category.toLowerCase()==='dropship'){
            newStateValue['AccountTypeId']='3'
            newStyleProps['AccountTypeId']=readOnlyDropDown        
            newStateValue['CustomerGroupTypeId']='11'
            newStyleProps['CustomerGroupTypeId']=readOnlyDropDown           
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
        });

    }

    handleFormSubmission =(schema) =>
    {
        let {formData,selectedFile}=this.state, castedFormData={},postData={};
        try{
            castedFormData=schema.cast(formData)
            const WorkflowTaskModel = {
                RejectionReason: formData['RejectionButton'] ? formData['RejectionReason']:'',
                TaskId: '1',
                UserId:'credit.user',
                WorkflowId: 'wf002',
                WorkflowTaskStateChangeType: !formData['RejectionButton']  ? 1 : 2,
            };
            delete castedFormData.RejectionButton
            postData['formdata'] = {
                WorkflowTaskModel,
                ...castedFormData
            }
                      
            if(selectedFile.length != 0){                
                postData['filedata'] = selectedFile; 
                var fileFormcontent={
                    "userId": "test.user",
                    "workflowId": "wf001",
                    "documentType": 1,
                    "documentName": docname
                    }
                postData['fileFormcontent']=fileFormcontent;
            }
            console.log('postdata',postData)
            this.props.saveApolloMyTaskContracts(postData);
            // this.resetForm();
        }catch(error){
            console.log('form validtion error')
        }
    }

    onSubmit = (event,reject,schema) => {
       
        let {formData}=this.state;
        if(reject)
        {    this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        RejectionButton: true,
                    },
                }, () => { yupFieldValidation(this.state.formData,schema,this.handleFormSubmission,this.setFormErrors);
                });
        }else{
            yupFieldValidation(formData,schema,this.handleFormSubmission,this.setFormErrors);
        }   
        this.scrollToTop();
    }   

    scrollToTop=() =>{
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    
    selectFile=(events)=>{        
        this.setState({
            selectedFile: events.target.files[0],
            filename: events.target.files[0].name
        })
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        const {CM_Data,dropDownDatas,inputPropsForDefaultRules}=this.state;
        let barwidth = Dimensions.get('screen').width - 1000;
        let progressval = 40;
        var source_category=CM_Data.Category.toLowerCase();
        let disp_payterms=false;
        if(source_category==='direct'||source_category==='dropship'||source_category==='other'){
            disp_payterms=true;
        }
        var bgcolor=this.state.alert.color || '#FFF';
        if(this.state.loading){
            return <Loading/>
        }    
       
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                {this.state.alert.display &&                    
                    <FlashMessage bg={{backgroundColor:bgcolor}}  message={this.state.alert.message} />
                }
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
                        <GlobalMdmFields  readOnly/>
                       
                        <Text
                            mt={5}
                            mb={2}
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
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                {disp_payterms && 
                                    <DynamicSelect 
                                        arrayOfData={dropDownDatas.PaymentTermsTypeId} 
                                        label='Payment Terms' 
                                        name='PaymentTermsTypeId' 
                                        isRequired={true}
                                        value={this.state.formData ? this.state.formData['PaymentTermsTypeId'] : null}
                                        formErrors={this.state.formErrors? this.state.formErrors['PaymentTermsTypeId'] : null }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={inputPropsForDefaultRules['PaymentTermsTypeId']}
                                    />
                                }
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.riskCategoryTypeId} 
                                    label='Risk Category' 
                                    name='riskCategoryTypeId' 
                                    formErrors={this.state.formErrors? this.state.formErrors['riskCategoryTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <FormInput    
                                    label="Credit Limit"
                                    name="creditLimit"
                                    error={this.state.formErrors ? this.state.formErrors['creditLimit'] : null }
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="First Name"
                                    name="firstName"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"                                    
                                />
                                <FormInput
                                    label="Last Name"
                                    name="lastName"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Telephone"
                                    name="telephone"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Fax"
                                    name="fax"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Additional Notes"
                                    multiline
                                    numberOfLines={2}
                                    name="additionalNotes"
                                    variant="solid"
                                    type="text"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AdditionalNotes'] : null }

                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Payer"
                                    name="payer"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Bill To"
                                    name="billTo"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.creditRepGroupTypeId} 
                                    label='Credit Rep Group' 
                                    name='creditRepGroupTypeId' 
                                    formErrors={this.state.formErrors? this.state.formErrors['creditRepGroupTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                 />
                                 <FormInput
                                    label="Cred Info Number"
                                    name="credInfoNumber"
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
                                    name="lastExtReview"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Rating"
                                    name="rating"
                                    inline
                                    variant="outline"
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

                        <Text style={styles.statusText}>{this.state.filename}</Text> 
                        <label htmlFor="file-upload"  className="custom-file-upload">                            
                            <MaterialIcons name="attach-file"  size={20} color="#fff"  /> 
                            Distribution Agreement
                        </label>
                        <input id="file-upload" type="file" onChange={this.selectFile} />

                        <Button
                            onPress={(event) =>this.onSubmit(event,false,mytaskContractsRules) }
                            title="Approve"
                        />
                        <Button
                            title="Reject"
                            onPress={(event) =>this.onSubmit(event,true,mytaskContractsRules) }
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

const mapStateToProps = ({ customer,myTasks }) => {
    const { singleCustomerDetail} = customer;
    const {fetching,alert}=myTasks;
    return { singleCustomerDetail,fetching,alert };
};

export default connect(mapStateToProps, { getCustomerDetail,saveApolloMyTaskContracts })(Default);

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
