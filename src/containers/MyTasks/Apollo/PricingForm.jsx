import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Button, Box, Text } from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { saveApolloMyTaskPricing } from '../../../appRedux/actions/MyTasks';
import { yupFieldValidation } from '../../../constants/utils';

import GlobalMdmFields from '../../../components/GlobalMdmFields';
import { mytaskPricingRules, rejectRules } from '../../../constants/FieldRules';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
} from '../../../constants/WorkflowEnums';

import DynamicSelect from '../../../components/DynamicSelect';
import { fetchPricingDropDownData } from '../../../redux/DropDownDatas';
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
        this.props.getFunctionalGroupData(postJson);
        fetchPricingDropDownData().then(res =>
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

    handleFormSubmission = schema => {
        let { TaskId, WorkflowId, formData } = this.state,
            castedFormData = {},
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
            if (!formData['RejectionButton']) {
                castedFormData = schema.cast(formData);
            } else {
                castedFormData = formData;
            }

            delete castedFormData.RejectionButton;
            postData['formdata'] = {
                WorkflowTaskModel,
                ...castedFormData,
            };

            this.props.saveApolloMyTaskPricing(postData, this.props.history);
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
        Object.keys(this.state.formData).map(key => {
            this.setState({
                formData: {
                    [key]: '',
                },
            });
        });
        Object.keys(this.state.formErrors).map(key => {
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

    render() {
        const {
            width,
            location,
            history: { action },
            functionalGroupDetails: {
                Customer: globalMdmDetail = {},
                Pricing: pricingDetail = null,
            },
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
                !(
                    globalMdmDetail.WorkflowStateTypeId === 2 &&
                    TasksStatusByTeamId[8].WorkflowTaskStateTypeId === 2
                ),
        };

        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;

        const showFunctionalDetail =
            state.isReadOnly && pricingDetail === null
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
                                label="WorkflowTitle"
                                name="WorkflowTitle"
                                variant="outline"
                                type="text"
                                value={globalMdmDetail && globalMdmDetail.WorkflowTitle}
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
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.SpecialPricingTypeId
                                        }
                                        label="Special Pricing"
                                        name="SpecialPricingTypeId"
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SpecialPricingTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            workflow.isReadOnly
                                                ? pricingDetail &&
                                                  parseInt(
                                                      pricingDetail.SpecialPricingTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'SpecialPricingTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.DistLevelTypeId
                                        }
                                        label="Dist Level Pricing"
                                        name="DistLevelTypeId"
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DistLevelTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            workflow.isReadOnly
                                                ? pricingDetail &&
                                                  parseInt(
                                                      pricingDetail.DistLevelTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'DistLevelTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
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
                                                ? pricingDetail &&
                                                  pricingDetail.AdditionalNotes
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
                                                ? pricingDetail &&
                                                  pricingDetail.RejectionReason
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
                                onPress={event =>
                                    this.onSubmit(
                                        event,
                                        false,
                                        mytaskPricingRules
                                    )
                                }
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
    saveApolloMyTaskPricing,
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
