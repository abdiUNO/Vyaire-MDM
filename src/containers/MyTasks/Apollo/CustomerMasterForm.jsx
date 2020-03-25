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
} from '../../../components/common';
import { FormInput, FormSelect, Wrapper } from '../../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import GlobalMdmFields from '../../../components/GlobalMdmFields';
import DynamicSelect from '../../../components/DynamicSelect';
import { CheckBoxItem } from '../../../components/CheckBoxItem';
import debounce from 'lodash.debounce';
import {
    resolveDependencies,
    passFields,
    yupFieldValidation,
} from '../../../constants/utils';
import {
    yupglobalMDMFieldRules,
    mytaskCustomerMasterRules,
} from '../../../constants/FieldRules';
import { saveApolloMyTaskCustomerMaster } from '../../../appRedux/actions/MyTasks';
import { connect } from 'react-redux';
import { fetchCustomerMasterDropDownData } from '../../../redux/DropDownDatas';
import Loading from '../../../components/Loading';
import FlashMessage from '../../../components/FlashMessage';
import {
    RoleType,
    SalesOrgType,
    SystemType,
    DistributionChannelType,
    DivisionType,
    CompanyCodeType,
} from '../../../constants/WorkflowEnums';
import MultiColorProgressBar from '../../../components/MultiColorProgressBar';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../appRedux/actions/Workflow';

const userId = localStorage.getItem('userId');

