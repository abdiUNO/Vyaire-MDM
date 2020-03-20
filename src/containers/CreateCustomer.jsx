/**
 * @prettier
 */

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
import { Flex, Button, Box, Text } from '../components/common';
import {
    FormInput,
    FormSelect,
    FormRadioGroup,
    FormRadio,
} from '../components/form';
import FilesList from '../components/FilesList.js';
import idx from 'idx';

import { yupAllFieldsValidation } from '../constants/utils';
import {
    SystemType,
    SalesOrgType,
    CategoryTypes,
} from '../constants/WorkflowEnums.js';
import GlobalMdmFields from '../components/GlobalMdmFields';
import {
    createCustomerRules,
    yupglobalMDMFieldRules,
} from '../constants/FieldRules';
import DynamicSelect from '../components/DynamicSelect';
import { fetchCreateCustomerDropDownData } from '../redux/DropDownDatas';
import { createCustomer } from '../appRedux/actions/Customer.js';
import FileInput from '../components/form/FileInput.jsx';
import { ajaxGetRequest } from '../appRedux/sagas/config';
import { getTaxJurisdictionData } from '../appRedux/actions/MyTasks';
import { removeMessage } from '../appRedux/actions/Toast';
import FlashMessage, { FlashMessages } from '../components/FlashMessage';

const userId = localStorage.getItem('userId');

const SystemValidValues = Object.keys(SystemType).map(index => {
    const system = SystemType[index];
    return { id: index, description: system };
});

