/**
 * @prettier
 */

import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import { FormInput } from '../../components/form';
import { Box, Flex, Text } from '../../components/common';
import Button from '../../components/common/Button';
import {
    getFunctionalGroupData,
    withDrawRequest,
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

const userId = localStorage.getItem('userId');

class MyRequestsForm extends Component {
    componentDidMount() {
        console.log(this.props);
        let { state: wf } = this.props.location;
        this.props.getFunctionalGroupData({
            workflowId: wf.WorkflowId,
            fuctionalGroup: '',
            userId: userId,
        });
    }

    render() {
        const { functionalGroupDetails, fetching } = this.props;

        const globalMdmDetail = functionalGroupDetails
            ? functionalGroupDetails.Customer
            : null;
        if (this.props.fetching || !globalMdmDetail)
            return (
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="650px">
                    <ActivityIndicator size="large" />
                </Box>
            );

        console.log(globalMdmDetail);

        return (
            <Box bg="#EFF3F6">
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
                            value={globalMdmDetail.WorkflowId}
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
                        {globalMdmDetail.WorkflowStateTypeId === 2 && (
                            <Button
                                onPress={() =>
                                    this.props.withDrawRequest(
                                        {
                                            WorkflowId:
                                                globalMdmDetail.WorkflowId,
                                        },
                                        this.props.history
                                    )
                                }
                                title="Withdraw"
                            />
                        )}
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
    } = workflows;
    const { fetching } = myRequests;
    return { fetching: fetchingGlobaldata || fetching, functionalGroupDetails };
};

export default connect(mapStateToProps, {
    getFunctionalGroupData,
    withDrawRequest,
})(MyRequestsForm);
