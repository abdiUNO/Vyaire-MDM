import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StyleSheet,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { MaterialIcons } from '@expo/vector-icons';
import { Flex, Column, Card, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';
import {
    resolveDependencies,
    passFields,
    yupFieldValidation,
    yupAllFieldsValidation,
} from '../constants/utils';
import {
    yupglobalMDMFieldRules,
    mytaskCustomerMasterRules,
    mdmFieldsRules,
} from '../constants/FieldRules';
import {
    getCustomerDetail,
    getCustomerFromSAP,
} from '../appRedux/actions/Customer';
import { removeMessage } from '../appRedux/actions/Toast';
import GlobalMdmFields from '../components/GlobalMdmFields';
import SystemFields from '../components/SystemFields';
import { CheckBoxItem } from '../components/CheckBoxItem';
import DynamicSelect from '../components/DynamicSelect';
import { connect } from 'react-redux';
import { fetchCustomerMasterDropDownData } from '../redux/DropDownDatas';
import Loading from '../components/Loading';
import FlashMessage, { FlashMessages } from '../components/FlashMessage';
import { ajaxGetRequest } from '../appRedux/sagas/config';
import { updateDeltas } from '../appRedux/actions/UpdateFlowAction';
import FilesList from '../components/FilesList.js';
import FileInput from '../components/form/FileInput.jsx';

const _ = require('lodash');

const initFormdData = {
    SystemTypeId: 1,
};
class Page extends React.Component {
    constructor(props) {
        super(props);
        const editableProp = {
            inline: false,
            variant: 'solid',
            onChange: this.onFieldChange,
        };
        this.state = {
            system: '',
            role: '',
            dropDownDatas: {},
            pricing: [],
            customermaster: [],
            credit: [],
            contracts: [],
            globaltrade: [],
            formData: {
                displayINCOT2: false,
                display_LN: false,
                isContractsEnabled: false,
            },
            updatedFormData: { display: false },
            formErrors: {},
            inputPropsForDefaultRules: { CustomerGroupTypeId: editableProp },
            fileErrors: {},
            selectedFiles: {},
            selectedFilesIds: [],
            files: [],
            dunsData: {},
        };
    }

    generateWorkflowId() {
        const url =
            'https://jakegvwu5e.execute-api.us-east-2.amazonaws.com/dev';

        ajaxGetRequest(url).then((res) => {
            if (res.IsSuccess)
                this.setState({
                    fetchingWorkflowId: false,
                    formData: {
                        ...initFormdData,
                        ...this.state.formData,
                        WorkflowId: res.ResultData,
                        UserId: this.state.userId,
                    },
                });
        });
    }

    componentDidMount() {
        fetchCustomerMasterDropDownData().then((res) => {
            const data = res;
            this.setState({ dropDownDatas: data }, this.generateWorkflowId);
        });
        const { state } = this.props.location;
        var jsonBody = state.sysFieldsData;
        this.createDunsObj();
        this.props.getCustomerFromSAP(jsonBody);
        this.validateFromSourceData(state.globalMdmDetail);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.bapi70CustData != this.props.bapi70CustData) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    ...newProps.bapi70CustData,
                },
            });
        }
    }

    formatDeltaObj = () => {
        let customerDataModel = {},
            functionElements = [],
            teams = [
                'pricing',
                'customermaster',
                'contract',
                'credit',
                'globaltrade',
            ];
        for (var i = 0; i < teams.length; i++) {
            let team = teams[i];
            if (this.state[team] != undefined && this.state[team].length > 0) {
                let functionalDelta = {};
                functionalDelta['functionName'] = team;
                functionalDelta['customerElements'] = this.state[team];
                functionElements.push(functionalDelta);
            }
        }
        customerDataModel['functionElements'] = functionElements;
        return customerDataModel;
    };

    proceedAction = () => {
        const { history, location } = this.props;
        const { state } = location;
        const { formData, selectedFilesIds, selectedFiles } = this.state;
        let customerDataModel = this.formatDeltaObj();
        let data = {
            userId: localStorage.getItem('userId'),
            workflowId: formData.WorkflowId,
            mdmCustomerId: state.MdmNumber,
            WorkflowTitle: '',
            SystemRecordId: state.sysFieldsData.CustomerNumber,
            SystemTypeId: state.sysFieldsData.SystemTypeId,
            RoleTypeId: state.sysFieldsData.RoleTypeId,
            SalesOrgTypeId: state.sysFieldsData.SalesOrgTypeId,
            WorkflowType: 21,
            IsSaveToWorkflow: true,
            DUNSData: this.state.dunsData,
            customerDataModel,
        };
        let postData = {
            data,
            files: selectedFilesIds.map((id) => selectedFiles[id]),
            history,
        };
        this.props.updateDeltas(postData);
    };

    onSubmit = () => {
        let {
            formData,
            updatedFormData,
            selectedFilesIds,
            selectedFiles,
        } = this.state;
        const { Category, ...data } = formData;
        let fileErrors = {};
        let errors = false;

        selectedFilesIds.map((id) => {
            if (selectedFiles[id] && selectedFiles[id].DocumentType <= 0) {
                fileErrors[id] = 'Document Type Required for file';
                errors = true;
            }
        });

        this.setState({ fileErrors, isFileErrors: errors });

        this.setState(
            {
                formData: {
                    ...data,
                },
            },
            () => {
                yupAllFieldsValidation(
                    { ...updatedFormData },
                    mdmFieldsRules,
                    (...rest) => {
                        if (this.state.isFileErrors === false)
                            this.proceedAction(...rest);
                    },
                    this.setFormErrors
                );
            }
        );
    };
    selectFile = (events) => {
        event.preventDefault();

        const { selectedFilesIds, selectedFiles } = this.state;
        const id = events.target.files[0].name;

        this.setState({
            selectedFiles: {
                ...selectedFiles,
                [id]: {
                    data: events.target.files[0],
                    DocumentName: events.target.files[0].name,
                    DocumentType: 0,
                },
            },
            selectedFilesIds: [...selectedFilesIds, id],
            filename: events.target.files[0].name,
        });
    };

    isNumber = (n) => {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    };

    createDunsObj = (name = null, val = null) => {
        const { state } = this.props.location;

        if (name === null || val === null) {
            this.setState({
                dunsData: {
                    Country: state.globalMdmDetail.Country,
                    Name1: state.globalMdmDetail.Name1,
                    City: state.globalMdmDetail.City,
                    Region: state.globalMdmDetail.Region,
                    Street: state.globalMdmDetail.Street,
                    DunsNumber: state.globalMdmDetail.DunsNumber,
                    SicCode4: state.globalMdmDetail.SicCode4,
                    SicCode6: state.globalMdmDetail.SicCode6,
                    SicCode8: state.globalMdmDetail.SicCode8,
                    TaxNumber: state.globalMdmDetail.TaxNumber,
                    VatRegNo: state.globalMdmDetail.VatRegNo,
                    NaisCode: state.globalMdmDetail.NaicsCode,
                    NaisCodeDescription:
                        state.globalMdmDetail.NaicsCodeDescription,
                },
            });
        } else {
            this.setState({
                dunsData: {
                    ...this.state.dunsData,
                    [name]: val,
                },
            });
        }
    };
    onFieldChange = (value, e) => {
        const { name } = e.target;
        var team =
            e.target.getAttribute('team') ||
            e.target.selectedOptions[0].getAttribute('team');
        var formDataValue = this.isNumber(value) ? parseInt(value, 10) : value;
        let origdata = this.props.bapi70CustData;
        if (origdata[name] != value) {
            let newDeltaValue = {
                name: name,
                originalValue: origdata[name],
                updatedValue: value,
            };
            let teamsDelta = this.state[team];
            let filterTeamDelta = teamsDelta.filter(
                (delta) => delta.name != name
            );

            this.setState(
                (state) => {
                    const list = [...filterTeamDelta, newDeltaValue];
                    return {
                        ...this.state,
                        updatedFormData: {
                            ...this.state.updatedFormData,
                            [name]: value,
                        },
                        [team]: list,
                        formData: {
                            ...this.state.formData,
                            [name]: formDataValue,
                        },
                    };
                },
                () => {
                    if (
                        name === 'CustomerClassTypeId' ||
                        name === 'Incoterms1TypeId' ||
                        name === 'CustomerGroupTypeId'
                    ) {
                        this.validateRules(name, value);
                    } else if (
                        name === 'DunsNumber' ||
                        name === 'SicCode4' ||
                        name === 'SicCode6' ||
                        name === 'SicCode8' ||
                        name === 'VatRegNo' ||
                        name === 'TaxNumber' ||
                        name === 'NaisCode' ||
                        name === 'NaisCodeDescription'
                    ) {
                        this.createDunsObj(name, value);
                    }
                }
            );
        }
    };

    setFormErrors = (errors) => {
        const { formErrors } = this.state;
        this.setState({ formErrors: errors });
    };

    setFormDataValues = (name, value) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value,
            },
        });
    };
    setFunctionalTeamDeltaObject = (
        key = null,
        fieldValue = null,
        team = null
    ) => {
        let value = fieldValue;
        //set checkbox item fieldChange
        if (fieldValue === null) {
            var currentBooleanValue =
                this.state.formData[key].length != 0 &&
                !Boolean(this.state.formData[key])
                    ? JSON.parse(this.state.formData[key].toLowerCase())
                    : this.state.formData[key];
            value = !currentBooleanValue;
        }
        let origdata = this.props.bapi70CustData;
        var formDataValue = this.isNumber(value) ? parseInt(value, 10) : value;
        let newDeltaValue = {
            name: key,
            originalValue: origdata[key],
            updatedValue: value,
        };
        let teamsDelta = this.state[team];
        let filterTeamDelta = teamsDelta.filter((delta) => delta.name != key);
        this.setState((state) => {
            const list = [...filterTeamDelta, newDeltaValue];
            return {
                ...this.state,
                updatedFormData: {
                    ...this.state.updatedFormData,
                    [key]: value,
                },
                [team]: list,
                formData: {
                    ...this.state.formData,
                    [key]: formDataValue,
                },
            };
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
            onChange: this.onFieldChange,
        };
        const readOnlyDropDown = { disabled: true };
        // check for CustomerPriceProcTypeId
        if (stateKey === 'CustomerClassTypeId') {
            var CC_val = stateVal;
            if (['1', '2', '3', '4', '5'].includes(CC_val)) {
                this.setFunctionalTeamDeltaObject(
                    'CustomerPriceProcTypeId',
                    '2',
                    'customermaster'
                );
                this.setInputPropsForDefaultRules(
                    'CustomerPriceProcTypeId',
                    readOnlyDropDown
                );
            } else {
                this.setFunctionalTeamDeltaObject(
                    'CustomerPriceProcTypeId',
                    '',
                    'customermaster'
                );
                this.setInputPropsForDefaultRules('CustomerPriceProcTypeId', {
                    disabled: false,
                });
            }
        }
        // check for incoterms2
        if (stateKey === 'Incoterms1TypeId' && !this.state.isContractsEnabled) {
            var INCOT1_val = stateVal;
            if (INCOT1_val === '1') {
                this.setFormDataValues('displayINCOT2', true);
            } else {
                this.setFormDataValues('displayINCOT2', false);
            }
        }
        // check for AccountTypeId
        if (stateKey === 'CustomerGroupTypeId') {
            var team = this.state.isContractsEnabled
                ? 'contracts'
                : 'customermaster';
            var cg_val = stateVal;
            const readOnlyDropDown = { disabled: true };
            if (cg_val === '1' || cg_val === '10') {
                this.setFunctionalTeamDeltaObject('AccountTypeId', '1', team);
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (cg_val === '2' || cg_val === '7') {
                this.setFunctionalTeamDeltaObject('AccountTypeId', '2', team);
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
                this.setFunctionalTeamDeltaObject('AccountTypeId', '3', team);
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else if (cg_val === '8') {
                this.setFunctionalTeamDeltaObject('AccountTypeId', '6', team);
                this.setInputPropsForDefaultRules(
                    'AccountTypeId',
                    readOnlyDropDown
                );
            } else {
                this.setFunctionalTeamDeltaObject('AccountTypeId', '', team);
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
        let categoryTypeid = parseInt(source_data.CategoryTypeId);
        //check if Category = Distributor, OEM, Kitter, Self-Distributor then Contract else Customermaster
        if (
            categoryTypeid === 1 ||
            categoryTypeid === 2 ||
            categoryTypeid === 3 ||
            categoryTypeid === 6
        ) {
            newStateValue['isContractsEnabled'] = true;
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

    render() {
        const { width, height, marginBottom, location, alert } = this.props;
        const {
            dropDownDatas,
            inputPropsForDefaultRules,
            selectedFilesIds,
            selectedFiles,
        } = this.state;
        const { state } = location;

        let disp_payterms = false;
        if (this.state && this.state.formData.Category != undefined) {
            var source_category = this.state.formData.Category.toLowerCase();
            if (
                source_category === 'direct' ||
                source_category === 'dropship' ||
                source_category === 'other'
            ) {
                disp_payterms = true;
            }
        }
        var bgcolor = alert.color || '#FFF';

        if (this.props.fetching)
            return (
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="650px"
                    bg="#eff3f6">
                    <FlashMessages
                        toasts={this.props.toasts}
                        onDismiss={this.props.removeMessage}
                    />
                    <View>
                        <ActivityIndicator size="large" />
                    </View>
                </Box>
            );
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <FlashMessages
                    toasts={this.props.toasts}
                    onDismiss={this.props.removeMessage}
                />
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <Box fullHeight my={2}>
                        <Box
                            flexDirection="row"
                            justifyContent="space-around"
                            my={4}
                            alignItems="center">
                            <FormInput
                                padding="8px 25px 0px 25px"
                                style={{ lineHeight: '2', paddingBottom: 0 }}
                                flex={1 / 4}
                                mb={2}
                                label="Title"
                                name="Title"
                                variant="outline"
                                type="text"
                                value={this.state.formData.Title || ''}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="WorkflowId"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={this.state.formData.WorkflowId || ''}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="MdmNumber"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={state.MdmNumber || ''}
                            />
                        </Box>

                        <GlobalMdmFields
                            formData={state.globalMdmDetail}
                            readOnly
                        />

                        <React.Fragment key="customer-master">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
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
                                        team="customermaster"
                                        readOnly
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TransporationZone'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        value={
                                            this.state.formData[
                                                'TransporationZone'
                                            ]
                                        }
                                        variant="outline"
                                        inline
                                    />

                                    <FormInput
                                        label="Search Term 1"
                                        name="SearchTerm1"
                                        variant="solid"
                                        team="customermaster"
                                        maxLength={20}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SearchTerm1'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SearchTerm1'
                                                  ]
                                                : null
                                        }
                                        onBlur={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Search Term 2"
                                        name="SearchTerm2"
                                        maxLength={20}
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SearchTerm2'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SearchTerm2'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Partner Function Number"
                                        name="PartnerFunctionNumber"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PartnerFunctionNumber'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PartnerFunctionNumber'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />

                                    <FormInput
                                        label="DUNS Number"
                                        name="DunsNumber"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'DunsNumber'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DunsNumber'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                    />

                                    <FormInput
                                        label="SIC Code 4"
                                        name="SicCode4"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SicCode4'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SicCode4'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                    />

                                    <FormInput
                                        label="SIC Code 6"
                                        name="SicCode4"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SicCode6'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SicCode4'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                    />
                                    <FormInput
                                        label="SIC Code 8"
                                        name="SicCode8"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SicCode8'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SicCode8'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                    />

                                    <FormInput
                                        label="NAICS Code"
                                        name="NaicsCode"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'NaicsCode'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'NaicsCode'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                    />
                                    <FormInput
                                        label="Vat Reg No"
                                        name="VatRegNo"
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'VatRegNo'
                                                  ]
                                                : null
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'VatRegNo'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
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
                                        team="customermaster"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'TaxNumber2'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TaxNumber2'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Sort Key"
                                        name="SortKey"
                                        team="customermaster"
                                        maxLength={3}
                                        defaultValue="099"
                                        value={
                                            this.state.formData
                                                ? this.state.formData['SortKey']
                                                : null
                                        }
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SortKey'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Payment Methods"
                                        name="PaymentMethods"
                                        team="customermaster"
                                        maxLength={10}
                                        defaultValue="C"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PaymentMethods'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PaymentMethods'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Acctg Clerk"
                                        name="AcctgClerk"
                                        team="customermaster"
                                        maxLength={2}
                                        defaultValue="01"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AcctgClerk'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AcctgClerk'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />
                                    <FormInput
                                        label="Account Statement"
                                        name="AccountStatement"
                                        team="customermaster"
                                        maxLength={1}
                                        defaultValue="2"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AccountStatement'
                                                  ]
                                                : null
                                        }
                                        variant="solid"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AccountStatement'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />

                                    <FormInput
                                        label="Tax Classification"
                                        name="TaxClassification"
                                        defaultValue="1"
                                        maxLength={1}
                                        team="customermaster"
                                        variant="solid"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'TaxClassification'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'TaxClassification'
                                                  ]
                                                : null
                                        }
                                        type="text"
                                        required
                                    />
                                </Box>
                            </Box>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CustomerClassTypeId
                                        }
                                        label="Customer Class "
                                        name="CustomerClassTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CustomerClassTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CustomerClassTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CustomerPriceProcTypeId
                                        }
                                        label="CustPricProc "
                                        name="CustomerPriceProcTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CustomerPriceProcTypeId'
                                                  ]
                                                : null
                                        }
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
                                            inputPropsForDefaultRules[
                                                'CustomerPriceProcTypeId'
                                            ]
                                        }
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.IndustryCodeTypeId
                                        }
                                        label="IndustryCode 5"
                                        name="IndustryCodeTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'IndustryCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={false}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IndustryCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.IndustryTypeId
                                        }
                                        label="Industry"
                                        name="IndustryTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'IndustryTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'IndustryTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.ReconAccountTypeId
                                        }
                                        label="Recon Account"
                                        name="ReconAccountTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'ReconAccountTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ReconAccountTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.SalesOfficeTypeId
                                        }
                                        label="Sales Office"
                                        name="SalesOfficeTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'SalesOfficeTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SalesOfficeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    {!this.state.isContractsEnabled && (
                                        <DynamicSelect
                                            team="customermaster"
                                            arrayOfData={
                                                dropDownDatas.CustomerGroupTypeId
                                            }
                                            label="Customer Group"
                                            name="CustomerGroupTypeId"
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'CustomerGroupTypeId'
                                                      ]
                                                    : null
                                            }
                                            isRequired={true}
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'CustomerGroupTypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                            inputProps={
                                                inputPropsForDefaultRules[
                                                    'CustomerGroupTypeId'
                                                ]
                                            }
                                        />
                                    )}
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.PpcustProcTypeId
                                        }
                                        label="PP Cust Proc"
                                        name="PpcustProcTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PpcustProcTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PpcustProcTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.PriceListTypeId
                                        }
                                        label="Price List"
                                        name="PriceListTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PriceListTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PriceListTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'PriceListTypeId'
                                            ]
                                        }
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.CompanyCodeTypeId
                                        }
                                        label="Company Code"
                                        name="CompanyCodeTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'CompanyCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CompanyCodeTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.DeliveryPriorityTypeId
                                        }
                                        label="Delivery Priority"
                                        name="DeliveryPriorityTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'DeliveryPriorityTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DeliveryPriorityTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.ShippingConditionsTypeId
                                        }
                                        label="Shipping Conditions"
                                        name="ShippingConditionsTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ShippingConditionsTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        inputProps={
                                            inputPropsForDefaultRules[
                                                'ShippingConditionsTypeId'
                                            ]
                                        }
                                    />
                                    {!this.state.isContractsEnabled && (
                                        <DynamicSelect
                                            team="customermaster"
                                            arrayOfData={
                                                dropDownDatas.Incoterms1TypeId
                                            }
                                            label="Incoterms 1"
                                            name="Incoterms1TypeId"
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'Incoterms1TypeId'
                                                      ]
                                                    : null
                                            }
                                            isRequired={true}
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'Incoterms1TypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                        />
                                    )}
                                    {this.state.formData['displayINCOT2'] ? (
                                        <FormInput
                                            team="customermaster"
                                            label="Incoterms 2"
                                            name="Incoterms2"
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'Incoterms2'
                                                      ]
                                                    : null
                                            }
                                            variant="solid"
                                            onChange={this.onFieldChange}
                                            error={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'Incoterms2'
                                                      ]
                                                    : null
                                            }
                                            type="text"
                                            required
                                        />
                                    ) : null}
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.AcctAssignmentGroupTypeId
                                        }
                                        label="Acct Assgmt Group"
                                        name="AcctAssignmentGroupTypeId"
                                        isRequired={true}
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'AcctAssignmentGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'AcctAssignmentGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.PartnerFunctionTypeId
                                        }
                                        label="Partner Function"
                                        name="PartnerFunctionTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'PartnerFunctionTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'PartnerFunctionTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    {!this.state.isContractsEnabled && (
                                        <DynamicSelect
                                            team="customermaster"
                                            arrayOfData={
                                                dropDownDatas.AccountTypeId
                                            }
                                            label="Account Type"
                                            name="AccountTypeId"
                                            isRequired={true}
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'AccountTypeId'
                                                      ]
                                                    : null
                                            }
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'AccountTypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                            inputProps={
                                                inputPropsForDefaultRules[
                                                    'AccountTypeId'
                                                ]
                                            }
                                        />
                                    )}
                                    <DynamicSelect
                                        team="customermaster"
                                        arrayOfData={
                                            dropDownDatas.ShippingCustomerTypeId
                                        }
                                        label="Shipping Customer Type"
                                        name="ShippingCustomerTypeId"
                                        value={
                                            this.state.formData
                                                ? this.state.formData[
                                                      'ShippingCustomerTypeId'
                                                  ]
                                                : null
                                        }
                                        isRequired={true}
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ShippingCustomerTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <CheckBoxItem
                                        team="customermaster"
                                        title="Order Combination"
                                        name="OrderCombination"
                                        stateValue={
                                            this.state.formData.OrderCombination
                                        }
                                        onValueChange={() =>
                                            this.setFunctionalTeamDeltaObject(
                                                'OrderCombination',
                                                null,
                                                'customermaster'
                                            )
                                        }
                                    />
                                    <CheckBoxItem
                                        team="customermaster"
                                        title="Payment History Record"
                                        name="PaymentHistoryRecord"
                                        stateValue={
                                            this.state.formData
                                                .PaymentHistoryRecord
                                        }
                                        onValueChange={() =>
                                            this.setFunctionalTeamDeltaObject(
                                                'PaymentHistoryRecord',
                                                null,
                                                'customermaster'
                                            )
                                        }
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                        <React.Fragment key="credit">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
                                CREDIT FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {!this.state.isContractsEnabled && (
                                        <DynamicSelect
                                            arrayOfData={
                                                dropDownDatas.PaymentTermsTypeId
                                            }
                                            label="Payment Terms"
                                            name="PaymentTermsTypeId"
                                            team="credit"
                                            value={
                                                this.state.formData
                                                    ? this.state.formData[
                                                          'PaymentTermsTypeId'
                                                      ]
                                                    : null
                                            }
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'PaymentTermsTypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                        />
                                    )}
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.riskCategoryTypeId
                                        }
                                        label="Risk Category"
                                        team="credit"
                                        name="RiskCategoryTypeId"
                                        value={
                                            this.state.formData &&
                                            (this.state.formData[
                                                'RiskCategoryTypeId'
                                            ] ||
                                                this.state.formData[
                                                    'RiskCategoryTypeId'
                                                ])
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'RiskCategoryTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.creditRepGroupTypeId
                                        }
                                        label="Credit Rep Group"
                                        team="credit"
                                        name="CreditRepGroupTypeId"
                                        value={
                                            this.state.formData &&
                                            (this.state.formData[
                                                'CreditRepGroupTypeId'
                                            ] ||
                                                this.state.formData[
                                                    'CreditRepGroupTypeId'
                                                ])
                                        }
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CreditRepGroupTypeId'
                                                  ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="Credit Limit"
                                        team="credit"
                                        name="CreditLimit"
                                        value={
                                            this.state.formData[
                                                'CreditLimit'
                                            ] ||
                                            this.state.formData['CreditLimit']
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'CreditLimit'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        variant="solid"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Cred Info Number"
                                        name="CredInfoNumber"
                                        team="credit"
                                        value={
                                            this.state.formData[
                                                'CredInfoNumber'
                                            ]
                                        }
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Payment Index"
                                        name="PaymentIndex"
                                        team="credit"
                                        value={
                                            this.state.formData[
                                                'PaymentIndex'
                                            ] ||
                                            this.state.formData['PaymentIndex']
                                        }
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Last Ext Review"
                                        name="LastExtReview"
                                        team="credit"
                                        value={
                                            this.state.formData['LastExtReview']
                                        }
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label="Rating"
                                        name="Rating"
                                        team="credit"
                                        value={this.state.formData['Rating']}
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                        <React.Fragment key="Contact Info">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
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
                                        team="credit"
                                        variant="solid"
                                        value={
                                            this.state.formData.ContactFirstName
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactFirstName'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="ContactLastName"
                                        team="credit"
                                        variant="solid"
                                        value={
                                            this.state.formData.ContactLastName
                                        }
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactLastName'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Telephone"
                                        name="ContactTelephone"
                                        team="credit"
                                        value={
                                            this.state.formData
                                                .ContactTelephone ||
                                            this.state.formData.ContactPhone
                                        }
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactTelephone'
                                                  ]
                                                : null
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
                                        label="Fax"
                                        name="ContactFax"
                                        team="credit"
                                        value={this.state.formData.ContactFax}
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactFax'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                    <FormInput
                                        label="Email"
                                        name="ContactEmail"
                                        team="credit"
                                        value={this.state.formData.ContactEmail}
                                        variant="solid"
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'ContactEmail'
                                                  ]
                                                : null
                                        }
                                        onChange={this.onFieldChange}
                                        type="text"
                                    />
                                </Box>
                            </Box>
                        </React.Fragment>
                        {this.state.isContractsEnabled && (
                            <React.Fragment key="contract">
                                <Text
                                    m="16px 0 16px 5%"
                                    fontWeight="light"
                                    color="#4195C7"
                                    fontSize="28px">
                                    CONTRACT FIELDS
                                </Text>
                                <Box
                                    flexDirection="row"
                                    justifyContent="center">
                                    <Box
                                        width={1 / 2}
                                        mx="auto"
                                        alignItems="center">
                                        <DynamicSelect
                                            arrayOfData={
                                                dropDownDatas.IncoTermsTypeId
                                            }
                                            label="Incoterms 1"
                                            name="IncoTermsTypeId"
                                            team="contracts"
                                            isRequired={true}
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'IncoTermsTypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                            value={
                                                this.state.formData &&
                                                this.state.formData[
                                                    'IncoTermsTypeId'
                                                ]
                                            }
                                        />

                                        <DynamicSelect
                                            arrayOfData={
                                                dropDownDatas.CustomerGroupTypeId
                                            }
                                            label="Customer Group"
                                            name="CustomerGroupTypeId"
                                            team="contracts"
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
                                                this.state.formData[
                                                    'CustomerGroupTypeId'
                                                ]
                                            }
                                            inputProps={
                                                inputPropsForDefaultRules[
                                                    'CustomerGroupTypeId'
                                                ]
                                            }
                                        />
                                    </Box>
                                    <Box
                                        width={1 / 2}
                                        mx="auto"
                                        alignItems="center">
                                        <DynamicSelect
                                            arrayOfData={
                                                dropDownDatas.PaymentTermsTypeId
                                            }
                                            label="Payment Terms"
                                            name="PaymentTermsTypeId"
                                            team="contracts"
                                            isRequired={true}
                                            formErrors={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                          'PaymentTermsTypeId'
                                                      ]
                                                    : null
                                            }
                                            onFieldChange={this.onFieldChange}
                                            value={
                                                this.state.formData[
                                                    'PaymentTermsTypeId'
                                                ]
                                            }
                                            inputProps={
                                                inputPropsForDefaultRules[
                                                    'PaymentTermsTypeId'
                                                ]
                                            }
                                        />
                                        <DynamicSelect
                                            arrayOfData={
                                                dropDownDatas.AccountTypeId
                                            }
                                            label="Account Type"
                                            name="AccountTypeId"
                                            team="contracts"
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
                                                this.state.formData[
                                                    'AccountTypeId'
                                                ]
                                            }
                                            inputProps={
                                                inputPropsForDefaultRules[
                                                    'AccountTypeId'
                                                ]
                                            }
                                        />
                                    </Box>
                                </Box>
                            </React.Fragment>
                        )}

                        <React.Fragment key="Pricing">
                            <Text
                                m="16px 0 16px 5%"
                                fontWeight="light"
                                color="#4195C7"
                                fontSize="28px">
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
                                        team="pricing"
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'SpecialPricingTypeId'
                                                  ]
                                                : null
                                        }
                                        value={
                                            this.state.formErrors[
                                                'SpecialPricingTypeId'
                                            ]
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />

                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.DistLevelTypeId
                                        }
                                        label="Dist Level Pricing"
                                        name="DistLevelTypeId"
                                        team="pricing"
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'DistLevelTypeId'
                                                  ]
                                                : null
                                        }
                                        value={
                                            this.state.formErrors[
                                                'DistLevelTypeId'
                                            ]
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center"
                                />
                            </Box>
                        </React.Fragment>
                        <FilesList
                            formErrors={this.state.fileErrors}
                            files={selectedFilesIds.map(
                                (id) => selectedFiles[id]
                            )}
                            onChange={(value, id) => {
                                this.setState({
                                    selectedFiles: {
                                        ...selectedFiles,
                                        [id]: {
                                            ...selectedFiles[id],
                                            DocumentType: parseInt(value),
                                        },
                                    },
                                });
                            }}
                        />
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
                        {this.state.isContractsEnabled && (
                            <>
                                <label
                                    htmlFor="file-upload"
                                    className="custom-file-upload">
                                    <MaterialIcons
                                        name="attach-file"
                                        size={20}
                                        color="#fff"
                                    />
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={this.selectFile}
                                />
                            </>
                        )}
                        <Button
                            onPress={() => this.props.history.goBack()}
                            title="Cancel"
                        />

                        <Button
                            onPress={(event) => this.onSubmit()}
                            title="Submit"
                        />
                    </Flex>
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

const mapStateToProps = ({ customer, toasts, updateFlow }) => {
    const { bapi70CustData, alert, fetching: fetchingCustomer } = customer;
    const { fetching } = updateFlow;
    return {
        bapi70CustData,
        fetching: fetchingCustomer || fetching,
        alert,
        toasts,
    };
};

export default connect(mapStateToProps, {
    updateDeltas,
    getCustomerDetail,
    getCustomerFromSAP,
    removeMessage,
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
