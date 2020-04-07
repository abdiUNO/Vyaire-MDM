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
import FilesList from '../../../../components/FilesList.js';
import { FormInput, FormSelect } from '../../../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { saveApolloMyTaskContracts } from '../../../../appRedux/actions/MyTasks';
import {
    yupFieldValidation,
    yupAllFieldsValidation,
} from '../../../../constants/utils';
import { MaterialIcons } from '@expo/vector-icons';
import {
    getStatusBarData,
    getFunctionalGroupData,
} from '../../../../appRedux/actions/Workflow';

import GlobalMdmFields from '../../../../components/GlobalMdmFields';
import SystemFields from '../../../../components/SystemFields';
import {
    mytaskContractsRules,
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

import { fetchContractsDropDownData } from '../../../../redux/DropDownDatas';
import Loading from '../../../../components/Loading';
import FlashMessage from '../../../../components/FlashMessage';
import { connect } from 'react-redux';
import MultiColorProgressBar from '../../../../components/MultiColorProgressBar';
import DeltaField from '../../../../components/DeltaField';
import { getMockUpdateTaskDetail } from '../../../../appRedux/sagas/config';

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            WorkflowId: this.props.location.state.WorkflowId,
            TaskId: this.props.location.state.TaskId,
            data: {},
            reject: false,
            dropDownDatas: {},
            formData: { RejectionButton: false },
            formErrors: {},
            inputPropsForDefaultRules: {},
            fileErrors: {},
            selectedFiles: {},
            selectedFilesIds: [],
            files: [],
        };
    }

    componentDidMount() {
        let { state: wf } = this.props.location;
        let postJson = {
            workflowId: wf.WorkflowId,
            fuctionalGroup: 'contracts',
            taskId: wf.TaskId,
        };

        this.props.getStatusBarData(postJson);
        // this.props.getFunctionalGroupData(postJson);
        getMockUpdateTaskDetail().then((res) => {
            this.setState({ data: res });
            console.log(res);
        });

        fetchContractsDropDownData().then((res) => {
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
                if (name === 'CustomerGroupTypeId') {
                    this.validateRules(name, value);
                }
            }
        );
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
            onChange: this.onFieldChange,
        };
        const readOnlyDropDown = { disabled: true };

        // check for AccountTypeId
        if (stateKey === 'CustomerGroupTypeId') {
            var cg_val = stateVal;
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

    handleFormSubmission = (schema) => {
        const userId = localStorage.getItem('userId');

        let {
                TaskId,
                WorkflowId,
                formData,
                selectedFiles,
                selectedFilesIds,
            } = this.state,
            castedFormData = {},
            postData = {};
        try {
            const WorkflowTaskModel = {
                RejectionReason: formData['RejectionButton']
                    ? formData['RejectionReason']
                    : '',
                TaskId: TaskId,
                UserId: userId,
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

            postData['files'] = selectedFilesIds.map((id) => selectedFiles[id]);
            this.props.saveApolloMyTaskContracts(postData);
            this.resetForm();
            this.scrollToTop();
        } catch (error) {
            console.log('form validtion error');
        }
    };

    onSubmit = (event, reject, schema) => {
        let { formData, selectedFilesIds, selectedFiles } = this.state;
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
                    ...this.state.formData,
                    RejectionButton: reject,
                },
            },
            () => {
                yupAllFieldsValidation(
                    this.state.formData,
                    schema,
                    (...rest) => {
                        if (this.state.isFileErrors === false)
                            this.handleFormSubmission(...rest);
                    },
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

    selectFiles = (events) => {
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

    render() {
        const {
            width,
            location,

            statusBarData,
            TasksStatusByTeamId = null,
            alert = {},
        } = this.props;

        const {
            dropDownDatas,
            data: { CustomerData, Deltas = {} },
            inputPropsForDefaultRules,
            selectedFilesIds,
            selectedFiles,
        } = this.state;

        const files = [];

        const { state } = location;

        const workflow = {
            ...state,
            isReadOnly:
                TasksStatusByTeamId === null ||
                !(TasksStatusByTeamId[5].WorkflowTaskStateTypeId === 2),
        };
        const globalMdmDetail = CustomerData;
        const inputReadonlyProps = workflow.isReadOnly
            ? { disabled: true }
            : null;

        const showFunctionalDetail =
            state.isReadOnly && CustomerData === null
                ? { display: 'none' }
                : null;

        const showButtons = workflow.isReadOnly ? { display: 'none' } : null;

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
                                            globalMdmDetail &&
                                            globalMdmDetail.DistributionChannel
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

                        <Box {...showFunctionalDetail}>
                            <Text
                                mt={5}
                                mb={2}
                                fontWeight="regular"
                                color="lightBlue"
                                fontSize={24}
                                pl={4}>
                                CONTRACT FIELDS
                            </Text>
                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['IncoTermsTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IncoTermsTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Incoterms 1"
                                            name="IncoTermsTypeId"
                                            inline
                                            value={
                                                globalMdmDetail &&
                                                parseInt(
                                                    globalMdmDetail.IncoTermsTypeId
                                                )
                                            }
                                            variant="outline"
                                            type="text"
                                        />
                                    )}

                                    {Deltas['IncoTermsTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IncoTermsTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Customer Group"
                                            name="CustomerGroupTypeId"
                                            inline
                                            value={
                                                globalMdmDetail &&
                                                parseInt(
                                                    globalMdmDetail.CustomerGroupTypeId
                                                )
                                            }
                                            variant="outline"
                                            type="text"
                                        />
                                    )}

                                    <FormInput
                                        label="Additional Notes"
                                        multiline
                                        numberOfLines={2}
                                        name="additionalNotes"
                                        variant="solid"
                                        type="text"
                                        onChange={this.onFieldChange}
                                        error={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                      'additionalNotes'
                                                  ]
                                                : null
                                        }
                                        value={
                                            workflow.isReadOnly
                                                ? globalMdmDetail &&
                                                  globalMdmDetail.AdditionalNotes
                                                : this.state.formData
                                                ? this.state.formData[
                                                      'additionalNotes'
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
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {Deltas['IncoTermsTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['IncoTermsTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Payment Terms"
                                            name="PaymentTermsTypeId"
                                            inline
                                            value={
                                                globalMdmDetail &&
                                                parseInt(
                                                    globalMdmDetail.PaymentTermsTypeId
                                                )
                                            }
                                            variant="outline"
                                            type="text"
                                        />
                                    )}
                                    {Deltas['AccountTypeId'] ? (
                                        <DeltaField
                                            delta={Deltas['AccountTypeId']}
                                        />
                                    ) : (
                                        <FormInput
                                            label="Account Type"
                                            name="AccountTypeId"
                                            inline
                                            value={
                                                globalMdmDetail &&
                                                parseInt(
                                                    globalMdmDetail.AccountTypeId
                                                )
                                            }
                                            variant="outline"
                                            type="text"
                                        />
                                    )}

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
                                        variant="solid"
                                        type="text"
                                        value={
                                            workflow.isReadOnly
                                                ? globalMdmDetail &&
                                                  globalMdmDetail.RejectionReason
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

                        {workflow.isReadOnly ? (
                            <FilesList files={files} readOnly />
                        ) : (
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
                        )}
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
                            <label
                                htmlFor="file-upload"
                                className="custom-file-upload">
                                <MaterialIcons
                                    name="attach-file"
                                    size={20}
                                    color="#fff"
                                />
                                Distribution Agreement
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                onChange={this.selectFiles}
                                multiple
                            />

                            <Button
                                onPress={(event) =>
                                    this.onSubmit(
                                        event,
                                        false,
                                        mytaskContractsRules
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
    const { fetching, alert } = myTasks;
    const {
        fetchingfnGroupData,
        statusBarData,
        functionalGroupDetails,
        TasksStatusByTeamId,
        fetchingStatusBar,
    } = workflows;
    return {
        fetchingfnGroupData,
        fetching: fetching || fetchingStatusBar || fetchingfnGroupData,
        alert,
        statusBarData,
        TasksStatusByTeamId,
        functionalGroupDetails,
    };
};

export default connect(mapStateToProps, {
    saveApolloMyTaskContracts,
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
});
