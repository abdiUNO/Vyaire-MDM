/**
 * @prettier
 */
import { TextInput } from 'react-native-web';

import React, { Fragment } from 'react';
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
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { Flex, Button, Box, Text } from '../../../components/common';
import {
    FormInput,
    FormSelect,
    FormRadioGroup,
    FormRadio,
} from '../../../components/form';
import FilesList from '../../../components/FilesList.js';
import idx from 'idx';

import {
    yupFieldValidation,
    yupAllFieldsValidation,
} from '../../../constants/utils';
import {
    SystemType,
    SalesOrgType,
    CategoryTypes,
} from '../../../constants/WorkflowEnums.js';
import GlobalMdmFields from '../../../components/GlobalMdmFields';
import {
    createCustomerRules,
    yupglobalMDMFieldRules,
    updateGlobalMDMFieldRules,
} from '../../../constants/FieldRules';
import DynamicSelect from '../../../components/DynamicSelect';
import { fetchCreateCustomerDropDownData } from '../../../redux/DropDownDatas';
import { createCustomer } from '../../../appRedux/actions/Customer.js';
import FileInput from '../../../components/form/FileInput.jsx';
import { ajaxGetRequest } from '../../../appRedux/sagas/config';
import { getTaxJurisdictionData } from '../../../appRedux/actions/MyTasks';
import { updateDeltas } from '../../../appRedux/actions/UpdateFlowAction';
import { removeMessage } from '../../../appRedux/actions/Toast';
import FlashMessage, { FlashMessages } from '../../../components/FlashMessage';

const SystemValidValues = Object.keys(SystemType).map((index) => {
    const system = SystemType[index];
    return { id: index, description: system };
});

const SalesOrgValidValues = Object.keys(SalesOrgType).map((index) => {
    const system = SalesOrgType[index];
    return { id: index, description: system, value: system };
});

function merge(...schemas) {
    const [first, ...rest] = schemas;

    const merged = rest.reduce(
        (mergedSchemas, schema) => mergedSchemas.concat(schema),
        first
    );

    return merged;
}

const initFormdData = {
    SystemTypeId: 1,
};

