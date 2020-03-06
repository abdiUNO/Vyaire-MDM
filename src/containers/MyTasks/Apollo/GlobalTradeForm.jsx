import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
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
import { FormInput } from '../../../components/form';
import {saveApolloMyTaskGlobalTrade} from '../../../appRedux/actions/MyTasks';
import { connect } from 'react-redux';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import MultiColorProgressBar from '../../../components/MultiColorProgressBar';
import{getStatusBarData,getGlobalMDMData} from '../../../appRedux/actions/Workflow';

const apiUrl =
    'https://cors-anywhere.herokuapp.com/https://4c4mjyf70b.execute-api.us-east-2.amazonaws.com/dev';

class GlobalTradeForm extends React.Component {
    constructor(props) {
        super(props);
    }

    onFieldChange = (value, e) => this.props.onFieldChange(value, e);

    onSubmit = (reject = false) => this.props.onSubmit(reject);

    render() {
        const { workflow, inputReadonlyProps, width } = this.props;

        return (
            <Box my={2} fullHeight>
                <Box flexDirection="row" justifyContent="space-around" my={4}>
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
                        value={workflow.WorkflowId}
                        variant="outline"
                        type="text"
                    />
                    <FormInput
                        px="25px"
                        flex={1 / 4}
                        label="MDM Number"
                        name="mdm-number"
                        value={workflow.MdmCustomerId}
                        variant="outline"
                        type="text"
                    />
                </Box>

                <Text
                    m="16px 0 0 5%"
                    fontWeight="bold"
                    color="primary"
                    fontSize="18px">
                    TITLE & NO.
                </Text>
                <Text
                    my={2}
                    m="4px 0 16px 5%"
                    fontWeight="light"
                    color="#4195C7"
                    fontSize="28px">
                    GLOBAL MDM
                </Text>
                <Box flexDirection="row" mb={4} justifyContent="center">
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormInput
                            label="Name"
                            name="name"
                            inline
                            variant="outline"
                            type="text"
                            value={workflow.Name1}
                        />
                        <FormInput
                            label="Name 2"
                            name="name2"
                            inline
                            variant="outline"
                            type="text"
                            display={workflow.Name2 ? 'inline' : 'none'}
                        />
                        <FormInput
                            label="Name 3"
                            name="name3"
                            inline
                            variant="outline"
                            type="text"
                            display={workflow.Name3 ? 'inline' : 'none'}
                        />
                        <FormInput
                            label="Name 4"
                            name="name4"
                            inline
                            variant="outline"
                            type="text"
                            display={workflow.Name4 ? 'inline' : 'none'}
                        />
                        <FormInput
                            label="Street"
                            name="street"
                            inline
                            variant="outline"
                            type="text"
                            value={workflow.Street}
                        />
                        <FormInput
                            label="Street 2"
                            name="street2"
                            inline
                            variant="outline"
                            type="text"
                            display={workflow.Street2 ? 'inline' : 'none'}
                        />
                        <FormInput
                            label="City"
                            name="city"
                            inline
                            variant="outline"
                            type="text"
                            value={workflow.City}
                        />
                        <FormInput
                            label="Region"
                            name="region"
                            inline
                            variant="outline"
                            value={workflow.Region}
                            type="text"
                        />
                        <FormInput
                            label="Postal Code"
                            name="postal-code"
                            inline
                            variant="outline"
                            type="text"
                            value={workflow.PostalCode}
                        />
                        <FormInput
                            label="Country"
                            name="country"
                            inline
                            variant="outline"
                            type="text"
                            value={workflow.Country}
                        />
                    </Box>
                    
                    <Box  {...inputReadonlyProps}>
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormInput
                            label="Additional Note"
                            name="AdditionalNotes"
                            onChange={this.onFieldChange}
                            multiline
                            numberOfLines={4}
                            variant="solid"
                            type="text"
                        />

                        <FormInput
                            label="Rejection Reason"
                            name="RejectReason"
                            onChange={this.onFieldChange}
                            multiline
                            numberOfLines={4}
                            variant="solid"
                            required={this.props.rejectionRequired}
                            error={this.props.rejectionRequired}
                            type="text"
                        />
                    </Box>
                    </Box>
                </Box>

                <Box
                    {...inputReadonlyProps}
                    float="right"
                    alignSelf="flex-end"
                    mb={25}
                    mt={5}
                    mr={5}
                    width={[0.8, 1, 1]}
                    mx="auto"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center">
                    <Button
                        onPress={() => this.onSubmit(false)}
                        title="Approve"
                    />
                    <Button
                        onPress={() => this.onSubmit(true)}
                        title="Reject"
                    />
                </Box>
            </Box>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: this.props.fetching,
            alert: this.props.alert,
            statusBarData:this.props.statusBarData,
            globalMdmDetail:this.props.globalMdmDetail,
            formData: {},
            rejectionRequired: false,
        };
    }
    componentDidMount() {
        let { state: wf } = this.props.location;
        this.props.getStatusBarData(wf.WorkflowId);
        this.props.getGlobalMDMData(wf.WorkflowId);
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

    onFieldChange = (value, e) => {
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value,
                },
            },
            this.updateSchema
        );
    };

    submitForm = (reject = false) => {
        try{
            const { location } = this.props;
            const { state: workflow } = location;

            const WorkflowTaskModel = {
                RejectReason: reject ? this.state.formData.RejectReason : '',
                TaskId: workflow.TaskId,
                UserId: 'globaltrade.user',
                WorkflowId: workflow.WorkflowId,
                WorkflowTaskStateChangeType: !reject ? 1 : 2,
            };

            const postData = {
                WorkflowTaskModel,
                AdditionalNotes: this.state.formData.AdditionalNotes,
            };

            this.props.saveApolloMyTaskGlobalTrade(postData);
            this.scrollToTop();
        }catch(error){
            console.log('form error',error)
        }
    };

    onSubmit = (reject = false) => {
        if (!this.state.formData.RejectReason && reject) {
            if (!this.props.rejectionRequired)
                this.setState({ rejectionRequired: true });
        } else {
            this.setState({ rejectionRequired: false, loading: true }, () =>
                this.submitForm(reject)
            );
            //;
        }
    };
    scrollToTop=() =>{
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    render() {
        const { width, height, marginBottom, location } = this.props;
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

                    <GlobalTradeForm
                        rejectionRequired={this.state.rejectionRequired}
                        formData={this.state.formData}
                        workflow={this.state.globalMdmDetail}
                        inputReadonlyProps={inputReadonlyProps}
                        onFieldChange={this.onFieldChange}
                        onSubmit={this.onSubmit}
                    />
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
export default connect(mapStateToProps, { saveApolloMyTaskGlobalTrade,getGlobalMDMData  ,getStatusBarData})(Default);

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

