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
    getCustomerFromSAP,
    withDrawRequest,
    getStatusBarData,
} from '../appRedux/actions';
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
import DeltaField from '../components/DeltaField';
import {
    RoleType,SystemType,DistributionChannelType ,DivisionType,CompanyCodeType,SalesOrgType,
} from '../constants/WorkflowEnums';
import {normalize} from '../appRedux/sagas/config';
import MultiColorProgressBar from '../components/MultiColorProgressBar';

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
            readOnly : false,
            isRequestPage:false,
            statusBarData: this.props.statusBarData,
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
                        WorkflowTitle:''
                    },
                });
        });
    }

    componentDidMount() {        
        const {page , id} = this.props.match.params; 
        var jsonBody={}
        if(page==='update'){
            fetchCustomerMasterDropDownData().then((res) => {
                const data = res;
                this.setState({ dropDownDatas: data ,isRequestPage:false }, this.generateWorkflowId);
            });
            const { state } = this.props.location;
            jsonBody = state.sysFieldsData;
            this.createDunsObj(state.globalMdmDetail);      
            this.props.getCustomerFromSAP(jsonBody);      
            this.validateFromSourceData(state.globalMdmDetail);

        }else if(page==='my-requests') {

            fetchCustomerMasterDropDownData().then((res) => {
                const data = res;
                this.setState({ dropDownDatas: data ,readOnly:true,isRequestPage:true});
            });

            jsonBody={
                "WorkflowId": id,
                "CustomerNumber": "",
                "DivisionTypeId": 0,
                "SystemTypeId": 0,
                "DistributionChannelTypeId": 0,
                "CompanyCodeTypeId": 0,
                "SalesOrgTypeId": 0,
                "RoleTypeId": 0
               }
            this.props.getCustomerFromSAP(jsonBody);      
            let postJson = {
                workflowId: id,
                fuctionalGroup: '',
                taskId: '',
                userId: localStorage.getItem('userId'),
            };
            this.props.getStatusBarData(postJson);
        }
        
        
    }

    componentWillReceiveProps(newProps) {
        if (newProps.bapi70CustData != this.props.bapi70CustData) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    ...newProps.bapi70CustData.CustomerData,
                },
            });
        }
        if (newProps.statusBarData != this.props.statusBarData) {
            this.setState({
                statusBarData: newProps.statusBarData,
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
            WorkflowTitle:formData.WorkflowTitle,
            CustomerName: '',
            SystemRecordId: state.sysFieldsData.CustomerNumber,
            SystemTypeId: state.sysFieldsData.SystemTypeId,
            RoleTypeId: state.sysFieldsData.RoleTypeId,
            SalesOrgTypeId: state.sysFieldsData.SalesOrgTypeId,
            DivisionTypeId: state.sysFieldsData.DivisionTypeId,
            DistributionChannelTypeId: state.sysFieldsData.DistributionChannelTypeId,
            CompanyCodeTypeId: state.sysFieldsData.CompanyCodeTypeId,
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

    createDunsObj = (data , name = null, val = null) => {
        const { state } = this.props.location;

        if (name === null || val === null) {
            this.setState({
                dunsData: {
                    Country: data.Country,
                    Name1: data.Name1,
                    City: data.City,
                    Region: data.Region,
                    Street: data.Street,
                    DunsNumber: data.DunsNumber,
                    SicCode4: data.SicCode4,
                    SicCode6: data.SicCode6,
                    SicCode8: data.SicCode8,
                    TaxNumber: data.TaxNumber,
                    VatRegNo: data.VatRegNo,
                    NaisCode: data.NaicsCode,
                    NaisCodeDescription:data.NaicsCodeDescription,
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
        const {state} =this.props.location;
        const { name } = e.target;
        var team =
            e.target.getAttribute('team') ||
            e.target.selectedOptions[0].getAttribute('team');
        var formDataValue = this.isNumber(value) ? parseInt(value, 10) : value;
        let origdata = this.props.bapi70CustData;
        if(name==='WorkflowTitle'){
            this.setState({formData:{
                ...this.state.formData,
                [name]:value
            },
        });
        }
        if (origdata[name] != value) {
            let newDeltaValue = {
                name: name,
                originalValue: origdata[name],
                updatedValue: value,
            };
            let teamsDelta = this.state[team] || [];
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
                        this.createDunsObj(state.globalMdmDetail ,name, value);
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
        //checkbox item fieldChange
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
        let teamsDelta = this.state[team] || [] ;
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
        const { width, location, alert  } = this.props;
        const {bapi70CustData } = this.props;
        const { state  } = location;
        const { page } = this.props.match.params;
        const {
            dropDownDatas,
            inputPropsForDefaultRules,
            selectedFilesIds,
            selectedFiles,
            isRequestPage
        } = this.state;
        

        let Deltas=[],MdmNumber='',globalMdmDetail,workFlowTaskStatus=[];
        if(isRequestPage){
            globalMdmDetail=bapi70CustData.CustomerData;
            Deltas=normalize(bapi70CustData.Deltas || []);
            workFlowTaskStatus = this.state.statusBarData || [];
            workFlowTaskStatus = workFlowTaskStatus.filter(function(item) {
                return item.WorkflowTaskStateTypeId != 4;
            });
    
        }else {
            globalMdmDetail={...state.globalMdmDetail,...state.sysFieldsData}
            MdmNumber=state.MdmNumber
        }
       
        const pageProps = this.state.readOnly
            ? {
                  inline: true,
                  variant: 'outline',
                  readOnly: true,
              }
            : {
                  inline: false,
                  readOnly: false,
                  onBlur: this.props.onFieldChange,
              };

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
                {isRequestPage &&
                    <View style={styles.progressIndicator}>
                        <MultiColorProgressBar
                            readings={this.state.statusBarData}
                        />
                    </View>
                 }
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
                                team='general'
                                style={{ lineHeight: '2', paddingBottom: 0 }}
                                flex={1 / 4}
                                mb={2}
                                onChange={this.onFieldChange}
                                error={
                                    this.state.formErrors
                                        ? this.state.formErrors['Title']
                                        : null
                                }
                                value={this.state.formData.WorkflowTitle || ''}
                                label="Workflow Title"
                                name="WorkflowTitle"
                                {...pageProps}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="WorkflowId"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={this.state.formData.WorkflowId || this.props.match.params.id}
                            />
                            {!isRequestPage && <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="MdmNumber"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={MdmNumber || ''}
                            /> }
                        </Box>

                        <GlobalMdmFields
                            formData={globalMdmDetail}
                            readOnly
                            deltas={Deltas ? Deltas : {}}
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
                                {Deltas && Deltas['SystemType'] ? (
                                    <DeltaField delta={Deltas['SystemType']} />
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
                                                    globalMdmDetail.SystemType
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
                                    {Deltas && Deltas['TransporationZone'] ? (
                                        <DeltaField
                                            delta={Deltas['TransporationZone']}
                                        />
                                    ) : ( <FormInput
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
                                    )}
                                    {Deltas && Deltas['SearchTerm1'] ? (
                                        <DeltaField
                                            delta={Deltas['SearchTerm1']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Search Term 1"
                                            name="SearchTerm1"
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['SearchTerm2'] ? (
                                        <DeltaField
                                            delta={Deltas['SearchTerm2']}
                                        />
                                    ) : (
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
                                            error={
                                                this.state.formErrors
                                                    ? this.state.formErrors[
                                                        'SearchTerm2'
                                                    ]
                                                    : null
                                            }
                                            onChange={this.onFieldChange}
                                            type="text"
                                            {...pageProps}
                                        />
                                    )}
                                   
                                    {Deltas && Deltas['DunsNumber'] ? (
                                        <DeltaField
                                            delta={Deltas['DunsNumber']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['SicCode4'] ? (
                                        <DeltaField
                                            delta={Deltas['SicCode4']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['SicCode6'] ? (
                                        <DeltaField
                                            delta={Deltas['SicCode6']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="SIC Code 6"
                                            name="SicCode6"
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['SicCode8'] ? (
                                        <DeltaField
                                            delta={Deltas['SicCode8']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['NaicsCode'] ? (
                                        <DeltaField
                                            delta={Deltas['NaicsCode']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['VatRegNo'] ? (
                                        <DeltaField
                                            delta={Deltas['VatRegNo']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )} 
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas && Deltas['TaxNumber2'] ? (
                                        <DeltaField
                                            delta={Deltas['TaxNumber2']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['SortKey'] ? (
                                        <DeltaField
                                            delta={Deltas['SortKey']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['PaymentMethods'] ? (
                                        <DeltaField
                                            delta={Deltas['PaymentMethods']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['AcctgClerk'] ? (
                                        <DeltaField
                                            delta={Deltas['AcctgClerk']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['AccountStatement'] ? (
                                        <DeltaField
                                            delta={Deltas['AccountStatement']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )}
                                    {Deltas && Deltas['TaxClassification'] ? (
                                        <DeltaField
                                            delta={Deltas['TaxClassification']}
                                        />
                                    ) : (
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
                                            {...pageProps}
                                        />
                                    )} 
                                </Box>
                            </Box>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                
                                    {Deltas && Deltas['CustomerClassTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['CustomerClassTypeId']}
                                        />
                                    ) : (        
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                    {Deltas && Deltas['CustomerPriceProcTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['CustomerPriceProcTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                    {Deltas && Deltas['IndustryCodeTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IndustryCodeTypeId']}
                                        />
                                    ) : (        
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                        )}
                                        {Deltas && Deltas['IndustryTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['IndustryTypeId']}
                                            />
                                        ) : (        
                                            <DynamicSelect
                                                readOnly={this.state.readOnly}
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
                                        )}
                                        {Deltas && Deltas['ReconAccountTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['ReconAccountTypeId']}
                                            />
                                        ) : (        
                                            <DynamicSelect
                                                readOnly={this.state.readOnly}
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
                                            readOnly={this.state.readOnly}
                                        />
                                        )}
                                        {Deltas && Deltas['SalesOfficeTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['SalesOfficeTypeId']}
                                            />
                                        ) : (        
                                            <DynamicSelect
                                                readOnly={this.state.readOnly}
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
                                        )}
                                         
                                        {!this.state.isContractsEnabled &&  
                                        Deltas && Deltas['CustomerGroupTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['CustomerGroupTypeId']}
                                            />
                                        ) : (        
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                            {Deltas && Deltas['PpcustProcTypeId'] ? (
                                                <DeltaField
                                                    delta={Deltas['PpcustProcTypeId']}
                                                />
                                            ) : (
                                                <DynamicSelect
                                                    readOnly={this.state.readOnly}
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
                                        )}
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                     {Deltas && Deltas['PriceListTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['PriceListTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                    {Deltas && Deltas['DeliveryPriorityTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['DeliveryPriorityTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                    {Deltas && Deltas['ShippingConditionsTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['ShippingConditionsTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                         
                                    {!this.state.isContractsEnabled &&  
                                        Deltas && Deltas['Incoterms1TypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['Incoterms1TypeId']}
                                            />
                                        ) : (        
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    {Deltas && Deltas['Incoterms2'] ? (
                                            <DeltaField
                                                delta={Deltas['Incoterms2']}
                                            />
                                        ) : (  
                                        this.state.formData['displayINCOT2'] ? (
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
                                    )  : null )}
                                    
                                    {Deltas && Deltas['AcctAssignmentGroupTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['AcctAssignmentGroupTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                       
                                    {!this.state.isContractsEnabled &&  
                                        Deltas && Deltas['AccountTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['AccountTypeId']}
                                            />
                                        ) : (        
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                     {Deltas && Deltas['ShippingCustomerTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['ShippingCustomerTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
                                    { !isRequestPage && 
                                    <>
                                    {Deltas && Deltas['OrderCombination'] ? (
                                            <DeltaField
                                                delta={Deltas['OrderCombination']}
                                            />
                                        ) : (  
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
                                    )}
                                    {Deltas && Deltas['PaymentHistoryRecord'] ? (
                                            <DeltaField
                                                delta={Deltas['PaymentHistoryRecord']}
                                            />
                                        ) : (  
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
                                        )}
                                    </>
                                    }
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
                                    
                                         
                                    {!this.state.isContractsEnabled &&  
                                        Deltas && Deltas['PaymentTermsTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['PaymentTermsTypeId']}
                                            />
                                        ) : (        
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                     {Deltas && Deltas['RiskCategoryTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['RiskCategoryTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}                                        arrayOfData={
                                            dropDownDatas.RiskCategoryTypeId
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

                                    )}
                                    {Deltas && Deltas['CreditRepGroupTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['CreditRepGroupTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}                                        arrayOfData={
                                            dropDownDatas.CreditRepGroupTypeId
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
                                    )}
                                    {Deltas && Deltas['Rating'] ? (
                                        <DeltaField
                                            delta={Deltas['Rating']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="Rating"
                                        name="Rating"
                                        team="credit"
                                        value={this.state.formData['Rating']}
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
                                     
                                    {Deltas && Deltas['CreditLimit'] ? (
                                        <DeltaField
                                            delta={Deltas['CreditLimit']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
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
                                        type="text"
                                    />
                                    )}
                                    {Deltas && Deltas['CredInfoNumber'] ? (
                                        <DeltaField
                                            delta={Deltas['CredInfoNumber']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="Cred Info Number"
                                        name="CredInfoNumber"
                                        team="credit"
                                        value={
                                            this.state.formData[
                                                'CredInfoNumber'
                                            ]
                                        }
                                        inline
                                        type="text"
                                    />
                                    )}
                                    {Deltas && Deltas['PaymentIndex'] ? (
                                        <DeltaField
                                            delta={Deltas['PaymentIndex']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
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
                                    )}
                                    {Deltas && Deltas['LastExtReview'] ? (
                                        <DeltaField
                                            delta={Deltas['LastExtReview']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
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
                                    )}
                                    
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
                                    
                                    {Deltas && Deltas['ContactFirstName'] ? (
                                        <DeltaField
                                            delta={Deltas['ContactFirstName']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="First Name"
                                        name="ContactFirstName"
                                        team="credit"

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
                                    )}
                                    {Deltas && Deltas['ContactLastName'] ? (
                                        <DeltaField
                                            delta={Deltas['ContactLastName']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="Last Name"
                                        name="ContactLastName"
                                        team="credit"

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
                                    )}
                                    {Deltas && Deltas['ContactTelephone'] ? (
                                        <DeltaField
                                            delta={Deltas['ContactTelephone']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="Telephone"
                                        name="ContactTelephone"
                                        team="credit"
                                        value={
                                            this.state.formData
                                                .ContactTelephone ||
                                            this.state.formData.ContactPhone
                                        }

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
                                    )}
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas && Deltas['ContactFax'] ? (
                                        <DeltaField
                                            delta={Deltas['ContactFax']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="Fax"
                                        name="ContactFax"
                                        team="credit"
                                        value={this.state.formData.ContactFax}

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
                                    )}
                                    {Deltas && Deltas['ContactEmail'] ? (
                                        <DeltaField
                                            delta={Deltas['ContactEmail']}
                                        />
                                    ) : (
                                        <FormInput
                                        {...pageProps}
                                        label="Email"
                                        name="ContactEmail"
                                        team="credit"
                                        value={this.state.formData.ContactEmail}

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
                                    )}
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
                                     {Deltas && Deltas['IncoTermsTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IncoTermsTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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

                                        )}
                                        {Deltas && Deltas['CustomerGroupTypeId'] ? (
                                            <DeltaField
                                                delta={Deltas['CustomerGroupTypeId']}
                                            />
                                        ) : (
                                            <DynamicSelect
                                                readOnly={this.state.readOnly}                                            arrayOfData={
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
                                        )}
                                    </Box>
                                    <Box
                                        width={1 / 2}
                                        mx="auto"
                                        alignItems="center">
                                     {Deltas && Deltas['PaymentTermsTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['PaymentTermsTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}                                            arrayOfData={
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
                                        )}
                                    {Deltas && Deltas['AccountTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['AccountTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
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
                                     {Deltas && Deltas['SpecialPricingTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['SpecialPricingTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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

                                    )}
                                    {Deltas && Deltas['DistLevelTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['DistLevelTypeId']}
                                        />
                                    ) : (
                                        <DynamicSelect
                                            readOnly={this.state.readOnly}
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
                                    )}
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
                        { !isRequestPage && 
                            <>
                            <Button
                                onPress={() => this.props.history.goBack()}
                                title="Cancel"
                            />
                            <Button
                                onPress={(event) => this.onSubmit()}
                                title="Submit"
                            />
                            </>
                        }
                        { (isRequestPage && workFlowTaskStatus.length > 0) && (
                            <Button
                                onPress={() => {
                                    window.scrollTo(0, 0);
                                    this.props.withDrawRequest(
                                        {
                                            WorkflowId: this.props.match.params.id,
                                            WorkflowOperationType: 4,
                                        },
                                        this.props.history
                                    );
                                }}
                                title="Withdraw"
                            />
                        )}
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

const mapStateToProps = ({ customer, toasts,workflows, updateFlow }) => {
    const { bapi70CustData, alert:updateAlert , fetching: fetchingCustomer } = customer;
    const { 
        alert: workFlowAlert, 
        statusBarData,
    } = workflows;
    const alert = workFlowAlert.display ? workFlowAlert : updateAlert;
    const { fetching } = updateFlow;
    return {
        bapi70CustData,
        fetching: fetchingCustomer || fetching,
        alert,
        toasts,
        statusBarData
    };
};

export default connect(mapStateToProps, {
    updateDeltas,
    getCustomerFromSAP,
    removeMessage,
    withDrawRequest,
    getStatusBarData
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