const mapKeys = (obj, callback) => {
    const keys = Object.keys(obj);
    return keys.map((key, index) => callback(obj[key], key));
};
class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            system: '',
            role: '',
            formData: {
                ...initFormdData,
            },
            updatedFormData: {},
            dropDownDatas: {},
            taxUpdated: false,
            fetchingWorkflowId: false,
            fileErrors: {},
            selectedFiles: {},
            selectedFilesIds: [],
            files: [],
            dunsData: {},
            userId: localStorage.getItem('userId'),
            inputPropsForDefaultRules: {},
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
        const { state } = this.props.location;
        this.setState({
            formData: {
                ...this.state.formData,
                ...state,
            },
        });
        this.createDunsObj();
        fetchCreateCustomerDropDownData().then((res) => {
            const data = res;
            this.setState({ dropDownDatas: data }, this.generateWorkflowId);
        });
    }

    updateFormData = (val, name) => {};

    getTaxJuri = () => {
        let { formData, userId } = this.state;
        try {
            var postData = {
                userId,
                Country: formData['Country'].trim(),
                Region: formData['Region'].trim(),
                PostalCode: formData['PostalCode'].trim(),
                City: formData['City'].trim(),
            };
            this.props.getTaxJurisdictionData(postData);
        } catch (error) {
            console.log(error);
            console.log('tax juri api/formdata call error');
        }
    };

    getAddress = (formData) => ({
        Country: idx(formData, (_) => _.Country) || '',
        Region: idx(formData, (_) => _.Region) || '',
        PostalCode: idx(formData, (_) => _.PostalCode) || '',
        City: idx(formData, (_) => _.City) || '',
    });

    shouldTaxJuriUpdate(prevFormData, formData) {
        const adressesObj = this.getAddress(formData);
        const prevAddress = this.getAddress(prevFormData);

        const obj = mapKeys(adressesObj, (value, key) => ({
            value,
            key,
        }));

        const addressUpdated = obj.some(({ key, value }) => {
            const prevValue = idx(prevFormData, (_) => _[key]);
            return (prevValue ? prevValue.trim() : '') !== value.trim();
        });

        const addressFilled = obj.every(({ key, value }) => {
            return value.length > 0;
        });

        if (addressFilled && this.state.taxUpdated === false) {
            this.setState({ taxUpdated: true });
            return true;
        } else if (
            this.props.taxJuriData &&
            this.props.taxJuriData.length > 0 &&
            addressUpdated &&
            !addressFilled
        ) {
            return true;
        }

        return addressFilled && addressUpdated;
    }

    onFieldChange = (val, e) => {
        const name = e.target.name;
        const value = name === 'Country' ? val.toUpperCase() : val;
        const { formData: prevFormData } = this.state;

        this.setState(
            (prevState, props) => {
                return {
                    formData: {
                        ...prevState.formData,
                        [name]: value,
                    },
                    updatedFormData: {
                        ...prevState.updatedFormData,
                        [name]: value,
                    },
                };
            },
            () => {
                const { formData, taxUpdated } = this.state;
                if (
                    name === 'RoleTypeId' ||
                    name === 'CategoryTypeId' ||
                    name === 'Telephone'
                ) {
                    this.validateRules(name, val);
                } else if (
                    name === 'Country' ||
                    name === 'Region' ||
                    name === 'PostalCode' ||
                    name === 'City' ||
                    name === 'Name1' ||
                    name === 'Street'
                ) {
                    this.createDunsObj(name, val);

                    if (name === 'Country') this.validateRules(name, val);

                    if (this.shouldTaxJuriUpdate(prevFormData, formData)) {
                        this.getTaxJuri();
                        this.setState({
                            formData: {
                                ...this.state.formData,
                                TaxJurisdiction: this.props.taxJuriData,
                            },
                        });
                    }
                }
            }
        );
    };

    createDunsObj = (name = null, val = null) => {
        const { state } = this.props.location;

        if (name === null || val === null) {
            this.setState({
                dunsData: {
                    Country: state.Country,
                    Name1: state.Name1,
                    City: state.City,
                    Region: state.Region,
                    Street: state.Street,
                    DunsNumber: state.DunsNumber,
                    SicCode4: state.SicCode4,
                    SicCode6: state.SicCode6,
                    SicCode8: state.SicCode8,
                    TaxNumber: state.TaxNumber,
                    VatRegNo: state.VatRegNo,
                    NaisCode: state.NaicsCode,
                    NaisCodeDescription: state.NaicsCodeDescription,
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

    validateRules = (stateKey, stateVal) => {
        const readOnlyDropDown = { disabled: true };
        // check for SalesOrgTypeId
        if (stateKey === 'RoleTypeId' || stateKey === 'CategoryTypeId') {
            var categoryTypeidValue = this.state.formData['CategoryTypeId'];
            var roleTypeidValue = this.state.formData['RoleTypeId'];

            if (parseInt(roleTypeidValue, 10) === 5) {
                this.setFormDataValues('SalesOrgTypeId', 4);
                this.setInputPropsForDefaultRules(
                    'SalesOrgTypeId',
                    readOnlyDropDown
                );
            } else {
                if (categoryTypeidValue === '4') {
                    this.setFormDataValues('SalesOrgTypeId', 1);
                    this.setInputPropsForDefaultRules(
                        'SalesOrgTypeId',
                        readOnlyDropDown
                    );
                } else if (
                    categoryTypeidValue === '1' ||
                    categoryTypeidValue === '2' ||
                    categoryTypeidValue === '3' ||
                    categoryTypeidValue === '6' ||
                    categoryTypeidValue === '7'
                ) {
                    this.setFormDataValues('SalesOrgTypeId', 2);
                    this.setInputPropsForDefaultRules(
                        'SalesOrgTypeId',
                        readOnlyDropDown
                    );
                } else {
                    this.setFormDataValues('SalesOrgTypeId', '');
                    this.setInputPropsForDefaultRules('SalesOrgTypeId', {
                        disabled: false,
                    });
                }
            }
        } else if (stateKey === 'Country') {
            if (stateVal === 'CA') {
                this.setFormDataValues('CompanyCodeTypeId', 2);
            } else {
                this.setFormDataValues('CompanyCodeTypeId', 1);
            }
            this.setInputPropsForDefaultRules(
                'CompanyCodeTypeId',
                readOnlyDropDown
            );
        } else if (stateKey === 'Telephone') {
            console.log(stateVal > 0 ? stateVal.trim() : null);
            this.setFormDataValues(
                'Telephone',
                stateVal > 0 ? stateVal.trim() : null
            );
        }
    };

    setFormErrors = (errors) => {
        const { formErrors } = this.state;
        this.setState({ formErrors: errors });
    };

    createDeltas = (origData, newData) => {
        let customerDataModel = {},
            customerElements = [],
            addedKeys = [];
        for (const key in newData) {
            if (origData[key] != newData[key] && !addedKeys.includes(key)) {
                let delta = {};
                delta['name'] = key;
                delta['originalValue'] = origData[key];
                delta['updatedValue'] = newData[key];
                addedKeys.push(key);
                customerElements.push(delta);
            }
        }
        customerDataModel['customerElements'] = customerElements;
        return customerDataModel;
    };

    proceedAction = () => {
        const { history, location } = this.props;
        const { state } = location;
        const {
            selectedFilesIds,
            selectedFiles,
            formData,
            userId,
        } = this.state;

        let customerDataModel = this.createDeltas(
            state,
            this.state.updatedFormData
        );
        let data = {
            userId: userId,
            workflowId: formData.WorkflowId,
            mdmCustomerId: formData.MdmNumber,
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

    onSubmit = (event, schema, IsSaveToWorkflow) => {
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
                    IsSaveToWorkflow,
                },
            },
            () => {
                yupAllFieldsValidation(
                    { ...updatedFormData, TaxJurisdiction: ' ' },
                    updateGlobalMDMFieldRules,
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

    render() {
        const { width, height, marginBottom, location } = this.props;
        const {
            dropDownDatas,
            formData,
            selectedFilesIds,
            selectedFiles,
        } = this.state;

        const { state } = location;
        if (
            this.state.fetchingWorkflowId === true ||
            this.props.fetching ||
            !this.state.formData
        )
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
                                value={formData.Title || ''}
                                label="Title"
                                name="Title"
                                variant="outline"
                                disabled
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="WorkflowId"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                value={formData.WorkflowId || ''}
                                disabled
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                value={formData.MdmNumber || ''}
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                disabled
                            />
                        </Box>
                        <TextInput
                            autoComplete="off"
                            name="hidden"
                            type="text"
                            style={{ display: 'none' }}
                        />

                        <GlobalMdmFields
                            formData={this.state.formData}
                            formErrors={this.state.formErrors}
                            onFieldChange={this.onFieldChange}>
                            <FormRadioGroup
                                value={
                                    this.state.formData['TaxJurisdiction'] ||
                                    this.props.taxJuriData[0]
                                }
                                onChange={this.onFieldChange}
                                error={
                                    this.state.formErrors
                                        ? this.state.formErrors[
                                              'TaxJurisdiction'
                                          ]
                                        : null
                                }
                                disabled={this.props.taxJuriData.length <= 0}
                                name="TaxJurisdiction"
                                label="Tax Jurisdiction: ">
                                {this.props.taxJuriData.length > 0 ? (
                                    this.props.taxJuriData.map(
                                        (taxJuri, index) => (
                                            <FormRadio
                                                key={`taxjuri-${index}`}
                                                value={taxJuri}
                                            />
                                        )
                                    )
                                ) : (
                                    <FormRadio
                                        key={1}
                                        value={
                                            this.state.formData[
                                                'TaxJurisdiction'
                                            ]
                                        }
                                    />
                                )}
                            </FormRadioGroup>
                        </GlobalMdmFields>

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

                        <Button
                            onPress={() => this.props.history.goBack()}
                            title="Cancel"
                        />
                        <Button
                            disabled={
                                this.state.formData['TaxJurisdiction'] ===
                                    undefined ||
                                this.state.formData['TaxJurisdiction']
                                    .length === 0
                            }
                            onPress={(e) => {
                                this.setState({ formErrors: {} }, () =>
                                    this.onSubmit()
                                );
                            }}
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

const mapStateToProps = ({ customer, toasts, updateFlow }) => {
    const { taxJuriData } = customer;
    const { fetching } = updateFlow;
    return { fetching, taxJuriData, toasts };
};

export default connect(mapStateToProps, {
    updateDeltas,
    getTaxJurisdictionData,
    removeMessage,
})(Default);
