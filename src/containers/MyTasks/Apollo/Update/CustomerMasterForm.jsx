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
import GlobalMdmFields from '../../../../components/GlobalMdmFields';
import DynamicSelect from '../../../../components/DynamicSelect';
import { CheckBoxItem } from '../../../../components/CheckBoxItem';
import { yupFieldValidation } from '../../../../constants/utils';
import {
    mytaskCustomerMasterRules,
    rejectRules,
} from '../../../../constants/FieldRules';
import { saveApolloMyTaskCustomerMaster } from '../../../../appRedux/actions/MyTasks';
import { fetchCustomerMasterDropDownData } from '../../../../redux/DropDownDatas';
import Loading from '../../../../components/Loading';
import FlashMessage from '../../../../components/FlashMessage';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
} from '../../../../constants/WorkflowEnums';
import MultiColorProgressBar from '../../../../components/MultiColorProgressBar';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../../appRedux/actions/Workflow';
import { getCustomerFromSAP } from '../../../../appRedux/actions/Customer';
import { getMockUpdateTaskDetail } from '../../../../appRedux/sagas/config';
import DeltaField from '../../../../components/DeltaField';
import idx from 'idx';

class Page extends React.Component {
    constructor(props) {
        super(props);
        const editableProp = {
            inline: false,
            variant: 'solid',
            onChange: this.onFieldChange,
        };
        let { state } = this.props.location;
        let isWorkFlowReadOnly = this.props.location.state.isReadOnly;
        // let isWorkFlowReadOnly=false
        this.state = {
            isWorkFlowReadOnly: this.props.location.state.isReadOnly,
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
            loading: this.props.fetching,
            data: {},
            dropDownDatas: {},
            formData: {
                RejectionButton: false,
                displayINCOT2: isWorkFlowReadOnly ? true : false,
                display_LN: isWorkFlowReadOnly ? true : false,
                PaymentHistoryRecord: false,
                OrderCombination: false,
            },
            formErrors: {},
            inputPropsForDefaultRules: { CustomerGroupTypeId: editableProp },
        };
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: wf.WorkflowId,
            fuctionalGroup: 'customermaster',
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

        fetchCustomerMasterDropDownData(true).then((res) => {
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
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value,
                },
            },
            () => {
                if (
                    name === 'CustomerClassTypeId' ||
                    name === 'Incoterms1TypeId' ||
                    name === 'CustomerGroupTypeId'
                ) {
                    this.validateRules(name, value);
                }
            }
        );
    };

    parseAndHandleFieldChange = (value, e) => {
        const { name } = e.target;
        const val = parseInt(value, 10);
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: val,
            },
        });
    };

    setFormDataValues = (name, value) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value,
            },
        });
    };

    setInputPropsForDefaultRules = (field_name, property) => {
        this.setState({
            inputPropsForDefaultRules: {
                ...this.state.inputPropsForDefaultRules,
                [field_name]: property,
            },
        });
    };
    // display or set input/dropdowns values based on rules
    validateRules = (stateKey, stateVal) => {
        const readOnlyInputprop = { inline: true, variant: 'outline' };
        const editInputProp = {
            inline: false,
            variant: 'solid',
            onBlur: this.onFieldChange,
        };
        const readOnlyDropDown = { disabled: true };
        // check for CustomerPriceProcTypeId
        if (stateKey === 'CustomerClassTypeId') {
            var CC_val = stateVal;
            if (['1', '2', '3', '4', '5'].includes(CC_val)) {
                this.setFormDataValues('CustomerPriceProcTypeId', 2);
                this.setInputPropsForDefaultRules(
                    'CustomerPriceProcTypeId',
                    readOnlyDropDown
                );
            } else {
                this.setFormDataValues('CustomerPriceProcTypeId', '');
                this.setInputPropsForDefaultRules('CustomerPriceProcTypeId', {
                    disabled: false,
                });
            }
        }
        // check for incoterms2
        if (stateKey === 'Incoterms1TypeId') {
            var INCOT1_val = stateVal;
            if (INCOT1_val === '1') {
                this.setFormDataValues('displayINCOT2', true);
            } else {
                this.setFormDataValues('displayINCOT2', false);
            }
        }
        // check for AccountTypeId
        if (stateKey === 'CustomerGroupTypeId') {
            var cg_val = stateVal;
            const readOnlyDropDown = { disabled: true };
            if (cg_val === '1' || cg_val === '10') {
                this.setFormDataValues('AccountTypeId', '1');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (cg_val === '2' || cg_val === '7') {
                this.setFormDataValues('AccountTypeId', '2');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (
                cg_val === '3' ||
                cg_val === '4' ||
                cg_val === '6' ||
                cg_val === '11'
            ) {
                this.setFormDataValues('AccountTypeId', '3');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (cg_val === '8') {
                this.setFormDataValues('AccountTypeId', '6');
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else {
                this.setFormDataValues('AccountTypeId', '');
                this.setInputPropsForDefaultRules('AccountTypeId', {
                    disabled: false,
                });
            }
        }
    };

    validateFromSourceData = (source_data) => {
        const readOnlyDropDown = { disabled: true };
        const newStateValue = {},
            newStyleProps = {};
        //check License Number
        let d_LN_RegionsList = [
            'DE',
            'FL',
            'GA',
            'HI',
            'IL',
            'IN',
            'KS',
            'MA',
            'ME',
            'MN',
            'NC',
            'ND',
            'NE',
            'NM',
            'OH',
            'OK',
            'RI',
            'SD',
            'VT',
            'WA',
            'WV',
        ];
        if (
            source_data.RoleTypeId === 1 ||
            source_data.RoleTypeId === 2 ||
            source_data.RoleTypeId === 5 ||
            source_data.RoleTypeId === 6
        ) {
            newStateValue['display_LN'] = true;
            if (source_data.RoleTypeId === 5) {
                newStateValue['License'] = 'R-SALES REP EXEMPT';
                newStateValue['LicenseExpDate'] = '9999-12-31';
            } else if (source_data.Country != 'US') {
                newStateValue['License'] = 'I-INTERNATIONAL EXEMPT';
                newStateValue['LicenseExpDate'] = '9999-12-31';
            } else if (d_LN_RegionsList.includes(source_data.Region)) {
                newStateValue['License'] = 'S-IN STATE EXEMPT APPROVAL SM';
                newStateValue['LicenseExpDate'] = '9999-12-31';
            }
        }
        //check transportation zone
        let d_TransporationZone_RegionList = [
            'NS',
            'NT',
            'NU',
            'PE',
            'SK',
            'YT',
        ];
        if (source_data.Country === 'US' || source_data.Country === 'PR') {
            newStateValue[
                'TransporationZone'
            ] = source_data.PostalCode.substring(0, 3);
        } else if (
            source_data.Country === 'CA' &&
            d_TransporationZone_RegionList.includes(source_data.Region)
        ) {
            newStateValue['TransporationZone'] = 'INTL';
        } else if (source_data.Country === 'CA') {
            newStateValue['TransporationZone'] = source_data.Region;
        } else {
            newStateValue['TransporationZone'] = 'INTL';
        }

        //check price list
        if (source_data.Country != 'US') {
            newStateValue['PriceListTypeId'] = '5';
            newStyleProps['PriceListTypeId'] = readOnlyDropDown;
        } else {
            newStateValue['PriceListTypeId'] = '';
            newStyleProps['PriceListTypeId'] = { disabled: false };
        }

        //check Customer group
        if (source_data.CategoryTypeId != undefined) {
            let categoryTypeid = parseInt(source_data.CategoryTypeId);
            if (categoryTypeid === 2) {
                //if self-distributor
                newStateValue['CustomerGroupTypeId'] = '5';
                newStyleProps['CustomerGroupTypeId'] = readOnlyDropDown;
            } else if (categoryTypeid === 3 || categoryTypeid === 6) {
                //if oem or kitter
                newStateValue['CustomerGroupTypeId'] = '9';
                newStyleProps['CustomerGroupTypeId'] = readOnlyDropDown;
            } else if (categoryTypeid === 7) {
                // if dropship
                newStateValue['AccountTypeId'] = '3';
                newStyleProps['AccountTypeId'] = readOnlyDropDown;
                newStateValue['CustomerGroupTypeId'] = '11';
                newStyleProps['CustomerGroupTypeId'] = readOnlyDropDown;
            }
        }
        //check shipping conditions
        if (source_data.Country != 'US') {
            newStateValue['ShippingConditionsTypeId'] = '2';
            newStyleProps['ShippingConditionsTypeId'] = readOnlyDropDown;
        } else {
            newStateValue['ShippingConditionsTypeId'] = '1';
            newStyleProps['ShippingConditionsTypeId'] = readOnlyDropDown;
        }

        this.setState({
            formData: {
                ...this.state.formData,
                ...newStateValue,
            },
            inputPropsForDefaultRules: {
                ...this.state.inputPropsForDefaultRules,
                ...newStyleProps,
            },
        });
    };

    handleDefaultValues = () => {
        let { formData } = this.state;
        let defaultValues = {};
        if (
            formData.SortKey === undefined ||
            formData.SortKey.trim().length === 0
        ) {
            defaultValues['SortKey'] = '009';
        }
        if (
            formData.PaymentMethods === undefined ||
            formData.PaymentMethods.trim().length === 0
        ) {
            defaultValues['PaymentMethods'] = 'c';
        }
        if (
            formData.AcctgClerk === undefined ||
            formData.AcctgClerk.trim().length === 0
        ) {
            defaultValues['AcctgClerk'] = '01';
        }
        if (
            formData.AccountStatement === undefined ||
            formData.AccountStatement.trim().length === 0
        ) {
            defaultValues['AccountStatement'] = '2';
        }
        if (
            formData.TaxClassification === undefined ||
            formData.TaxClassification.trim().length === 0
        ) {
            defaultValues['TaxClassification'] = '1';
        }
        return defaultValues;
    };

    handleFormSubmission = (schema) => {
        let { TaskId, WorkflowId, formData } = this.state,
            castedFormData = {};

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
            delete castedFormData.displayINCOT2;
            delete castedFormData.display_LN;
            const postData = {
                WorkflowTaskModel,
                ...castedFormData,
            };

            this.props.saveApolloMyTaskCustomerMaster(postData);
            this.resetForm();
            this.scrollToTop();
        } catch (error) {
            console.log('customer master form approval error');
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
            var myitem = key;
            if (
                ![
                    'OrderCombination',
                    'PaymentHistoryRecord',
                    'RejectionButton',
                    'displayINCOT2',
                    'display_LN',
                ].includes(myitem)
            ) {
                this.setState({
                    formData: {
                        ...this.state.formData,
                        [key]: '',
                    },
                });
            } else {
                if (!['displayINCOT2', 'display_LN'].includes(myitem)) {
                    this.setState({
                        formData: {
                            ...this.state.formData,
                            [key]: false,
                        },
                    });
                }
            }
        });
        Object.keys(this.state.formErrors).map((key) => {
            this.setState({
                formErrors: {
                    [key]: '',
                },
            });
        });
    };

    render() {
        const {
            width,
            location,
            bapi70CustData = {},
            deltas = {},
            alert = {},
            statusBarData,
            TasksStatusByTeamId = null,
            fetching,
        } = this.props;

        const CustomerData = bapi70CustData;
        const Deltas = deltas;

        const { dropDownDatas, inputPropsForDefaultRules } = this.state;

        const inputsProps = {
            variant: 'outline',
            inline: true,
            type: 'text',
        };

        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                TasksStatusByTeamId === null ||
                !(TasksStatusByTeamId[3].WorkflowTaskStateTypeId === 2),
        };

        const isWorkFlowReadOnly = workflow.isReadOnly;

        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;

        const showFunctionalDetail =
            state.isReadOnly && CustomerData === null
                ? { display: 'none' }
                : null;

        const enableDisplay = isWorkFlowReadOnly ? { display: 'none' } : null;

        var bgcolor = alert.color || '#FFF';
        if (fetching) {
            return <Loading />;
        }

        console.log(deltas);

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
                                value={CustomerData && CustomerData.Title}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                                value={CustomerData && CustomerData.WorkflowId}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                                value={CustomerData && CustomerData.MdmNumber}
                                deltas={Deltas}
                            />
                        </Box>

                        <GlobalMdmFields
                            formData={CustomerData}
                            readOnly
                            taxEditable
                            formErrors={this.state.formErrors}
                            onFieldChange={this.onFieldChange}
                            deltas={deltas}
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
                                                CustomerData &&
                                                    CustomerData.SystemType
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
                                                CustomerData &&
                                                    CustomerData.RoleTypeId
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
                                                CustomerData &&
                                                    CustomerData.SalesOrgTypeId
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
                                            CustomerData &&
                                            CustomerData.DistributionChannel
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
                                                CustomerData &&
                                                    CustomerData.DivisionTypeId
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
                                                CustomerData &&
                                                    CustomerData.CompanyCodeTypeId
                                            ]
                                        }
                                    />
                                )}
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
                                CUSTOMER MASTER FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['TransporationZone'] ? (
                                        <DeltaField
                                            delta={Deltas['TransporationZone']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Transportation Zone"
                                            name="TransporationZone"
                                            value={
                                                CustomerData &&
                                                CustomerData.TransporationZone
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['License'] ? (
                                        <DeltaField delta={Deltas['License']} />
                                    ) : (
                                        <FormInput
                                            label="License Number"
                                            name="License"
                                            value={
                                                CustomerData &&
                                                CustomerData.License
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['LicenseExpDate'] ? (
                                        <DeltaField
                                            delta={Deltas['LicenseExpDate']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="License Expiration Date"
                                            name="LicenseExpDate"
                                            value={
                                                CustomerData &&
                                                CustomerData.LicenseExpDate
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['SearchTerm1'] ? (
                                        <DeltaField
                                            delta={Deltas['SearchTerm1']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Search Term 1"
                                            name="SearchTerm1"
                                            value={
                                                CustomerData &&
                                                CustomerData.SearchTerm1
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['SearchTerm2'] ? (
                                        <DeltaField
                                            delta={Deltas['SearchTerm2']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Search Term 2"
                                            name="SearchTerm2"
                                            value={
                                                CustomerData &&
                                                CustomerData.SearchTerm2
                                            }
                                            {...inputsProps}
                                        />
                                    )}
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['TaxNumber2'] ? (
                                        <DeltaField
                                            delta={Deltas['TaxNumber2']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Tax Number 2"
                                            name="TaxNumber2"
                                            value={
                                                CustomerData &&
                                                CustomerData.TaxNumber2
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['SortKey'] ? (
                                        <DeltaField delta={Deltas['SortKey']} />
                                    ) : (
                                        <FormInput
                                            label="Sort Key"
                                            name="SortKey"
                                            defaultValue="099"
                                            value={
                                                CustomerData &&
                                                CustomerData.SortKey
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['PaymentMethods'] ? (
                                        <DeltaField
                                            delta={Deltas['PaymentMethods']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Payment Methods"
                                            name="PaymentMethods"
                                            defaultValue="C"
                                            value={
                                                CustomerData &&
                                                CustomerData.PaymentMethods
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['AcctgClerk'] ? (
                                        <DeltaField
                                            delta={Deltas['AcctgClerk']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Acctg Clerk"
                                            name="AcctgClerk"
                                            defaultValue="01"
                                            value={
                                                CustomerData &&
                                                CustomerData.AcctgClerk
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['AccountStatement'] ? (
                                        <DeltaField
                                            delta={Deltas['AccountStatement']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Account Statement"
                                            name="AccountStatement"
                                            defaultValue="2"
                                            value={
                                                CustomerData &&
                                                CustomerData.AccountStatement
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['TaxClassification'] ? (
                                        <DeltaField
                                            delta={Deltas['TaxClassification']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Tax Classification"
                                            name="TaxClassification"
                                            defaultValue="1"
                                            value={
                                                CustomerData &&
                                                CustomerData.TaxClassification
                                            }
                                            {...inputsProps}
                                        />
                                    )}
                                </Box>
                            </Box>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['CustomerClassTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas['CustomerClassTypeId']
                                            }
                                            label="Customer Class "
                                        />
                                    ) : (
                                        <FormInput
                                            label="Customer Class "
                                            name="CustomerClassTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.CustomerClassTypeId[
                                                            CustomerData
                                                                .CustomerClassTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['CustomerPriceProcTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas[
                                                    'CustomerPriceProcTypeId'
                                                ]
                                            }
                                            label="Cust Pric Proc "
                                        />
                                    ) : (
                                        <FormInput
                                            label="Cust Pric Proc "
                                            name="CustomerPriceProcTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _
                                                            .CustomerPriceProcTypeId[
                                                            CustomerData
                                                                .CustomerPriceProcTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['IndustryCodeTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IndustryCodeTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="IndustryCode 5"
                                            name="IndustryCodeTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.IndustryCodeTypeId[
                                                            CustomerData
                                                                .IndustryCodeTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['IndustryTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IndustryTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Industry"
                                            name="IndustryTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.IndustryTypeId[
                                                            CustomerData
                                                                .IndustryCodeTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['ReconAccountTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['ReconAccountTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Recon Account"
                                            name="ReconAccountTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.ReconAccountTypeId[
                                                            CustomerData
                                                                .ReconAccountTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['SalesOfficeTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['SalesOfficeTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Sales Office"
                                            name="SalesOfficeTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.SalesOfficeTypeId[
                                                            CustomerData
                                                                .SalesOfficeTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}
                                    {Deltas['CustomerGroupTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas['CustomerGroupTypeId']
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="Customer Group"
                                            name="CustomerGroupTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.CustomerGroupTypeId[
                                                            CustomerData
                                                                .CustomerGroupTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['CustomerGroupTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas['CustomerGroupTypeId']
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="PP Cust Proc"
                                            name="PPCustProcTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.PPCustProcTypeId[
                                                            CustomerData
                                                                .PPCustProcTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['AdditionalNotes'] ? (
                                        <DeltaField
                                            delta={Deltas['AdditionalNotes']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Additional Notes"
                                            name="AdditionalNotes"
                                            value={
                                                CustomerData &&
                                                CustomerData.AdditionalNotes
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['RejectionReason'] ? (
                                        <DeltaField
                                            delta={Deltas['RejectionReason']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Rejection Reason"
                                            name="RejectionReason"
                                            value={
                                                CustomerData &&
                                                CustomerData.RejectionReason
                                            }
                                            {...inputsProps}
                                        />
                                    )}
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['PriceListTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['PriceListTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Price List"
                                            name="PriceListTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.PriceListTypeId[
                                                            CustomerData
                                                                .PriceListTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['DeliveryPriorityTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas['DeliveryPriorityTypeId']
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="Delivery Priority"
                                            name="DeliveryPriorityTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _
                                                            .DeliveryPriorityTypeId[
                                                            CustomerData
                                                                .DeliveryPriorityTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['ShippingConditionsTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas[
                                                    'ShippingConditionsTypeId'
                                                ]
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="Shipping Conditions"
                                            name="ShippingConditionsTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _
                                                            .ShippingConditionsTypeId[
                                                            CustomerData
                                                                .ShippingConditionsTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['Incoterms1TypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['Incoterms1TypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Incoterms 1"
                                            name="Incoterms1TypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.Incoterms1TypeId[
                                                            CustomerData
                                                                .Incoterms1TypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {this.state.formData['displayINCOT2'] &&
                                    CustomerData &&
                                    CustomerData.Incoterms1TypeId === 1 ? (
                                        Deltas['Incoterms2'] ? (
                                            <DeltaField
                                                delta={Deltas['Incoterms2']}
                                            />
                                        ) : (
                                            <FormInput
                                                label="Incoterms 2"
                                                name="Incoterms2"
                                                value={
                                                    CustomerData &&
                                                    idx(
                                                        dropDownDatas,
                                                        (_) =>
                                                            _.Incoterms2[
                                                                CustomerData
                                                                    .Incoterms2
                                                            ]
                                                    )
                                                }
                                                {...inputsProps}
                                            />
                                        )
                                    ) : null}

                                    {Deltas['AcctAssignmentGroupTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas[
                                                    'AcctAssignmentGroupTypeId'
                                                ]
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="Acct Assgmt Group"
                                            name="AcctAssignmentGroupTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _
                                                            .AcctAssignmentGroupTypeId[
                                                            CustomerData
                                                                .AcctAssignmentGroupTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}
                                    {console.log(
                                        idx(
                                            dropDownDatas,
                                            (_) =>
                                                _.AccountTypeId[
                                                    CustomerData.AccountTypeId
                                                ]
                                        )
                                    )}
                                    {Deltas['AccountTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['AccountTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Account Type"
                                            name="AccountTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _.AccountTypeId[
                                                            CustomerData
                                                                .AccountTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    {Deltas['ShippingCustomerTypeId'] ? (
                                        <DeltaField
                                            delta={
                                                Deltas['ShippingCustomerTypeId']
                                            }
                                        />
                                    ) : (
                                        <FormInput
                                            label="Shipping Customer Type"
                                            name="ShippingCustomerTypeId"
                                            value={
                                                CustomerData &&
                                                idx(
                                                    dropDownDatas,
                                                    (_) =>
                                                        _
                                                            .ShippingCustomerTypeId[
                                                            CustomerData
                                                                .ShippingCustomerTypeId
                                                        ]
                                                )
                                            }
                                            {...inputsProps}
                                        />
                                    )}

                                    <CheckBoxItem
                                        title="Order Combination"
                                        name="OrderCombination"
                                        stateValue={
                                            isWorkFlowReadOnly
                                                ? CustomerData &&
                                                  CustomerData.OrderCombination
                                                : this.state.formData &&
                                                  this.state.formData[
                                                      'OrderCombination'
                                                  ]
                                        }
                                        inputProps={enableDisplay}
                                        onValueChange={() =>
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    OrderCombination: !this
                                                        .state.formData
                                                        .OrderCombination,
                                                },
                                            })
                                        }
                                    />
                                    <CheckBoxItem
                                        title="Payment History Record"
                                        name="PaymentHistoryRecord"
                                        stateValue={
                                            isWorkFlowReadOnly
                                                ? CustomerData &&
                                                  CustomerData.PaymentHistoryRecord
                                                : this.state.formData &&
                                                  this.state.formData[
                                                      'PaymentHistoryRecord'
                                                  ]
                                        }
                                        inputProps={enableDisplay}
                                        onValueChange={() =>
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    PaymentHistoryRecord: !this
                                                        .state.formData
                                                        .PaymentHistoryRecord,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box {...enableDisplay}>
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
                                        mytaskCustomerDataRules
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
    };
};

export default connect(mapStateToProps, {
    saveApolloMyTaskCustomerMaster,
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