const SalesOrgValidValues = Object.keys(SalesOrgType).map(index => {
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
            fileErrors: {},
            dropDownDatas: {},
            taxUpdated: false,
            fetchingWorkflowId: false,
            selectedFiles: {},
            selectedFilesIds: [],
            files: [],
        };
    }

    generateWorkflowId() {
        const url =
            'https://jakegvwu5e.execute-api.us-east-2.amazonaws.com/dev';

        ajaxGetRequest(url).then(res => {
            if (res.IsSuccess)
                this.setState({
                    fetchingWorkflowId: false,
                    formData: {
                        ...initFormdData,
                        ...this.state.formData,
                        WorkflowId: res.ResultData,
                        UserId: userId,
                    },
                });
        });
    }

    componentDidMount() {
        fetchCreateCustomerDropDownData().then(res => {
            const data = res;
            this.setState({ dropDownDatas: data }, this.generateWorkflowId);
        });
    }

    updateFormData = (val, name) => {};

    getTaxJuri = () => {
        let { formData } = this.state;
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

    getAddress = formData => ({
        Country: idx(formData, _ => _.Country) || '',
        Region: idx(formData, _ => _.Region) || '',
        PostalCode: idx(formData, _ => _.PostalCode) || '',
        City: idx(formData, _ => _.City) || '',
    });

    shouldTaxJuriUpdate(prevFormData, formData) {
        const adressesObj = this.getAddress(formData);
        const prevAddress = this.getAddress(prevFormData);

        const obj = mapKeys(adressesObj, (value, key) => ({
            value,
            key,
        }));

        const addressUpdated = obj.some(({ key, value }) => {
            const prevValue = idx(prevFormData, _ => _[key]);
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

        const { formData: prevFormData } = this.state;

        this.setState(
            (prevState, props) => {
                return {
                    formData: {
                        ...prevState.formData,
                        [name]: val,
                    },
                };
            },
            () => {
                const { formData, taxUpdated } = this.state;
                if (name === 'RoleType' || name === 'CategoryTypeId') {
                    this.validateRules(name, val);
                } else if (
                    name === 'Country' ||
                    name === 'Region' ||
                    name === 'PostalCode' ||
                    name === 'City'
                ) {
                    if (name === 'Country') this.validateRules(name, val);
                    if (this.shouldTaxJuriUpdate(prevFormData, formData))
                        this.getTaxJuri();
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

    validateRules = (stateKey, stateVal) => {
        // check for CustomerPriceProcTypeId
        if (stateKey === 'CategoryTypeId') {
            if (stateVal === '5') {
                this.setFormDataValues('SalesOrgTypeId', 1);
            } else if (
                parseInt(stateVal, 10) > 0 &&
                parseInt(stateVal, 10) < 7
            ) {
                this.setFormDataValues('SalesOrgTypeId', 2);
            }
        } else if (stateKey === 'Country') {
            if (stateVal === 'CA') {
                this.setFormDataValues('CompanyCodeTypeId', 2);
            } else {
                this.setFormDataValues('CompanyCodeTypeId', 1);
            }
        }
    };

    setFormErrors = errors => {
        const { formErrors } = this.state;
        this.setState({ formErrors: errors });
    };

    proceedAction = () => {
        const { history } = this.props;
        const { selectedFilesIds, selectedFiles, formData } = this.state;
        this.props.createCustomer({
            data: {
                ...formData,
                WorkflowType: parseInt(formData.RoleTypeId, 10),
                UserId: userId,
                SystemTypeId: parseInt(formData.SystemTypeId, 10),
                RoleTypeId: parseInt(formData.RoleTypeId, 10),
                CategoryTypeId: parseInt(formData.CategoryTypeId, 10),
                SalesOrgTypeId: parseInt(formData.SalesOrgTypeId, 10),
                DistributionChannelTypeId: parseInt(
                    formData.DistributionChannelTypeId,
                    10
                ),
                DivisionTypeId: parseInt(formData.DivisionTypeId, 10),
                CompanyCodeTypeId: parseInt(formData.CompanyCodeTypeId, 10),
                TaxJurisdiction:
                    this.state.formData['TaxJurisdiction'] ||
                    this.props.taxJuriData[0],
            },
            files: selectedFilesIds.map(id => selectedFiles[id]),
            history,
        });
    };

    onSubmit = (event, schema, IsSaveToWorkflow) => {
        let { formData, selectedFilesIds, selectedFiles } = this.state;
        const { Category, ...data } = formData;
        let fileErrors = {};
        let errors = false;

        selectedFilesIds.map(id => {
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
                    { ...formData, TaxJurisdiction: ' ' },
                    merge(schema, yupglobalMDMFieldRules),
                    (...rest) => {
                        if (this.state.isFileErrors === false)
                            this.proceedAction(...rest);
                    },
                    this.setFormErrors
                );
            }
        );
    };

    selectFile = events => {
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
                                onBlur={this.onFieldChange}
                                error={
                                    this.state.formErrors
                                        ? this.state.formErrors['Title']
                                        : null
                                }
                                value={formData.Title || ''}
                                label="Title"
                                name="Title"
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
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                                disabled
                            />
                        </Box>
                        <GlobalMdmFields
                            formData={this.state.formData}
                            readOnly={false}
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
                                {this.props.taxJuriData.map(
                                    (taxJuri, index) => (
                                        <FormRadio
                                            key={`taxjuri-${index}`}
                                            value={taxJuri}
                                        />
                                    )
                                )}
                            </FormRadioGroup>
                        </GlobalMdmFields>

                        <Text
                            mt={5}
                            mb={2}
                            ml="5%"
                            fontWeight="light"
                            color="#4195C7"
                            fontSize="28px">
                            SYSTEM FIELDS
                        </Text>

                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <DynamicSelect
                                    arrayOfData={SystemValidValues}
                                    value={formData.SystemTypeId}
                                    label="System"
                                    name="SystemTypeId"
                                    isRequired
                                    formErrors={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'SystemTypeId'
                                              ]
                                            : null
                                    }
                                    onFieldChange={this.onFieldChange}
                                />
                                <DynamicSelect
                                    arrayOfData={
                                        dropDownDatas.DistributionChannelType &&
                                        dropDownDatas.DistributionChannelType.filter(
                                            role =>
                                                role.systemId ===
                                                parseInt(
                                                    formData['SystemTypeId']
                                                )
                                        )
                                    }
                                    label="Distribution Channel"
                                    name="DistributionChannelTypeId"
                                    isRequired
                                    formErrors={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'DistributionChannelTypeId'
                                              ]
                                            : null
                                    }
                                    onFieldChange={this.onFieldChange}
                                />

                                <DynamicSelect
                                    arrayOfData={
                                        dropDownDatas.DivisionType &&
                                        dropDownDatas.DivisionType.filter(
                                            role =>
                                                role.systemId ===
                                                parseInt(
                                                    formData['SystemTypeId']
                                                )
                                        )
                                    }
                                    label="Division"
                                    name="DivisionTypeId"
                                    isRequired
                                    formErrors={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'DivisionTypeId'
                                              ]
                                            : null
                                    }
                                    onFieldChange={this.onFieldChange}
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <DynamicSelect
                                    arrayOfData={
                                        dropDownDatas.RoleTypeId &&
                                        dropDownDatas.RoleTypeId.filter(
                                            role =>
                                                role.systemId ===
                                                parseInt(
                                                    formData['SystemTypeId']
                                                )
                                        )
                                    }
                                    label="Role"
                                    name="RoleTypeId"
                                    isRequired
                                    formErrors={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'RoleTypeId'
                                              ]
                                            : null
                                    }
                                    onFieldChange={this.onFieldChange}
                                />
                                <DynamicSelect
                                    arrayOfData={SalesOrgValidValues}
                                    label="Sales Org"
                                    name="SalesOrgTypeId"
                                    value={formData['SalesOrgTypeId']}
                                    isRequired
                                    formErrors={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'SalesOrgTypeId'
                                              ]
                                            : null
                                    }
                                    onFieldChange={this.onFieldChange}
                                />
                                <DynamicSelect
                                    arrayOfData={
                                        dropDownDatas.CompanyCodeTypeId &&
                                        dropDownDatas.CompanyCodeTypeId.filter(
                                            role =>
                                                role.systemId ===
                                                parseInt(
                                                    formData['SystemTypeId']
                                                )
                                        )
                                    }
                                    label="Company Code"
                                    name="CompanyCodeTypeId"
                                    value={formData['CompanyCodeTypeId']}
                                    isRequired
                                    formErrors={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'CompanyCodeTypeId'
                                              ]
                                            : null
                                    }
                                    onFieldChange={this.onFieldChange}
                                />
                                <FormInput
                                    label="Effective Date"
                                    name="EffectiveDate"
                                    error={
                                        this.state.formErrors
                                            ? this.state.formErrors[
                                                  'EffectiveDate'
                                              ]
                                            : null
                                    }
                                    type="date"
                                    onChange={(value, element) => {
                                        this.onFieldChange(
                                            new Date(value)
                                                .toJSON()
                                                .slice(0, 19),
                                            element
                                        );
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={0.79} mx="auto" alignItems="center">
                                <FormInput
                                    maxWidth="98%"
                                    label="Purpose of Request"
                                    name="Purpose"
                                    multiline
                                    numberOfLines={4}
                                    onChange={this.onFieldChange}
                                />
                            </Box>
                        </Box>

                        <FilesList
                            formErrors={this.state.fileErrors}
                            files={selectedFilesIds.map(
                                id => selectedFiles[id]
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
                            disabled={!this.props.taxJuriData[0]}
                            onPress={e => {
                                this.setState({ formErrors: {} }, () =>
                                    this.onSubmit(e, createCustomerRules, true)
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

const mapStateToProps = ({ customer, toasts }) => {
    const { fetching, error, customerdata, alert, taxJuriData } = customer;
    return { fetching, error, customerdata, alert, taxJuriData, toasts };
};

export default connect(mapStateToProps, {
    createCustomer,
    getTaxJurisdictionData,
    removeMessage,
})(Default);
