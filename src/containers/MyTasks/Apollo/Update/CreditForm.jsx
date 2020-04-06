import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    CheckBox,
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
    Column,
    Card,
    Button,
    Box,
    Text,
} from '../../../../components/common';
import { FormInput, FormSelect } from '../../../../components/form';
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
import DynamicSelect from '../../../../components/DynamicSelect';
import { fetchCreditDropDownData } from '../../../../redux/DropDownDatas';
import Loading from '../../../../components/Loading';
import FlashMessage from '../../../../components/FlashMessage';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import DeltaField from '../../../../components/DeltaField';

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
        getMockUpdateTaskDetail().then((res) => {
            this.setState({ data: res });
            console.log(res);
        });
        fetchCreditDropDownData().then((res) => {
            const data = res;
            this.setState({ dropDownDatas: data });
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

            alert = {},
            TasksStatusByTeamId = null,
        } = this.props;

        const {
            dropDownDatas,
            data: { CustomerData, Deltas = {} },
        } = this.state;
        const globalMdmDetail = CustomerData;
        console.log(Deltas);
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
        let disp_payterms = workflow.isReadOnly ? true : false;
        if (globalMdmDetail && globalMdmDetail.CategoryTypeId != undefined) {
            var source_category = parseInt(globalMdmDetail.CategoryTypeId);
            //direct , dropship , other
            if (
                source_category === CategoryTypesById.Direct ||
                source_category === CategoryTypesById['Drop Ship'] ||
                source_category === CategoryTypesById['Other']
            ) {
                disp_payterms = true;
            }
        }

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
                        <GlobalMdmFields
                            formData={globalMdmDetail}
                            readOnly
                            deltas={Deltas}
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
                                {Deltas['SystemType'] ? (
                                    <DeltaField delta={Deltas['SystemType']} />
                                ) : (
                                    <FormInput
                                        label="System"
                                        name="System"
                                        inline
                                        variant="outline"
                                        type="text"
                                        value={
                                            SystemType[
                                                globalMdmDetail &&
                                                    globalMdmDetail.SystemType
                                            ]
                                        }
                                    />
                                )}
                                {Deltas['RoleTypeId'] ? (
                                    <DeltaField delta={Deltas['RoleTypeId']} />
                                ) : (
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
                                )}

                                {Deltas['SalesOrgTypeId'] ? (
                                    <DeltaField
                                        delta={Deltas['SalesOrgTypeId']}
                                    />
                                ) : (
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
                                )}
                                <FormInput
                                    label="Purpose of Request"
                                    name="PurposeOfRequest"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                {Deltas['DistributionChannelTypeId'] ? (
                                    <DeltaField
                                        delta={
                                            Deltas['DistributionChannelTypeId']
                                        }
                                    />
                                ) : (
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
                                )}

                                {Deltas['DivisionTypeId'] ? (
                                    <DeltaField
                                        delta={Deltas['DivisionTypeId']}
                                    />
                                ) : (
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
                                )}

                                {Deltas['CompanyCodeTypeId'] ? (
                                    <DeltaField
                                        delta={Deltas['CompanyCodeTypeId']}
                                    />
                                ) : (
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
                                )}
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
                                    {disp_payterms &&
                                        (Deltas['PaymentTermsTypeId'] ? (
                                            <DeltaField
                                                delta={
                                                    Deltas['PaymentTermsTypeId']
                                                }
                                            />
                                        ) : (
                                            <FormInput
                                                label="Payment Terms"
                                                name="PaymentTermsTypeId"
                                                inline
                                                variant="outline"
                                                type="text"
                                            />
                                        ))}

                                    {Deltas['RiskCategoryTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['RiskCategoryTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Risk Category"
                                            name="RiskCategoryTypeId"
                                            inline
                                            variant="outline"
                                            type="text"
                                        />
                                    )}
                                    {Deltas['CreditRepGroupTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas['CreditRepGroupTypeId']
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="Credit Rep Group"
                                            name="CreditRepGroupTypeId"
                                            inline
                                            variant="outline"
                                            type="text"
                                        />
                                    )}
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['CreditLimit'] ? (
                                        <DeltaField
                                            delta={Deltas['CreditLimit']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Credit Limit"
                                            name="CreditLimit"
                                            maxLength={15}
                                            value={
                                                globalMdmDetail &&
                                                globalMdmDetail.CreditLimit
                                            }
                                            onChange={this.onFieldChange}
                                            variant={
                                                workflow.isReadOnly
                                                    ? 'outline'
                                                    : 'solid'
                                            }
                                            inline={
                                                workflow.isReadOnly
                                                    ? true
                                                    : false
                                            }
                                            type="text"
                                        />
                                    )}

                                    {Deltas['CredInfoNumber'] ? (
                                        <DeltaField
                                            delta={Deltas['CredInfoNumber']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Cred Info Number"
                                            name="CredInfoNumber"
                                            inline
                                            variant="outline"
                                            type="text"
                                        />
                                    )}

                                    {Deltas['PaymentIndex'] ? (
                                        <DeltaField
                                            delta={Deltas['PaymentIndex']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Payment Index"
                                            name="paymentIndex"
                                            inline
                                            variant="outline"
                                            type="text"
                                        />
                                    )}

                                    {Deltas['LastExtReview'] ? (
                                        <DeltaField
                                            delta={Deltas['LastExtReview']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Last Ext Review"
                                            name="LastExtReview"
                                            inline
                                            variant="outline"
                                            type="text"
                                        />
                                    )}

                                    {Deltas['Rating'] ? (
                                        <DeltaField delta={Deltas['Rating']} />
                                    ) : (
                                        <FormInput
                                            label="Rating"
                                            name="Rating"
                                            inline
                                            variant="outline"
                                            type="text"
                                        />
                                    )}
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
                                        maxLength={35}
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.ContactFirstName
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="ContactLastName"
                                        maxLength={35}
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.ContactLastName
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Telephone"
                                        name="ContactTelephone"
                                        maxLength={30}
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.ContactPhone
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Fax"
                                        name="ContactFax"
                                        maxLength={30}
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.ContactFax
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Email"
                                        name="ContactEmail"
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.ContactEmail
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
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
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
                                        type="text"
                                        onChange={this.onFieldChange}
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.AdditionalNotes
                                        }
                                    />
                                    <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        value={
                                            globalMdmDetail &&
                                            globalMdmDetail.RejectionReason
                                        }
                                        multiline
                                        numberOfLines={2}
                                        variant={
                                            workflow.isReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            workflow.isReadOnly ? true : false
                                        }
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

const mapStateToProps = ({ workflows, myTasks }) => {
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
    };
};

export default connect(mapStateToProps, {
    saveApolloMyTaskCredit,
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
