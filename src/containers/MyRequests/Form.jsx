/**
 * @prettier
 */

import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { FormInput } from '../../components/form';
import { Box, Flex, Text } from '../../components/common';
import Button from '../../components/common/Button';
import {
    getFunctionalGroupData,
    withDrawRequest,
    getStatusBarData,
} from '../../appRedux/actions';
import GlobalMdmFields from '../../components/GlobalMdmFields';
import {
    CategoryTypes,
    CompanyCodeType,
    DistributionChannelType,
    DivisionType,
    RoleType,
    SalesOrgType,
    SystemType,
} from '../../constants/WorkflowEnums.js';
import FilesList from '../../components/FilesList';
import { ajaxPostRequest } from '../../appRedux/sagas/config';
import FlashMessage from '../../components/FlashMessage';
import MultiColorProgressBar from '../../components/MultiColorProgressBar';

class MyRequestsForm extends Component {
    state = {
        downloading: {},
        statusBarData: this.props.statusBarData,
    };

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: wf.WorkflowId,
            fuctionalGroup: '',
            taskId:'',
            userId: localStorage.getItem('userId'),
        };
        this.props.getFunctionalGroupData(postJson);
        this.props.getStatusBarData(postJson);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.statusBarData != this.props.statusBarData) {
            this.setState({
                statusBarData: newProps.statusBarData,
            });
        }
    }

    render() {
        const { downloading } = this.state;
        let { state: wf } = this.props.location;

        const { functionalGroupDetails, fetching } = this.props;

        const { DocumentLocation: files, Customer } = functionalGroupDetails;

        const globalMdmDetail = Customer || {};

        let workFlowTaskStatus = this.state.statusBarData;

        workFlowTaskStatus = workFlowTaskStatus.filter(function(item) {
            return item.WorkflowTaskStateTypeId != 4;
        });

        if (this.props.fetching)
            return (
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="650px">
                    {this.props.alert.display && (
                        <FlashMessage
                            bg={{
                                backgroundColor:
                                    this.props.alert.color || '#FFF',
                            }}
                            message={this.props.alert.message}
                            marginTop={this.props.error ? '100px' : '125px'}
                        />
                    )}
                    <ActivityIndicator size="large" />
                </Box>
            );

        return (
            <Box bg="#EFF3F6" display="block">
                {this.props.alert.display && (
                    <FlashMessage
                        bg={{
                            backgroundColor: this.props.alert.color || '#FFF',
                        }}
                        message={this.props.alert.message}
                        marginTop={this.props.error ? '100px' : '125px'}
                    />
                )}
                <View style={styles.progressIndicator}>
                    <MultiColorProgressBar
                        readings={this.state.statusBarData}
                    />
                </View>
                <Box display="flex" flex={1} fullHeight mx="12%" my={5}>
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
                            value={globalMdmDetail.Title}
                        />
                        <FormInput
                            px="25px"
                            flex={1 / 4}
                            label="Workflow Number"
                            name="workflow-number"
                            variant="outline"
                            type="text"
                            value={wf.WorkflowId}
                        />
                        <FormInput
                            px="25px"
                            flex={1 / 4}
                            label="MDM Number"
                            name="mdm-number"
                            variant="outline"
                            type="text"
                            disabled
                            value={globalMdmDetail.MdmNumber}
                        />
                    </Box>
                    <GlobalMdmFields
                        formData={{
                            ...globalMdmDetail,
                            Category:
                                CategoryTypes[globalMdmDetail.CategoryTypeId],
                        }}
                        readOnly
                    />
                    <Text
                        mt={5}
                        mb={2}
                        fontWeight="regular"
                        color="lightBlue"
                        fontSize={24}
                        pl={4}>
                        SYSTEM FIELDS
                    </Text>
                    <Box mb={4} flexDirection="row" justifyContent="center">
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
                                value={
                                    SalesOrgType[globalMdmDetail.SalesOrgTypeId]
                                }
                            />
                            <FormInput
                                label="Purpose of Request"
                                name="PurposeOfRequest"
                                inline
                                variant="outline"
                                type="text"
                                value={globalMdmDetail.Purpose}
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
                                        globalMdmDetail
                                            .DistributionChannelTypeId
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
                                    DivisionType[globalMdmDetail.DivisionTypeId]
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
                                        globalMdmDetail.CompanyCodeTypeId
                                    ]
                                }
                            />
                        </Box>
                    </Box>
                    {files && <FilesList files={files} readOnly />}
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
                        {workFlowTaskStatus.length > 0 && (
                            <Button
                                onPress={() => {
                                    window.scrollTo(0, 0);
                                    this.props.withDrawRequest(
                                        {
                                            WorkflowId: wf.WorkflowId,
                                            WorkflowOperationType: 4,
                                        },
                                        this.props.history
                                    );
                                }}
                                title="Withdraw"
                            />
                        )}
                        {}
                    </Flex>
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = ({ workflows, myRequests }) => {
    const {
        fetchingfnGroupData: fetchingGlobaldata,
        functionalGroupDetails,
        alert: workFlowAlert,
        error,
        statusBarData,
    } = workflows;
    const { fetching, alert: requestAlert } = myRequests;

    const alert = workFlowAlert.display ? workFlowAlert : requestAlert;

    return {
        fetching: fetchingGlobaldata || fetching,
        functionalGroupDetails,
        alert,
        error,
        statusBarData,
    };
};

export default connect(mapStateToProps, {
    getFunctionalGroupData,
    withDrawRequest,
    getStatusBarData,
})(MyRequestsForm);

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
