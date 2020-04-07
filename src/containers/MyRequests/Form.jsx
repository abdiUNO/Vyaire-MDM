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
    getMdmMappingMatrix
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
import {normalize} from '../../appRedux/sagas/config';

class MyRequestsForm extends Component {
    state = {
        downloading: {},
        statusBarData: this.props.statusBarData,
        isUpdateScreenDetail:false
    };

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: wf.WorkflowId,
            fuctionalGroup: '',
            taskId: '',
            userId: localStorage.getItem('userId'),
        };
        if(wf.Type.toLowerCase().includes('create')){            
            this.props.getFunctionalGroupData(postJson);
        }
        else if(wf.Type.toLowerCase().includes('update') && wf.IsGlobalUpdate){
            let jsonBody={
                MdmNumber: wf.MdmNumber,
                WorkflowId:wf.WorkflowId,
                userId: localStorage.getItem('userId'),
            };
            this.props.getMdmMappingMatrix(jsonBody);
            this.setState({isUpdateScreenDetail:true})
        }

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
        const { downloading,isUpdateScreenDetail } = this.state;
        let { state: wf = {} } = this.props.location;

        const { functionalGroupDetails, fetching,
            mdmcustomerdata: {
            MDMGlobalData: globalDetail = {},
            MDMMappingMatrix: mdmMappingMatrix = [],
            CreditData: mdmCreditData = [],
        }, } = this.props;
        
        const { DocumentLocation: files, Customer } = functionalGroupDetails;
        let Deltas=[],globalMdmDetail={};
        if(wf.Type.toLowerCase().includes('update')){
            globalMdmDetail=globalDetail;
            Deltas=globalMdmDetail ? normalize(globalMdmDetail.Deltas || []) : [];
        }else{
            globalMdmDetail = Customer || {};
        }
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
                            label="Workflow Title"
                            name="WorkflowTitle"
                            variant="outline"
                            type="text"
                            value={globalMdmDetail.WorkflowTitle}
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
                            value={wf.MdmNumber}
                        />
                    </Box>
                    <GlobalMdmFields
                        formData={{
                            ...globalMdmDetail,
                            Category:
                                CategoryTypes[globalMdmDetail.CategoryTypeId],
                        }}
                        deltas={Deltas ? Deltas : {}}
                        readOnly
                    />
                    {!isUpdateScreenDetail && 
                    <>
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
                            {Deltas && Deltas['SystemTypeId'] ? (
                                    <DeltaField delta={Deltas['SystemTypeId']} />
                                ) : (
                                    <FormInput
                                        label="System"
                                        name="System"
                                        team='system'
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
                                )}
                                {Deltas && Deltas['RoleTypeId'] ? (
                                    <DeltaField delta={Deltas['RoleTypeId']} />
                                ) : (
                                    <FormInput
                                        label="Role"
                                        name="Role"
                                        team='system'
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
                                )}

                                {Deltas && Deltas['SalesOrgTypeId'] ? (
                                    <DeltaField
                                        delta={Deltas['SalesOrgTypeId']}
                                    />
                                ) : (
                                    <FormInput
                                        label="Sales Org"
                                        name="SalesOrg"
                                        team='system'
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
                                )}
                                <FormInput
                                    label="Purpose of Request"
                                    name="PurposeOfRequest"
                                    team='system'
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                {Deltas && Deltas['DistributionChannelTypeId'] ? (
                                    <DeltaField
                                        delta={
                                            Deltas['DistributionChannelTypeId']
                                        }
                                    />
                                ) : (
                                    <FormInput
                                        label="Distribution Channel"
                                        name="DistributionChannel"
                                        team='system'
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
                                )}

                                {Deltas && Deltas['DivisionTypeId'] ? (
                                    <DeltaField
                                        delta={Deltas['DivisionTypeId']}
                                    />
                                ) : (
                                    <FormInput
                                        label="Division"
                                        name="DivisionTypeId"
                                        team='system'
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
                                )}

                                {Deltas && Deltas['CompanyCodeTypeId'] ? (
                                    <DeltaField
                                        delta={Deltas['CompanyCodeTypeId']}
                                    />
                                ) : (
                                    <FormInput
                                        label="CompanyCode"
                                        name="CompanyCodeTypeId"
                                        team='system'
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
                                )}
                        </Box>
                    </Box>
                    </>
                    }
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

const mapStateToProps = ({ workflows, myRequests ,updateFlow }) => {
    const {
        fetchingfnGroupData: fetchingGlobaldata,
        functionalGroupDetails,
        alert: workFlowAlert,
        error,
        statusBarData,
    } = workflows;
    const { fetching, alert: requestAlert } = myRequests;
    const { mdmcustomerdata, fetching :fetchingUpdates} = updateFlow;
    const alert = workFlowAlert.display ? workFlowAlert : requestAlert;

    return {
        fetching: fetchingGlobaldata || fetching ||fetchingUpdates,
        functionalGroupDetails,
        alert,
        error,
        statusBarData,
        mdmcustomerdata
    };
};

export default connect(mapStateToProps, {
    getFunctionalGroupData,
    withDrawRequest,
    getStatusBarData,
    getMdmMappingMatrix
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
