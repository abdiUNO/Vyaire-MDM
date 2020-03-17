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
import { Flex, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';

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
import { MaterialIcons } from '@expo/vector-icons';
import { ajaxPostRequest, ajaxGetRequest } from '../appRedux/sagas/config';

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
    IsSaveToWorkflow: true,
    WorkflowType: '',
    WorkflowId: '',
    UserId: '',
    Title: '',
    Name1: '',
    Name2: '',
    Name3: '',
    Name4: '',
    Street: '',
    Street2: '',
    City: '',
    Region: '',
    PostalCode: '',
    Country: '',
    Telephone: '',
    Fax: '',
    Email: '',
    Purpose: '',
    CategoryTypeId: '',
    RoleTypeId: '',
    SalesOrgTypeId: '',
    SystemTypeId: '',
    EffectiveDate: '',
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
            dropDownDatas: {},
            fetchingWorkflowId: false,
        };
    }

    generateWorkflowId() {
        // const url =
        //     'https://jakegvwu5e.execute-api.us-east-2.amazonaws.com/dev';
        // const jsonBody = 'test.user';
        //
        // ajaxGetRequest(url).then(res => {
        //     if (res.IsSuccess)
        this.setState({
            fetchingWorkflowId: false,
            formData: {
                ...initFormdData,
                ...this.state.formData,
                WorkflowId: 'wf000000929330356',
                UserId: 'test.user',
            },
        });
        // });
    }

    componentDidMount() {
        fetchCreateCustomerDropDownData().then(res => {
            const data = res;
            this.setState({ dropDownDatas: data }, this.generateWorkflowId);
        });
    }

    updateFormData = (val, name) => {};

    onFieldChange = (val, e) => {
        const name = e.target.name;

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
                if (name === 'RoleType' || name === 'Category') {
                    this.validateRules(name, val);
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
        if (stateKey === 'Category') {
            if (stateVal === 'direct') {
                this.setFormDataValues('SalesOrgTypeId', 1);
            } else if (CategoryTypes > 0 && CategoryTypes < 7) {
                this.setFormDataValues('SalesOrgTypeId', 2);
            }
        }
    };

    setFormErrors = errors => {
        const { formErrors } = this.state;
        this.setState({ formErrors: errors });
    };

    proceedAction = () => {
        const { history } = this.props;
        const { formData } = this.state;

        this.props.createCustomer({
            data: {
                ...formData,
                WorkflowType: parseInt(formData.RoleTypeId, 10),
                UserId: 'test.user',
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
            },
            history,
        });
    };

    onSubmit = (event, schema, IsSaveToWorkflow) => {
        let { formData } = this.state;
        this.setState(
            {
                formData: {
                    ...formData,
                    IsSaveToWorkflow,
                },
            },
            () => {
                this.proceedAction();
            }
        );
    };

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { dropDownDatas, formData } = this.state;

        console.log(this.state.formData);

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
                    minHeight="650px">
                    <ActivityIndicator />
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
                                onChange={this.onFieldChange}
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
                            onFieldChange={this.onFieldChange}
                        />

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
                                    isRequired={true}
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
                                    isRequired={true}
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
                                    isRequired={true}
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
                                    isRequired={true}
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
                                    isRequired={true}
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
                                <FormInput
                                    label="Effective Date"
                                    name={'EffectiveDate'}
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
                        {/*<SystemFields*/}
                        {/*    formData={this.state.formData}*/}
                        {/*    formSchema={this.state.formSchema}*/}
                        {/*    formErrors={this.state.formErrors}*/}
                        {/*    onFieldChange={this.onFieldChange.bind(this)}*/}
                        {/*/>*/}
                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={0.79} mx="auto" alignItems="center">
                                <FormInput
                                    maxWidth={'98%'}
                                    label="Purpose of Request"
                                    name="Purpose"
                                    multiline
                                    numberOfLines={4}
                                    onChange={this.onFieldChange}
                                />
                            </Box>
                        </Box>
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
                        <Text style={styles.statusText}>
                            {this.state.filename}
                        </Text>
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
                            onPress={e =>
                                this.onSubmit(e, createCustomerRules, false)
                            }
                            title="Save As Draft"
                        />

                        <Button
                            onPress={e =>
                                this.onSubmit(e, createCustomerRules, true)
                            }
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

const mapStateToProps = ({ customer }) => {
    const { fetching, error, customerdata } = customer;
    return { fetching, error, customerdata };
};

export default connect(mapStateToProps, { createCustomer })(Default);
