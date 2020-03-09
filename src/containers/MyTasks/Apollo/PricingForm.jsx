import React from 'react';
import {
    ScrollView,
    View,
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
    Button,
    Box,
    Text,
} from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {saveApolloMyTaskPricing} from '../../../appRedux/actions/MyTasks';
import { yupFieldValidation} from '../../../constants/utils';

import GlobalMdmFields from '../../../components/GlobalMdmFields';
import {mytaskPricingRules } from '../../../constants/FieldRules';
import {RoleType,SalesOrgType,SystemType,DistributionChannelType,DivisionType,CompanyCodeType } from '../../../constants/WorkflowEnums';

import DynamicSelect from '../../../components/DynamicSelect';
import {fetchPricingDropDownData } from '../../../redux/DropDownDatas';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import { connect } from 'react-redux';
import MultiColorProgressBar from '../../../components/MultiColorProgressBar';
import{getStatusBarData,getGlobalMDMData} from '../../../appRedux/actions/Workflow';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            reject: false,
            loading: this.props.fetching,
            alert: this.props.alert,
            statusBarData:this.props.statusBarData,
            globalMdmDetail:this.props.globalMdmDetail,
            dropDownDatas:{},
            formData: {'RejectionButton':false},            
            formErrors: {},
        };
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        this.props.getStatusBarData(wf.WorkflowId);
        this.props.getGlobalMDMData(wf.WorkflowId);
        fetchPricingDropDownData().then(res => {
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
        if (newProps.globalMdmDetail != this.props.globalMdmDetail) {
            this.setState({
                globalMdmDetail: newProps.globalMdmDetail,
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

    handleFormSubmission =(schema) =>
    {
        let {formData}=this.state, castedFormData={},postData={};
        try{
            castedFormData=schema.cast(formData)
            const WorkflowTaskRequest = {
                RejectionReason: formData['RejectionButton'] ? formData['RejectionReason']:'',
                TaskId: '10',
                UserId:'pricing.user',
                WorkflowId: 'wf002',
                WorkflowTaskStateChangeType: !formData['RejectionButton']  ? 1 : 2,
            };
            delete castedFormData.RejectionButton
            postData['formdata'] = {
                WorkflowTaskRequest,
                ...castedFormData
            }
                  
            console.log('postdata',postData)
            this.props.saveApolloMyTaskPricing(postData);
            // this.resetForm();
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
    
    render() {
        const { width, height, marginBottom, location } = this.props;
        const {dropDownDatas,globalMdmDetail}=this.state;
        let barwidth = Dimensions.get('screen').width - 1000;
        let progressval = 40;
        const { state: workflow } = location;
        const inputReadonlyProps = workflow.isReadOnly? {display:'none'}:null;

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
                                value={workflow.Title}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                                value={workflow.WorkflowId}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                                value={workflow.MdmCustomerId}
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
                                    value={SystemType[globalMdmDetail.SystemTypeId]}
                                />
                                <FormInput
                                    label="Role"
                                    name="Role"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={RoleType[globalMdmDetail.RoleTypeId]}
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="SalesOrg"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={SalesOrgType[globalMdmDetail.SalesOrgTypeId]}                                    
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
                                    value={DistributionChannelType[globalMdmDetail.DistributionChannelTypeId]}
                                />
                                <FormInput
                                    label="Division"
                                    name="DivisionTypeId"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={DivisionType[globalMdmDetail.DivisionTypeId]}
                                />
                                <FormInput
                                    label="CompanyCode"
                                    name="CompanyCodeTypeId"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={CompanyCodeType[globalMdmDetail.CompanyCodeTypeId]}
                                />
                            </Box>
                        </Box>


                        <Box {...inputReadonlyProps}>
                        <Text
                            mt={5}
                            mb={2}
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            PRICING FIELDS
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
                        </Box>
                        
                        
                    </Box>

                    <Box {...inputReadonlyProps}>
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
                            onPress={(event) =>this.onSubmit(event,false,mytaskPricingRules) }
                            title="Approve"
                        />
                        <Button
                            title="Reject"
                            onPress={(event) =>this.onSubmit(event,true,mytaskPricingRules) }
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
    const {statusBarData,globalMdmDetail}=workflows;
    return { fetching,alert,statusBarData,globalMdmDetail };
};

export default connect(mapStateToProps, { saveApolloMyTaskPricing ,getGlobalMDMData ,getStatusBarData })(Default);

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
