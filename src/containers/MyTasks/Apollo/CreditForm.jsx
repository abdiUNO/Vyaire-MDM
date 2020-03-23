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
import {saveApolloMyTaskCredit} from '../../../appRedux/actions/MyTasks';
import{getStatusBarData,getFunctionalGroupData} from '../../../appRedux/actions/Workflow';

import { yupFieldValidation} from '../../../constants/utils';

import GlobalMdmFields from '../../../components/GlobalMdmFields';
import {mytaskCreditRules } from '../../../constants/FieldRules';
import {RoleType,SalesOrgType,SystemType,DistributionChannelType,DivisionType,CompanyCodeType } from '../../../constants/WorkflowEnums';
import MultiColorProgressBar from '../../../components/MultiColorProgressBar';
import DynamicSelect from '../../../components/DynamicSelect';
import {fetchCreditDropDownData } from '../../../redux/DropDownDatas';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import { connect } from 'react-redux';

const userId=localStorage.getItem('userId');

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
            WorkflowId:this.props.location.state.WorkflowId,
            TaskId:this.props.location.state.TaskId,         
            reject: false,
            statusBarData:this.props.statusBarData,
            functionalGroupDetails:this.props.functionalGroupDetails,
            loadingfnGroupData:this.props.fetchingfnGroupData,
            loading: this.props.fetching,            
            alert: this.props.alert,
            dropDownDatas:{},
            formData: {'creditLimit':'1','RejectionButton':false},            
            formErrors: {},
        };

    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson={
            "workflowId":wf.WorkflowId ,
            "fuctionalGroup":'credit',
            "userId":userId,   
        }
        this.props.getStatusBarData(wf.WorkflowId)
        this.props.getFunctionalGroupData(postJson);
        fetchCreditDropDownData().then(res => {
                const data = res;
                this.setState({dropDownDatas:data})
            });
    }
      
    componentWillReceiveProps(newProps) {
        
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
        if (newProps.statusBarData != this.props.statusBarData) {
            this.setState({
                statusBarData: newProps.statusBarData,
            });            
        }
        if (newProps.functionalGroupDetails != this.props.functionalGroupDetails) {
            this.setState({
                functionalGroupDetails: newProps.functionalGroupDetails,
            });            
        }
        if (newProps.fetchingfnGroupData != this.props.fetchingfnGroupData) {
            this.setState({
                loadingfnGroupData: newProps.fetchingfnGroupData,
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
            });
    };

    handleDefaultValues = () => 
    {
        let {formData}=this.state
        let defaultValues={}
        if(formData.creditLimit===undefined || formData.creditLimit.trim().length===0){
            defaultValues['creditLimit']='1'
        }
        if(formData.PaymentTermsTypeId===undefined || formData.PaymentTermsTypeId===0){
            defaultValues['PaymentTermsTypeId']=3
        }
        return defaultValues;
    }

    handleFormSubmission =(schema) =>
    {
        let {TaskId,WorkflowId,formData}=this.state, castedFormData={},postData={};
        try{
            
            castedFormData=schema.cast(formData)
            const WorkflowTaskModel = {
                RejectionReason: formData['RejectionButton'] ? formData['RejectionReason']:'',
                TaskId: TaskId,
                UserId:userId,
                WorkflowId: WorkflowId,
                WorkflowTaskOperationType: !formData['RejectionButton']  ? 1 : 2,
            };
            delete castedFormData.RejectionButton
            postData['formdata'] = {
                WorkflowTaskModel,
                ...castedFormData
            }
                  
            this.props.saveApolloMyTaskCredit(postData);
            this.resetForm();
            this.scrollToTop();
        }catch(error){
            console.log('form validtion error')
        }
    }

    onSubmit = (event,reject,schema) => {
       
        let {formData}=this.state;
        let defaults=this.handleDefaultValues()
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    ...defaults,
                    RejectionButton: reject,
                },
            }, () => { console.log('f',this.state.formData)
                yupFieldValidation(this.state.formData,schema,this.handleFormSubmission,this.setFormErrors);
            });     
        
    }   

    scrollToTop=() =>{
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }

    resetForm = () => {        
        Object.keys(this.state.formData).map(key => {
            this.setState(
                {
                    formData: {                        
                        [key]: '',
                    },
                }); 
            });
        Object.keys(this.state.formErrors).map(key => {
            this.setState(
                {
                    formErrors: {                        
                        [key]: '',
                    },
                }); 
            });
        //restore initial values
        this.setState({
            formData: {'creditLimit':'1','RejectionButton':false}    
        })

    }
        
    render() {
        const { width, height, marginBottom, location } = this.props;
        const {functionalGroupDetails,dropDownDatas}=this.state;
        let globalMdmDetail=functionalGroupDetails ? functionalGroupDetails.Customer:'';
        let creditDetail=functionalGroupDetails? functionalGroupDetails.Credit:null;
        
        const { state:workflow  } = location;
        const inputReadonlyProps = workflow.isReadOnly? {disabled:true}:null;
        const showCreditDetail = workflow.isReadOnly ? (creditDetail ===null ? {display:'none'} : null ) : null ;
        const showButtons = workflow.isReadOnly?{display:'none'} : null ;

        let disp_payterms=workflow.isReadOnly? true : false;
        if(globalMdmDetail && globalMdmDetail.CategoryTypeId!=undefined){
            var source_category= parseInt(globalMdmDetail.CategoryTypeId);
            //direct , dropship , other
            if(source_category=== 4 ||source_category=== 7 ||source_category=== 8){
                disp_payterms=true;
            }
        }

        var bgcolor=this.state.alert.color || '#FFF';
        if(this.state.loading){
            return <Loading/>
        }
        if(this.state.loadingfnGroupData){
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
                    <View  style={styles.progressIndicator}>
                        <MultiColorProgressBar readings={this.state.statusBarData}/>
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
                                value={globalMdmDetail && globalMdmDetail.Title}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                                value={globalMdmDetail && globalMdmDetail.WorkflowId}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                                value={globalMdmDetail && globalMdmDetail.MdmNumber}
                            />
                        </Box>
                        <GlobalMdmFields formData={globalMdmDetail}  readOnly/>
                       
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
                                    value={SystemType[globalMdmDetail && globalMdmDetail.SystemTypeId]}
                                />
                                <FormInput
                                    label="Role"
                                    name="Role"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={RoleType[globalMdmDetail && globalMdmDetail.RoleTypeId]}
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="SalesOrg"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={SalesOrgType[globalMdmDetail && globalMdmDetail.SalesOrgTypeId]}                                    
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
                                <FormInput
                                    label="Distribution Channel"
                                    name="DistributionChannel"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={DistributionChannelType[globalMdmDetail && globalMdmDetail.DistributionChannelTypeId]}
                                />
                                <FormInput
                                    label="Division"
                                    name="DivisionTypeId"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={DivisionType[globalMdmDetail && globalMdmDetail.DivisionTypeId]}
                                />
                                <FormInput
                                    label="CompanyCode"
                                    name="CompanyCodeTypeId"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={CompanyCodeType[globalMdmDetail && globalMdmDetail.CompanyCodeTypeId]}
                                />
                            </Box>
                        </Box>

                        <Box {...showCreditDetail}>
                        <Text
                            mt={5}
                            mb={2}
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            CREDIT FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                {disp_payterms && 
                                    <DynamicSelect                                         
                                        arrayOfData={dropDownDatas.PaymentTermsTypeId} 
                                        label='Payment Terms' 
                                        name='PaymentTermsTypeId' 
                                        value={ workflow.isReadOnly?
                                            (creditDetail && parseInt(creditDetail.PaymentTermsTypeId) )
                                            :( this.state.formData ? this.state.formData['PaymentTermsTypeId'] : null)}
                                        formErrors={this.state.formErrors? this.state.formErrors['PaymentTermsTypeId'] : null }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={inputReadonlyProps}
                                    />
                                }
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.riskCategoryTypeId} 
                                    label='Risk Category' 
                                    name='riskCategoryTypeId' 
                                    value={ workflow.isReadOnly?
                                        (creditDetail && parseInt(creditDetail.riskCategoryTypeId))
                                         :( this.state.formData ? this.state.formData['riskCategoryTypeId'] : null)}
                                    formErrors={this.state.formErrors? this.state.formErrors['riskCategoryTypeId'] : creditDetail.RiskCategoryTypeId }
                                    onFieldChange={this.onFieldChange}     
                                    inputProps={inputReadonlyProps}                               
                                 />
                                 
                                 <DynamicSelect 
                                    arrayOfData={dropDownDatas.creditRepGroupTypeId} 
                                    label='Credit Rep Group' 
                                    name='creditRepGroupTypeId' 
                                    value={ workflow.isReadOnly? 
                                        (creditDetail && parseInt(creditDetail.creditRepGroupTypeId))
                                         :( this.state.formData ? this.state.formData['creditRepGroupTypeId'] : null)}
                                    formErrors={this.state.formErrors? this.state.formErrors['creditRepGroupTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    inputProps={inputReadonlyProps}
                                 />
                                
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput    
                                    label="Credit Limit"
                                    name="creditLimit"
                                    value={ workflow.isReadOnly?
                                        (creditDetail && creditDetail.creditLimit)
                                         :( this.state.formData ? this.state.formData['creditLimit'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['creditLimit'] : null }
                                    onChange={this.onFieldChange}
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    type="text"
                                />
                                 <FormInput
                                    label="CredInfoNumber"
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
                        
                        <Text
                            mt={5}
                            mb={2}
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            CONTACT FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput
                                    label="First Name"
                                    name="contactFirstName"
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    value={ workflow.isReadOnly?
                                        (creditDetail && creditDetail.ContactFirstName)
                                         :( this.state.formData ? this.state.formData['contactFirstName'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['contactFirstName'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"                                    
                                />
                                <FormInput
                                    label="Last Name"
                                    name="contactLastName"
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    value={ workflow.isReadOnly?
                                        (creditDetail && creditDetail.ContactLastName)
                                         :( this.state.formData ? this.state.formData['contactLastName'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['contactLastName'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Telephone"
                                    name="contactTelephone"
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    value={ workflow.isReadOnly?
                                        (creditDetail && creditDetail.ContactTelephone)
                                         :( this.state.formData ? this.state.formData['contactTelephone'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['contactTelephone'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Fax"
                                    name="contactFax"
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    value={ workflow.isReadOnly?
                                        (creditDetail && creditDetail.ContactFax )
                                        :( this.state.formData ? this.state.formData['contactFax'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['contactFax'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Email"
                                    name="contactEmail"
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    value={ workflow.isReadOnly?
                                        (creditDetail && creditDetail.ContactEmail )
                                        :( this.state.formData ? this.state.formData['contactEmail'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['contactEmail'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Additional Notes"
                                    multiline
                                    numberOfLines={2}
                                    name="additionalNotes"
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                    type="text"
                                    onChange={this.onFieldChange}
                                    value={ workflow.isReadOnly?
                                        (creditDetail &&  creditDetail.AdditionalNotes)
                                         :( this.state.formData ? this.state.formData['AdditionalNotes'] : null)}
                                    error={this.state.formErrors ? this.state.formErrors['AdditionalNotes'] : null }
                                />
                                <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        value={ workflow.isReadOnly?
                                            (creditDetail && creditDetail.RejectionReason )
                                            :( this.state.formData ? this.state.formData['RejectionReason'] : null)}
                                        error={this.state.formErrors ? this.state.formErrors['RejectionReason'] : null }
                                        multiline
                                        numberOfLines={2}
                                        variant={workflow.isReadOnly? 'outline': "solid"}
                                        inline ={workflow.isReadOnly? true : false}
                                        type="text"
                                />
                            </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box {...showButtons}>
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
                            
                        }}
                        >

                        <Button
                            onPress={(event) =>this.onSubmit(event,false,mytaskCreditRules) }
                            title="Approve"
                        />
                        <Button
                            title="Reject"
                            onPress={(event) =>this.onSubmit(event,true,mytaskCreditRules) }
                        />
                    </Flex>
                    </Box>
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

const mapStateToProps = ({ workflows,myTasks }) => {
    const {fetching,alert}=myTasks;
    const {fetchingfnGroupData,statusBarData,functionalGroupDetails}=workflows;
    return { fetchingfnGroupData,fetching,alert,statusBarData,functionalGroupDetails };
};

export default connect(mapStateToProps, { saveApolloMyTaskCredit,getFunctionalGroupData ,getStatusBarData})(Default);

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