class Page extends React.Component {
    constructor(props) {
        super(props);
        const editableProp = {
            inline: false,
            variant: 'solid',
            onChange: this.onFieldChange,
        };
        let { state: workflow } = this.props.location;
        let isWorkFlowReadOnly = this.props.location.state.isReadOnly;
        // let isWorkFlowReadOnly=false
        this.state = {
            isWorkFlowReadOnly: this.props.location.state.isReadOnly,
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
            loading: this.props.fetching,
            functionalGroupDetails: this.props.functionalGroupDetails,
            dropDownDatas: {},
            formData: {
                RejectionButton: false,
                displayINCOT2: isWorkFlowReadOnly ? true : false,
                display_LN: isWorkFlowReadOnly ? true : false,
                PaymentHistoryRecord: false,
                OrderCombination: false,
                TaxClassification: '2',
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
        this.props.getStatusBarData(wf.WorkflowId);
        this.props.getFunctionalGroupData(postJson);
        fetchCustomerMasterDropDownData().then(res => {
            const data = res;
            this.setState({ dropDownDatas: data });
        });
    }

    componentWillReceiveProps(newProps) {
        if (
            newProps.functionalGroupDetails !=
                this.props.functionalGroupDetails &&
            !this.state.isWorkFlowReadOnly
        ) {
            this.validateFromSourceData(
                newProps.functionalGroupDetails.Customer
            );
        }
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
        console.log(name);
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

    validateFromSourceData = source_data => {
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
            defaultValues['TaxClassification'] = '1 - Taxable';
        }
        return defaultValues;
    };

    handleFormSubmission = schema => {
        let { TaskId, WorkflowId, formData } = this.state,
            castedFormData = {};

        try {
            castedFormData = schema.cast(formData);
            const WorkflowTaskModel = {
                RejectReason: formData['RejectionButton']
                    ? formData['RejectionReason']
                    : '',
                TaskId: TaskId,
                UserId: localStorage.getItem('userId'),
                WorkflowId: WorkflowId,
                WorkflowTaskOperationType: !formData['RejectionButton'] ? 1 : 2,
            };
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
        Object.keys(this.state.formData).map(key => {
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
        Object.keys(this.state.formErrors).map(key => {
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
            functionalGroupDetails: {
                Customer: globalMdmDetail = {},
                CustomerMaster: customerMaster = null,
            },
            alert = {},
            statusBarData,
            WorkflowStateById = null,
        } = this.props;

        const { dropDownDatas, inputPropsForDefaultRules } = this.state;

        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                WorkflowStateById === null ||
                !(
                    globalMdmDetail.WorkflowStateTypeId === 2 &&
                    WorkflowStateById[3] === 2
                ),
        };

        const isWorkFlowReadOnly = workflow.isReadOnly;

        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;

        const showFunctionalDetail =
            state.isReadOnly && customerMaster === null
                ? { display: 'none' }
                : null;

        const enableDisplay = isWorkFlowReadOnly ? { display: 'none' } : null;

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
                        <GlobalMdmFields
                            formData={globalMdmDetail}
                            readOnly={true}
                            formErrors={this.state.formErrors}
                            onFieldChange={this.onFieldChange}
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
                                CUSTOMER MASTER FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Transportation Zone"
                                        name="TransporationZone"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TransporationZone'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                        required
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.TransporationZone
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'TransporationZone'
                                                  ]
                                                : null
                                        }
                                        variant="outline"
                                        inline
                                    />
                                    {this.state.formData['display_LN'] ? (
                                        <>
                                            <FormInput
                                                required
                                                label="License Number"
                                                name="License"
                                                maxLength={30}
                                                error={
                                                    this.state.formErrors
                                                        ? this.state.formErrors[
                                                              'License'
                                                          ]
                                                        : null
                                                }
                                                onBlur={this.onFieldChange}
                                                type="text"
                                                value={
                                                    isWorkFlowReadOnly
                                                        ? customerMaster &&
                                                          customerMaster.License
                                                        : this.state.formData
                                                        ? this.state.formData[
                                                              'License'
                                                          ]
                                                        : null
                                                }
                                                variant={
                                                    isWorkFlowReadOnly
                                                        ? 'outline'
                                                        : 'solid'
                                                }
                                                inline={
                                                    isWorkFlowReadOnly
                                                        ? true
                                                        : false
                                                }
                                            />
                                            <FormInput
                                                label="License Expiration Date"
                                                name="LicenseExpDate"
                                                onChange={(value, element) => {
                                                    element.preventDefault();
                                                    this.onFieldChange(
                                                        new Date(value)
                                                            .toJSON()
                                                            .slice(0, 19),
                                                        element
                                                    );
                                                }}
                                                error={
                                                    this.state.formErrors
                                                        ? this.state.formErrors[
                                                              'LicenseExpDate'
                                                          ]
                                                        : null
                                                }
                                                type="date"
                                                required
                                                value={
                                                    isWorkFlowReadOnly
                                                        ? customerMaster &&
                                                          customerMaster.LicenseExpDate &&
                                                          customerMaster.LicenseExpDate.split(
                                                              'T'
                                                          )[0]
                                                        : this.state.formData
                                                        ? this.state.formData[
                                                              'LicenseExpDate'
                                                          ]
                                                        : null
                                                }
                                                variant={
                                                    isWorkFlowReadOnly
                                                        ? 'outline'
                                                        : 'solid'
                                                }
                                                inline={
                                                    isWorkFlowReadOnly
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </>
                                    ) : null}
                                    <FormInput
                                        label="Search Term 1"
                                        name="SearchTerm1"
                                        maxLength={20}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SearchTerm1'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.SearchTerm1
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'SearchTerm1'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                    <FormInput
                                        label="Search Term 2"
                                        name="SearchTerm2"
                                        maxLength={20}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SearchTerm2'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.SearchTerm2
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'SearchTerm2'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />

                                    <FormInput
                                        label="Partner Function Number"
                                        name="PartnerFunctionNumber"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PartnerFunctionNumber'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.PartnerFunctionNumber
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'PartnerFunctionNumber'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Tax Number 2"
                                        name="TaxNumber2"
                                        maxLength={11}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TaxNumber2'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.TaxNumber2
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'TaxNumber2'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                    <FormInput
                                        label="Sort Key"
                                        name="SortKey"
                                        maxLength={3}
                                        onBlur={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SortKey'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                        defaultValue="099"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.SortKey
                                                : this.state.formData
                                                ? this.state.formData['SortKey']
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                    <FormInput
                                        label="Payment Methods"
                                        name="PaymentMethods"
                                        maxLength={10}
                                        onBlur={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PaymentMethods'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                        defaultValue="C"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.PaymentMethods
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'PaymentMethods'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                    <FormInput
                                        label="Acctg Clerk"
                                        name="AcctgClerk"
                                        maxLength={2}
                                        onBlur={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AcctgClerk'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                        defaultValue="01"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.AcctgClerk
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'AcctgClerk'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                    <FormInput
                                        label="Account Statement"
                                        name="AccountStatement"
                                        maxLength={1}
                                        defaultValue="2"
                                        onBlur={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AccountStatement'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.AccountStatement
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'AccountStatement'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />

                                    <FormInput
                                        label="Tax Classification"
                                        name="TaxClassification"
                                        maxLength={1}
                                        onBlur={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TaxClassification'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.TaxClassification
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'TaxClassification'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                </Box>
                            </Box>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.CustomerClassTypeId
                                        }
                                        label="Customer Class "
                                        name="CustomerClassTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerClassTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.CustomerClassTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'CustomerClassTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.CustomerPriceProcTypeId
                                        }
                                        label="CustPricProc "
                                        name="CustomerPriceProcTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerPriceProcTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            isWorkFlowReadOnly
                                                ? inputReadonlyProps
                                                : inputPropsForDefaultRules[
                                                      'CustomerPriceProcTypeId'
                                                  ]
                                        }
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.CustomerPriceProcTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'CustomerPriceProcTypeId'
                                                  ]
                                                : null
                                        }
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.IndustryCodeTypeId
                                        }
                                        label="IndustryCode 5"
                                        name="IndustryCodeTypeId"
                                        isRequired={false}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IndustryCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.IndustryCodeTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'IndustryCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.IndustryTypeId
                                        }
                                        label="Industry"
                                        name="IndustryTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IndustryTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.IndustryTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'IndustryTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.ReconAccountTypeId
                                        }
                                        label="Recon Account"
                                        name="ReconAccountTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ReconAccountTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.ReconAccountTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'ReconAccountTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.SalesOfficeTypeId
                                        }
                                        label="Sales Office"
                                        name="SalesOfficeTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SalesOfficeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.SalesOfficeTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'SalesOfficeTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.CustomerGroupTypeId
                                        }
                                        label="Customer Group"
                                        name="CustomerGroupTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.CustomerGroupTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'CustomerGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={
                                            isWorkFlowReadOnly
                                                ? inputReadonlyProps
                                                : inputPropsForDefaultRules[
                                                      'CustomerGroupTypeId'
                                                  ]
                                        }
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.PpcustProcTypeId
                                        }
                                        label="PP Cust Proc"
                                        name="PpcustProcTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PpcustProcTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.PpcustProcTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'PpcustProcTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />

                                    <FormInput
                                        label="Additional Notes"
                                        name="AdditionalNotes"
                                        onBlur={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AdditionalNotes'
                                                  ]
                                                : null
                                        }
                                        multiline
                                        numberOfLines={2}
                                        type="text"
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.AdditionalNotes
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'AdditionalNotes'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                    <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onBlur={this.onFieldChange}
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
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.RejectionReason
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'RejectionReason'
                                                  ]
                                                : null
                                        }
                                        variant={
                                            isWorkFlowReadOnly
                                                ? 'outline'
                                                : 'solid'
                                        }
                                        inline={
                                            isWorkFlowReadOnly ? true : false
                                        }
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.PriceListTypeId
                                        }
                                        label="Price List"
                                        name="PriceListTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PriceListTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.PriceListTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'PriceListTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={
                                            isWorkFlowReadOnly
                                                ? inputReadonlyProps
                                                : inputPropsForDefaultRules[
                                                      'PriceListTypeId'
                                                  ]
                                        }
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.DeliveryPriorityTypeId
                                        }
                                        label="Delivery Priority"
                                        name="DeliveryPriorityTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DeliveryPriorityTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.DeliveryPriorityTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'DeliveryPriorityTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.ShippingConditionsTypeId
                                        }
                                        label="Shipping Conditions"
                                        name="ShippingConditionsTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.ShippingConditionsTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={
                                            isWorkFlowReadOnly
                                                ? inputReadonlyProps
                                                : inputPropsForDefaultRules[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                        }
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.Incoterms1TypeId
                                        }
                                        label="Incoterms 1"
                                        name="Incoterms1TypeId"
                                        maxLength={28}
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'Incoterms1TypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.Incoterms1TypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'Incoterms1TypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    {this.state.formData['displayINCOT2'] ? (
                                        <FormInput
                                            label="Incoterms 2"
                                            name="Incoterms2"
                                            onBlur={this.onFieldChange}
                                            error={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'Incoterms2'
                                                      ]
                                                    : null
                                            }
                                            type="text"
                                            required
                                            value={
                                                isWorkFlowReadOnly
                                                    ? customerMaster &&
                                                      customerMaster.Incoterms2
                                                    : this.state.formData
                                                    ? this.state.formData[
                                                          'RejectionReason'
                                                      ]
                                                    : null
                                            }
                                            variant={
                                                isWorkFlowReadOnly
                                                    ? 'outline'
                                                    : 'solid'
                                            }
                                            inline={
                                                isWorkFlowReadOnly
                                                    ? true
                                                    : false
                                            }
                                        />
                                    ) : null}
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.AcctAssignmentGroupTypeId
                                        }
                                        label="Acct Assgmt Group"
                                        name="AcctAssignmentGroupTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AcctAssignmentGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.AcctAssignmentGroupTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'AcctAssignmentGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.PartnerFunctionTypeId
                                        }
                                        label="Partner Function"
                                        name="PartnerFunctionTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PartnerFunctionTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.PartnerFunctionTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'PartnerFunctionTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.AccountTypeId
                                        }
                                        label="Account Type"
                                        name="AccountTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AccountTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.AccountTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'AccountTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={
                                            isWorkFlowReadOnly
                                                ? inputReadonlyProps
                                                : inputPropsForDefaultRules[
                                                      'AccountTypeId'
                                                  ]
                                        }
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.ShippingCustomerTypeId
                                        }
                                        label="Shipping Customer Type"
                                        name="ShippingCustomerTypeId"
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ShippingCustomerTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        value={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  parseInt(
                                                      customerMaster.ShippingCustomerTypeId
                                                  )
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'ShippingCustomerTypeId'
                                                  ]
                                                : null
                                        }
                                        inputProps={inputReadonlyProps}
                                    />
                                    <CheckBoxItem
                                        title="Order Combination"
                                        name="OrderCombination"
                                        stateValue={
                                            isWorkFlowReadOnly
                                                ? customerMaster &&
                                                  customerMaster.OrderCombination
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
                                                ? customerMaster &&
                                                  customerMaster.PaymentHistoryRecord
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
                                onPress={event =>
                                    this.onSubmit(
                                        event,
                                        false,
                                        mytaskCustomerMasterRules
                                    )
                                }
                                title="Approve"
                            />
                            <Button
                                title="Reject"
                                onPress={event =>
                                    this.onSubmit(
                                        event,
                                        true,
                                        mytaskCustomerMasterRules
                                    )
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
        WorkflowStateById,
    } = workflows;
    return {
        fetchingfnGroupData,
        fetching,
        alert,
        statusBarData,
        functionalGroupDetails,
        WorkflowStateById,
    };
};

export default connect(mapStateToProps, {
    saveApolloMyTaskCustomerMaster,
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
