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
import {saveApolloMyTaskContracts} from '../../../appRedux/actions/MyTasks';
import { yupFieldValidation} from '../../../constants/utils';
import { MaterialIcons } from '@expo/vector-icons';
import{getStatusBarData,getFunctionalGroupData} from '../../../appRedux/actions/Workflow';

import GlobalMdmFields from '../../../components/GlobalMdmFields';
import SystemFields from '../../../components/SystemFields';
import {mytaskContractsRules } from '../../../constants/FieldRules';
import {RoleType,SalesOrgType,SystemType,DistributionChannelType,DivisionType,CompanyCodeType } from '../../../constants/WorkflowEnums';

import DynamicSelect from '../../../components/DynamicSelect';
import {fetchContractsDropDownData } from '../../../redux/DropDownDatas';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import { connect } from 'react-redux';
import MultiColorProgressBar from '../../../components/MultiColorProgressBar';

const userId=localStorage.getItem('userId');

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {          
            WorkflowId:this.props.location.state.WorkflowId,
            TaskId:this.props.location.state.TaskId,  
            reject: false,
            loading: this.props.fetching,
            alert: this.props.alert,
            statusBarData:this.props.statusBarData,
            functionalGroupDetails:this.props.functionalGroupDetails,
            loadingfnGroupData:this.props.fetchingfnGroupData,
            dropDownDatas:{},
            selectedFile:'',
            formData: {'RejectionButton':false},            
            formErrors: {},
            inputPropsForDefaultRules:{},
            filename:''
        };
        
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        console.log('mounted');
        let postJson={
            "workflowId":wf.WorkflowId ,
            "fuctionalGroup":'contracts',
            "userId":userId,   
        }
        this.props.getStatusBarData(wf.WorkflowId);
        this.props.getFunctionalGroupData(postJson);
        
        fetchContractsDropDownData().then(res => {
                const data = res;
                this.setState({dropDownDatas:data})
            });
    }
      
    componentWillReceiveProps(newProps) {
        let { state: wf } = this.props.location;
        if (newProps.statusBarData != this.props.statusBarData) {
            this.setState({
                statusBarData: newProps.statusBarData,
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
        if (newProps.functionalGroupDetails != this.props.functionalGroupDetails) {
            this.setState({
                functionalGroupDetails: newProps.functionalGroupDetails,
            },()=>{
                if(!wf.isReadOnly){
                    this.validateFromSourceData(this.state.functionalGroupDetails.Customer)
                }
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
        if(source_data.CategoryTypeId != undefined){
            let categoryTypeid=parseInt(source_data.CategoryTypeId) ;
            if(categoryTypeid === 2 ){
                //if self-distributor
                newStateValue['CustomerGroupTypeId']='5'
                newStyleProps['CustomerGroupTypeId']=readOnlyDropDown
            }else if(categoryTypeid ===3  ||categoryTypeid===6){
                //if oem or kitter
                newStateValue['CustomerGroupTypeId']='9'
                newStyleProps['CustomerGroupTypeId']=readOnlyDropDown
            }else if(categoryTypeid ===7){
                // if dropship
                newStateValue['AccountTypeId']='3'
                newStyleProps['AccountTypeId']=readOnlyDropDown        
                newStateValue['CustomerGroupTypeId']='11'
                newStyleProps['CustomerGroupTypeId']=readOnlyDropDown           
            }
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
        let {TaskId,WorkflowId,formData,selectedFile}=this.state, castedFormData={},postData={};
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
                      
            if(selectedFile.length != 0){                
                postData['filedata'] = selectedFile; 
                var fileFormcontent={
                    "userId": userId,
                    "workflowId": "wf001",
                    "documentType": 1,
                    "documentName": selectedFile.name
                    }
                postData['fileFormcontent']=fileFormcontent;
            }
            console.log('postdata',postData)
            this.props.saveApolloMyTaskContracts(postData);
            this.resetForm();
            this.scrollToTop();
        }catch(error){
            console.log('form validtion error')
        }
    }

    onSubmit = (event,reject,schema) => {
       
        let {formData}=this.state;
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    RejectionButton: reject,
                },
            }, () => { yupFieldValidation(this.state.formData,schema,this.handleFormSubmission,this.setFormErrors);
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
            formData: {'RejectionButton':false}    
        })

    }

    selectFile=(events)=>{        
        this.setState({
            selectedFile: events.target.files[0],
            filename: events.target.files[0].name
        })
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        const {functionalGroupDetails,dropDownDatas,inputPropsForDefaultRules}=this.state;
        let globalMdmDetail=functionalGroupDetails ? functionalGroupDetails.Customer:'';
        let functionalDetail=functionalGroupDetails? functionalGroupDetails.Contracts:null;
        
        const { state:workflow  } = location;
        const inputReadonlyProps = workflow.isReadOnly? {disabled:true}:null;
        const showFunctionalDetail = functionalDetail ===null ? {display:'none'} : null ;
        const showButtons = workflow.isReadOnly?{display:'none'} : null ;

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
                        <GlobalMdmFields  formData={globalMdmDetail}  readOnly/>
                       
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

                        <Box {...showFunctionalDetail}>
                        <Text
                            mt={5}
                            mb={2}
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            CONTRACT FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">

                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.IncoTermsTypeId} 
                                    label='Incoterms 1' 
                                    name='IncoTermsTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['IncoTermsTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    value={ workflow.isReadOnly?(functionalDetail && parseInt(functionalDetail.IncoTermsTypeId) ):
                                        ( this.state.formData ? this.state.formData['IncoTermsTypeId'] : null)}
                                    inputProps={inputReadonlyProps}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.CustomerGroupTypeId} 
                                    label='Customer Group' 
                                    name='CustomerGroupTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['CustomerGroupTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    value={ workflow.isReadOnly?(functionalDetail && parseInt(functionalDetail.CustomerGroupTypeId)) :
                                        ( this.state.formData ? this.state.formData['CustomerGroupTypeId'] : null)}
                                    inputProps={ workflow.isReadOnly? inputReadonlyProps :inputPropsForDefaultRules['CustomerGroupTypeId']}
                                 /> 
                                <FormInput
                                    label="Additional Notes"
                                    multiline
                                    numberOfLines={2}
                                    name="additionalNotes"
                                    variant="solid"
                                    type="text"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['additionalNotes'] : null }
                                    value={ workflow.isReadOnly?(functionalDetail && functionalDetail.AdditionalNotes ):
                                        ( this.state.formData ? this.state.formData['additionalNotes'] : null)}
                                    variant={workflow.isReadOnly? 'outline': "solid"}
                                    inline ={workflow.isReadOnly? true : false}
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.PaymentTermsTypeId} 
                                    label='Payment Terms' 
                                    name='PaymentTermsTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['PaymentTermsTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    value={ workflow.isReadOnly?(functionalDetail && parseInt(functionalDetail.PaymentTermsTypeId)) :
                                        ( this.state.formData ? this.state.formData['PaymentTermsTypeId'] : null)}
                                    inputProps={ workflow.isReadOnly? inputReadonlyProps :inputPropsForDefaultRules['PaymentTermsTypeId']}
                                 />
                                <DynamicSelect 
                                    arrayOfData={dropDownDatas.AccountTypeId} 
                                    label='Account Type' 
                                    name='AccountTypeId' 
                                    isRequired={true}
                                    formErrors={this.state.formErrors? this.state.formErrors['AccountTypeId'] : null }
                                    onFieldChange={this.onFieldChange}
                                    value={ workflow.isReadOnly?(functionalDetail && parseInt(functionalDetail.AccountTypeId) ):
                                        ( this.state.formData ? this.state.formData['AccountTypeId'] : null)}
                                    inputProps={ workflow.isReadOnly? inputReadonlyProps :inputPropsForDefaultRules['AccountTypeId']}
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
                                        value={ workflow.isReadOnly?(functionalDetail && functionalDetail.RejectionReason ):
                                            ( this.state.formData ? this.state.formData['RejectionReason'] : null)}
                                        variant={workflow.isReadOnly? 'outline': "solid"}
                                        inline ={workflow.isReadOnly? true : false}
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


export default connect(mapStateToProps, { saveApolloMyTaskContracts,getFunctionalGroupData ,getStatusBarData })(Default);

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
