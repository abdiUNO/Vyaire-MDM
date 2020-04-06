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
} from '../../../../components/common';
import { FormInput } from '../../../../components/form';
import { saveApolloMyTaskGlobalTrade } from '../../../../appRedux/actions/MyTasks';
import { connect } from 'react-redux';
import Loading from '../../../../components/Loading';
import FlashMessage from '../../../../components/FlashMessage';
import MultiColorProgressBar from '../../../../components/MultiColorProgressBar';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../../appRedux/actions/Workflow';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
} from '../../../../constants/WorkflowEnums';
import GlobalMdmFields from '../../../../components/GlobalMdmFields';
import DeltaField from '../../../../components/DeltaField';
import { getMockUpdateTaskDetail } from '../../../../appRedux/sagas/config';

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
            data: {},
            formData: {},
            rejectionRequired: false,
        };
    }
    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: 'wf2',
            fuctionalGroup: 'globaltrade',
            taskId: wf.TaskId,
        };
        this.props.getStatusBarData(postJson);
        // this.props.getFunctionalGroupData(postJson);
        getMockUpdateTaskDetail().then((res) => {
            this.setState({ data: res });
            console.log(res);
        });
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
        const userId = localStorage.getItem('userId');

        try {
            const { location } = this.props;
            const { TaskId, WorkflowId } = this.state;
            const WorkflowTaskModel = {
                RejectReason: reject ? this.state.formData.RejectReason : '',
                TaskId: TaskId,
                UserId: userId,
                WorkflowId: WorkflowId,
                WorkflowTaskOperationType: !reject ? 1 : 2,
            };

            const postData = {
                WorkflowTaskModel,
                AdditionalNotes: this.state.formData.AdditionalNotes,
            };

            this.props.saveApolloMyTaskGlobalTrade(postData);
            this.scrollToTop();
        } catch (error) {
            console.log('form error', error);
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
    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    render() {
        const {
            width,
            location,

            statusBarData,
            TasksStatusByTeamId = null,
            alert = {},
        } = this.props;

        const {
            data: { CustomerData, Deltas = {} },
        } = this.state;
        const globalMdmDetail = CustomerData;
        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                TasksStatusByTeamId === null ||
                !(TasksStatusByTeamId[2].WorkflowTaskStateTypeId === 2),
        };

        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;

        const showFunctionalDetail =
            state.isReadOnly && CustomerData === null
                ? { display: 'none' }
                : null;

        const showButtons = workflow.isReadOnly ? { display: 'none' } : null;

        var bgcolor = alert.color || '#FFF';
        if (this.props.fetching) {
            return <Loading />;
        }
        if (this.props.fetchingfnGroupData) {
            return <Loading />;
        }

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                {alert.display && (
                    <FlashMessage
                        bg={{ backgroundColor: bgcolor }}
                        message={alert.message}
                    />
                )}
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 60 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <View style={styles.progressIndicator}>
                        <MultiColorProgressBar readings={statusBarData} />
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
                                value={
                                    globalMdmDetail &&
                                    globalMdmDetail.WorkflowId
                                }
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                                value={
                                    globalMdmDetail && globalMdmDetail.MdmNumber
                                }
                            />
                        </Box>
                        <GlobalMdmFields formData={globalMdmDetail} readOnly />
                        <Box>
                            <Text
                                mt={5}
                                mb={2}
                                fontWeight="regular"
                                color="lightBlue"
                                fontSize={24}
                                pl={4}>
                                GLOBAL TRADE FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Additional Notes"
                                        multiline
                                        numberOfLines={2}
                                        name="additionalNotes"
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'additionalNotes'
                                                  ]
                                                : null
                                        }
                                        value={
                                            workflow.isReadOnly
                                                ? globalMdmDetail &&
                                                  globalMdmDetail.AdditionalNotes
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'additionalNotes'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center"></Box>
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
                            <Button
                                onPress={(event) => this.onSubmit(false)}
                                title="Approve"
                            />
                            <Button
                                title="Reject"
                                onPress={(event) => this.onSubmit(true)}
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
                render={(dimensions) => (
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

const mapStateToProps = ({ workflows, myTasks }) => {
    const { fetching, alert } = myTasks;
    const {
        fetchingfnGroupData,
        statusBarData,
        functionalGroupDetails,
        TasksStatusByTeamId,
        fetchingStatusBar,
    } = workflows;
    return {
        fetchingfnGroupData,
        fetching: fetching || fetchingStatusBar || fetchingfnGroupData,
        alert,
        statusBarData,
        functionalGroupDetails,
    };
};

export default connect(mapStateToProps, {
    saveApolloMyTaskGlobalTrade,
    getFunctionalGroupData,
    getStatusBarData,
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
