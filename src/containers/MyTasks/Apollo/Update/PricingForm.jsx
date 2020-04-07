import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { connect } from 'react-redux';
import { Flex, Button, Box, Text } from '../../../../components/common';
import { FormInput } from '../../../../components/form';
import { saveApolloUpdateMyTaskPricing } from '../../../../appRedux/actions/UpdateFlowAction';
import { yupFieldValidation } from '../../../../constants/utils';
import { mapKeys } from 'lodash';
import GlobalMdmFields from '../../../../components/GlobalMdmFields';
import {
    mytaskPricingRules,
    rejectRules,
} from '../../../../constants/FieldRules';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
} from '../../../../constants/WorkflowEnums';

import DynamicSelect from '../../../../components/DynamicSelect';
import { fetchPricingDropDownData } from '../../../../redux/DropDownDatas';
import Loading from '../../../../components/Loading';
import FlashMessage from '../../../../components/FlashMessage';
import MultiColorProgressBar from '../../../../components/MultiColorProgressBar';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../../appRedux/actions/Workflow';
import { getCustomerFromSAP } from '../../../../appRedux/actions';
import idx from 'idx';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
            reject: false,
            dropDownDatas: {},
            formData: { RejectionButton: false },
            formErrors: {},
        };
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: wf.WorkflowId,
            fuctionalGroup: 'pricing',
            taskId: wf.TaskId,
        };
        this.props.getStatusBarData(postJson);
        this.props.getCustomerFromSAP({
            WorkflowId: wf.WorkflowId,
            CustomerNumber: '',
            DivisionTypeId: 0,
            SystemTypeId: 0,
            DistributionChannelTypeId: 0,
            CompanyCodeTypeId: '',
            SalesOrgTypeId: 0,
        });
        fetchPricingDropDownData().then((res) =>
            this.setState({ dropDownDatas: res })
        );
    }

    setFormErrors = (isValid, key, errors) => {
        const { formErrors } = this.state;
        if (!isValid) {
            this.setState({ formErrors: { ...formErrors, [key]: errors } });
        } else {
            this.setState({ formErrors: { ...formErrors, [key]: null } });
        }
    };

    onFieldChange = (value, e) => {
        const { name } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value,
            },
        });
    };

    handleFormSubmission = (schema) => {
        let { TaskId, WorkflowId, formData } = this.state,
            postData = {};
        try {
            const WorkflowTaskModel = {
                RejectReason: formData['RejectionButton']
                    ? formData['RejectionReason']
                    : '',
                TaskId: TaskId,
                UserId: localStorage.getItem('userId'),
                WorkflowId: WorkflowId,
                WorkflowTaskOperationType: !formData['RejectionButton'] ? 1 : 2,
            };

            postData['formdata'] = {
                WorkflowTaskModel,
                Deltas: this.props.denormalizedDeltas || null,
            };

            this.props.saveApolloUpdateMyTaskPricing(
                postData,
                this.props.history
            );
            this.resetForm();
            this.scrollToTop();
        } catch (error) {
            console.log('form validtion error');
        }
    };

    onSubmit = (event, reject, schema) => {
        let { formData } = this.state;
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    RejectionButton: reject,
                },
            },
            () => {
                yupFieldValidation(
                    this.state.formData,
                    schema,
                    this.handleFormSubmission,
                    this.setFormErrors
                );
            }
        );
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    resetForm = () => {
        Object.keys(this.state.formData).map((key) => {
            this.setState({
                formData: {
                    [key]: '',
                },
            });
        });
        Object.keys(this.state.formErrors).map((key) => {
            this.setState({
                formErrors: {
                    [key]: '',
                },
            });
        });
        //restore initial values
        this.setState({
            formData: { RejectionButton: false },
        });
    };

    getValue = (name) => {
        const { bapi70CustData = {}, deltas = {} } = this.props;
        const { dropDownDatas } = this.state;
        if (deltas[name]) {
            return idx(
                dropDownDatas,
                (_) => _[name][deltas[name].UpdatedValue].description
            );
        } else if (bapi70CustData) {
            return idx(
                dropDownDatas,
                (_) => _[name][bapi70CustData.name].description
            );
        }
    };

    render() {
        const {
            width,
            location,
            history: { action },
            bapi70CustData = {},
            deltas = {},
            statusBarData,
            alert = {},
            TasksStatusByTeamId = null,
        } = this.props;

        const { dropDownDatas } = this.state;
        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                TasksStatusByTeamId === null ||
                !(TasksStatusByTeamId[8].WorkflowTaskStateTypeId === 2),
        };

        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;

        const showFunctionalDetail =
            state.isReadOnly && bapi70CustData === null
                ? { display: 'none' }
                : null;

        const showButtons = workflow.isReadOnly ? { display: 'none' } : null;

        const inputProps = {
            variant: 'outline',
            inline: true,
            type: 'text',
        };

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
                                value={bapi70CustData && bapi70CustData.Title}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                                value={
                                    bapi70CustData && bapi70CustData.WorkflowId
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
                                    bapi70CustData && bapi70CustData.MdmNumber
                                }
                            />
                        </Box>
                        <GlobalMdmFields formData={bapi70CustData} readOnly />

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
                                    delta={deltas['SystemType']}
                                    value={
                                        SystemType[
                                            bapi70CustData &&
                                                bapi70CustData.SystemType
                                        ]
                                    }
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Role"
                                    name="Role"
                                    delta={deltas['RoleTypeId']}
                                    value={
                                        RoleType[
                                            bapi70CustData &&
                                                bapi70CustData.RoleTypeId
                                        ]
                                    }
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="SalesOrg"
                                    delta={deltas['SalesOrgTypeId']}
                                    value={
                                        SalesOrgType[
                                            bapi70CustData &&
                                                bapi70CustData.SalesOrgTypeId
                                        ]
                                    }
                                    {...inputProps}
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
                                    delta={deltas['DistributionChannelTypeId']}
                                    value={
                                        DistributionChannelType[
                                            bapi70CustData &&
                                                bapi70CustData.DistributionChannelTypeId
                                        ]
                                    }
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Division"
                                    name="DivisionTypeId"
                                    delta={deltas['DivisionTypeId']}
                                    value={
                                        DivisionType[
                                            bapi70CustData &&
                                                bapi70CustData.DivisionTypeId
                                        ]
                                    }
                                    {...inputProps}
                                />
                                <FormInput
                                    label="CompanyCode"
                                    name="CompanyCodeTypeId"
                                    delta={deltas['CompanyCodeTypeId']}
                                    value={
                                        CompanyCodeType[
                                            bapi70CustData &&
                                                bapi70CustData.CompanyCodeTypeId
                                        ]
                                    }
                                    {...inputProps}
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
                                PRICING FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Special Pricing"
                                        name="SpecialPricingTypeId"
                                        delta={deltas['SpecialPricingTypeId']}
                                        getValue={this.getValue}
                                        {...inputProps}
                                    />

                                    <FormInput
                                        label="Dist Level Pricing"
                                        name="DistLevelTypeId"
                                        delta={deltas['DistLevelTypeId']}
                                        getValue={this.getValue}
                                        {...inputProps}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Additional Notes"
                                        multiline
                                        numberOfLines={2}
                                        name="AdditionalNotes"
                                        type="text"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AdditionalNotes'
                                                  ]
                                                : null
                                        }
                                        value={
                                            workflow.isReadOnly
                                                ? bapi70CustData &&
                                                  bapi70CustData.AdditionalNotes
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'AdditionalNotes'
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
                                    <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'RejectionReason'
                                                  ]
                                                : null
                                        }
                                        multiline
                                        numberOfLines={2}
                                        type="text"
                                        value={
                                            workflow.isReadOnly
                                                ? bapi70CustData &&
                                                  bapi70CustData.RejectionReason
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'RejectionReason'
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
                                onPress={(event) =>
                                    this.onSubmit(
                                        event,
                                        false,
                                        mytaskPricingRules
                                    )
                                }
                                title="Approve"
                            />
                            <Button
                                title="Reject"
                                onPress={(event) =>
                                    this.onSubmit(event, true, rejectRules)
                                }
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

const mapStateToProps = ({ workflows, myTasks, customer }) => {
    const { bapi70CustData, deltas, denormalizedDeltas } = customer;

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
        bapi70CustData,
        deltas,
        denormalizedDeltas,
    };
};

export default connect(mapStateToProps, {
    saveApolloUpdateMyTaskPricing,
    getFunctionalGroupData,
    getStatusBarData,
    getCustomerFromSAP,
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
