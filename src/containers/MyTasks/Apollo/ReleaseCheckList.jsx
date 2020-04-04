import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Button, Box, Text } from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';
import { releaseChecklist } from '../../../appRedux/actions/MyTasks';
import { yupFieldValidation } from '../../../constants/utils';
import { rejectRules } from '../../../constants/FieldRules';

import GlobalMdmFields from '../../../components/GlobalMdmFields';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
    WorkflowTeamType,
} from '../../../constants/WorkflowEnums';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import { connect } from 'react-redux';
import MultiColorProgressBar from '../../../components/MultiColorProgressBar';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../appRedux/actions/Workflow';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
        };
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: wf.WorkflowId,
            fuctionalGroup: WorkflowTeamType[wf.TeamId].toLowerCase(),
            taskId: wf.TaskId,
        };
        this.props.getFunctionalGroupData(postJson);
        this.props.getStatusBarData(postJson);
    }

    onSubmit = () => {
        let { TaskId, WorkflowId } = this.state,
            postData = {};
        try {
            postData['formData'] = {
                RejectReason: '',
                TaskId: TaskId,
                UserId: localStorage.getItem('userId'),
                WorkflowId: WorkflowId,
                WorkflowTaskOperationType: 1,
            };
            postData['teamId'] = this.props.location.state.TeamId;
            this.props.releaseChecklist(postData, this.props.history);
            this.resetForm();
            this.scrollToTop();
        } catch (error) {
            console.log('form validtion error');
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
            history: { action },
            functionalGroupDetails: { Customer: globalMdmDetail = {} },
            alert = {},
            TasksStatusByTeamId = null,
            statusBarData,
        } = this.props;

        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                TasksStatusByTeamId === null ||
                !(
                    globalMdmDetail.WorkflowStateTypeId === 2 &&
                    TasksStatusByTeamId[state.TeamId]
                        .WorkflowTaskStateTypeId === 2
                ),
        };

        const showButtons = workflow.isReadOnly ? { display: 'none' } : null;

        var bgcolor = alert.color || '#FFF';
        if (this.props.fetching) {
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
                                    value={
                                        SystemType[
                                            globalMdmDetail &&
                                                globalMdmDetail.SystemTypeId
                                        ]
                                    }
                                />
                                <FormInput
                                    label="Role"
                                    name="Role"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={
                                        RoleType[
                                            globalMdmDetail &&
                                                globalMdmDetail.RoleTypeId
                                        ]
                                    }
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="SalesOrg"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={
                                        SalesOrgType[
                                            globalMdmDetail &&
                                                globalMdmDetail.SalesOrgTypeId
                                        ]
                                    }
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
                                    value={
                                        DistributionChannelType[
                                            globalMdmDetail &&
                                                globalMdmDetail.DistributionChannelTypeId
                                        ]
                                    }
                                />
                                <FormInput
                                    label="Division"
                                    name="DivisionTypeId"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={
                                        DivisionType[
                                            globalMdmDetail &&
                                                globalMdmDetail.DivisionTypeId
                                        ]
                                    }
                                />
                                <FormInput
                                    label="CompanyCode"
                                    name="CompanyCodeTypeId"
                                    inline
                                    variant="outline"
                                    type="text"
                                    value={
                                        CompanyCodeType[
                                            globalMdmDetail &&
                                                globalMdmDetail.CompanyCodeTypeId
                                        ]
                                    }
                                />
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
                                onPress={event => this.onSubmit(event, false)}
                                title="Release"
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
        fetching: fetching || fetchingStatusBar || fetchingfnGroupData,
        alert,
        statusBarData,
        functionalGroupDetails,
        TasksStatusByTeamId,
    };
};

export default connect(mapStateToProps, {
    releaseChecklist,
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
