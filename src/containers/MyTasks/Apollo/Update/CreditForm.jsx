import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { Flex, Button, Box, Text } from '../../../../components/common';
import { FormInput } from '../../../../components/form';
import { saveApolloMyTaskCredit } from '../../../../appRedux/actions/MyTasks';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../../appRedux/actions/Workflow';
import { getMockUpdateTaskDetail } from '../../../../appRedux/sagas/config';

import { yupFieldValidation } from '../../../../constants/utils';

import GlobalMdmFields from '../../../../components/GlobalMdmFields';
import {
    mytaskCreditRules,
    rejectRules,
} from '../../../../constants/FieldRules';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
    CategoryTypesById,
} from '../../../../constants/WorkflowEnums';
import MultiColorProgressBar from '../../../../components/MultiColorProgressBar';
import { fetchCreditDropDownData } from '../../../../redux/DropDownDatas';
import Loading from '../../../../components/Loading';
import FlashMessage from '../../../../components/FlashMessage';
import DeltaField from '../../../../components/DeltaField';
import { getCustomerFromSAP } from '../../../../appRedux/actions';
import idx from 'idx';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
            data: {},
            reject: false,
            dropDownDatas: {},
            formData: { CreditLimit: '1', RejectionButton: false },
            formErrors: {},
        };
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: 'wf2', //wf.WorkflowId,
            fuctionalGroup: 'credit',
            taskId: wf.TaskId,
        };
        this.props.getStatusBarData(postJson);
        // this.props.getFunctionalGroupData(postJson);
        this.props.getCustomerFromSAP({
            WorkflowId: wf.WorkflowId,
            CustomerNumber: '',
            DivisionTypeId: 0,
            SystemTypeId: 0,
            DistributionChannelTypeId: 0,
            CompanyCodeTypeId: '',
            SalesOrgTypeId: 0,
        });
        fetchCreditDropDownData().then((res) => {
            const dropdata = res;
            this.setState({ dropDownDatas: dropdata });
        });
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

    handleDefaultValues = () => {
        let { formData } = this.state;
        let defaultValues = {};
        if (
            formData.CreditLimit === undefined ||
            formData.CreditLimit.trim().length === 0
        ) {
            defaultValues['CreditLimit'] = '1';
        }
        if (
            formData.PaymentTermsTypeId === undefined ||
            formData.PaymentTermsTypeId === 0
        ) {
            defaultValues['PaymentTermsTypeId'] = 3;
        }
        return defaultValues;
    };

    handleFormSubmission = (schema) => {
        let { TaskId, WorkflowId, formData } = this.state,
            castedFormData = {},
            postData = {};
        try {
            const WorkflowTaskModel = {
                RejectReason: formData['RejectionButton']
                    ? formData['RejectionReason']
                    : '',
                TaskId,
                UserId: localStorage.getItem('userId'),
                WorkflowId,
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

            this.props.saveApolloMyTaskCredit(postData);
            this.resetForm();
            this.scrollToTop();
        } catch (error) {
            console.log('form validtion error');
        }
    };

    onSubmit = (event, reject, schema) => {
        let { formData } = this.state;
        let defaults = this.handleDefaultValues();
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    ...defaults,
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
            formData: { CreditLimit: '1', RejectionButton: false },
        });
    };

    render() {
        const {
            width,
            location,
            bapi70CustData = {},
            deltas = {},
            alert = {},
            TasksStatusByTeamId = null,
        } = this.props;

        const { dropDownDatas } = this.state;
        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                TasksStatusByTeamId === null ||
                !(TasksStatusByTeamId[4].WorkflowTaskStateTypeId === 2),
        };

        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;
        const showCreditDetail = null;

        const showButtons = workflow.isReadOnly ? { display: 'none' } : null;
        let disp_payterms = !!workflow.isReadOnly;
        if (bapi70CustData && bapi70CustData.CategoryTypeId != undefined) {
            var source_category = parseInt(bapi70CustData.CategoryTypeId);
            //direct , dropship , other
            if (
                source_category === CategoryTypesById.Direct ||
                source_category === CategoryTypesById['Drop Ship'] ||
                source_category === CategoryTypesById['Other']
            ) {
                disp_payterms = true;
            }
        }

        const inputProps = {
            variant: 'outline',
            inline: true,
            type: 'text',
        };

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
                        <MultiColorProgressBar
                            readings={this.props.statusBarData}
                        />
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

                        <Box {...showCreditDetail}>
                            <Text
                                mt={5}
                                mb={2}
                                fontWeight="regular"
                                color="lightBlue"
                                fontSize={24}
                                pl={4}>
                                CREDIT FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {disp_payterms && (
                                        <FormInput
                                            label="Payment Terms"
                                            name="PaymentTermsTypeId"
                                            delta={deltas['PaymentTermsTypeId']}
                                            {...inputProps}
                                        />
                                    )}

                                    <FormInput
                                        label="Risk Category"
                                        delta={deltas['RiskCategoryTypeId']}
                                        name="RiskCategoryTypeId"
                                        value={
                                            bapi70CustData &&
                                            idx(
                                                dropDownDatas,
                                                (_) =>
                                                    _.RiskCategoryTypeId[
                                                        bapi70CustData
                                                            .RiskCategoryTypeId
                                                    ]
                                            )
                                        }
                                        {...inputProps}
                                    />
                                    <FormInput
                                        label="Credit Rep Group"
                                        name="CreditRepGroupTypeId"
                                        value={
                                            bapi70CustData &&
                                            idx(
                                                dropDownDatas,
                                                (_) =>
                                                    _.CreditRepGroupTypeId[
                                                        bapi70CustData
                                                            .CreditRepGroupTypeId
                                                    ]
                                            )
                                        }
                                        {...inputProps}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Credit Limit"
                                        name="CreditLimit"
                                        delta={deltas['CreditLimit']}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.CreditLimit
                                        }
                                        {...inputProps}
                                    />

                                    <FormInput
                                        label="Cred Info Number"
                                        name="CredInfoNumber"
                                        delta={deltas['CreditLimit']}
                                        {...inputProps}
                                    />

                                    <FormInput
                                        label="Payment Index"
                                        name="paymentIndex"
                                        delta={deltas['CreditLimit']}
                                        {...inputProps}
                                    />

                                    <FormInput
                                        label="Last Ext Review"
                                        name="LastExtReview"
                                        delta={deltas['CreditLimit']}
                                        {...inputProps}
                                    />

                                    <FormInput
                                        label="Rating"
                                        name="Rating"
                                        delta={deltas['CreditLimit']}
                                        {...inputProps}
                                    />
                                </Box>
                            </Box>

                            <Text
                                mt={5}
                                mb={2}
                                fontWeight="regular"
                                color="lightBlue"
                                fontSize={24}
                                pl={4}>
                                CONTACT FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="First Name"
                                        name="ContactFirstName"
                                        delta={deltas['ContactFirstName']}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.ContactFirstName
                                        }
                                        {...inputProps}
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="ContactLastName"
                                        delta={deltas['ContactLastName']}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.ContactLastName
                                        }
                                        {...inputProps}
                                    />
                                    <FormInput
                                        label="Telephone"
                                        name="ContactTelephone"
                                        delta={deltas['ContactTelephone']}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.ContactPhone
                                        }
                                        {...inputProps}
                                    />
                                    <FormInput
                                        label="Fax"
                                        name="ContactFax"
                                        delta={deltas['ContactFax']}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.ContactFax
                                        }
                                        {...inputProps}
                                    />
                                    <FormInput
                                        label="Email"
                                        name="ContactEmail"
                                        delta={deltas['ContactEmail']}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.ContactEmail
                                        }
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
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={!!workflow.isReadOnly}
                                        type="text"
                                        onChange={this.onFieldChange}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.AdditionalNotes
                                        }
                                    />
                                    <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        value={
                                            bapi70CustData &&
                                            bapi70CustData.RejectionReason
                                        }
                                        multiline
                                        numberOfLines={2}
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={!!workflow.isReadOnly}
                                        type="text"
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
                                        mytaskCreditRules
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
    const { bapi70CustData, deltas } = customer;
    const { fetching, alert, readOnly } = myTasks;
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
        readOnly,
        TasksStatusByTeamId,
        bapi70CustData,
        deltas,
    };
};

export default connect(mapStateToProps, {
    saveApolloMyTaskCredit,
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
