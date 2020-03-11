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
import { Flex, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';

import { yupAllFieldsValidation } from '../constants/utils';
import { SystemType, SalesOrgType } from '../constants/WorkflowEnums.js';
import GlobalMdmFields from '../components/GlobalMdmFields';
import {
    createCustomerRules,
    yupglobalMDMFieldRules,
} from '../constants/FieldRules';
import DynamicSelect from '../components/DynamicSelect';
import { fetchCreateCustomerDropDownData } from '../redux/DropDownDatas';
import { createCustomer } from '../appRedux/actions/Customer.js';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
const SystemValidValues = Object.keys(SystemType).map(index => {
    const system = SystemType[index];
    return { id: index, description: system };
});

const SalesOrgValidValues = Object.keys(SalesOrgType).map(index => {
    const system = SalesOrgType[index];
    return { id: index, description: system, value: system };
});

const CategoryTypes = {
    distributor: 1,
    'self-distributor': 2,
    oem: 3,
    kitter: 4,
    direct: 5,
    dropship: 6,
    other: 7,
};

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
    WorkflowType: null,
    WorkflowId: null,
    UserId: null,
    Title: null,
    Name1: null,
    Name2: null,
    Name3: null,
    Name4: null,
    Street: null,
    Street2: null,
    City: null,
    Region: null,
    PostalCode: null,
    Country: null,
    Telephone: null,
    Fax: null,
    Email: null,
    Purpose: null,
    CategoryTypeId: null,
    RoleTypeId: null,
    SalesOrgTypeId: null,
    SystemTypeId: null,
    EffectiveDate: null,
};

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            system: '',
            role: '',
            formData: initFormdData,
            dropDownDatas: {},
            fetchingWorkflowId: false,
        };

        this.updateFormData = _.debounce(this.updateFormData, 250);
    }

    generateWorkflowId() {
        fetch('https://jakegvwu5e.execute-api.us-east-2.amazonaws.com/dev', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization:
                    'eyJraWQiOiJcL0FlUjBPNHR3SU8xU1V2bHEyUjdDa2UxajJsSEltTmRJZFJMUVUyelwvdHM9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiZmI4R0RJOXR1UGZQSEVwYVN3NFNMZyIsInN1YiI6IjNhMDkzODRiLTFiNWYtNDdlZC1iMjU0LTA1YzRlZGEzOWQ4YSIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMl9heDJwbnNvU3JfY3VzdG9tZXJtbWFzdGVybWRtZGV2Il0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfYXgycG5zb1NyIiwiY29nbml0bzp1c2VybmFtZSI6ImN1c3RvbWVybW1hc3Rlcm1kbWRldl9BYmR1bGxhaGkuTWFoYW1lZEBWeWFpcmUuY29tIiwiZ2l2ZW5fbmFtZSI6IkFiZHVsbGFoaSIsImN1c3RvbTp1c2VyZ3JvdXBzIjoiWzdjNTU3NTE2LTJkZmMtNDlhNi1hM2Q0LWZhZTc0NzNkYjY3MywgOWE2MGYyZTAtN2EyYi00MDNmLWFmYTUtZTEwMjY1NDY5ODFiLCA5OTVlNGNjYS0wZWMxLTQwMmUtYjQxMC0wMDcwMGZlMzM4YjgsIDkwMGY3NTM3LWUyYWEtNGZiZi04MDczLWYyZGFjYTg4N2VjYSwgMjE1MzY4ZDMtMjFiYi00YjI0LWFiYjYtZWM5YTZhZWMzOTJjLCAwYWE3MTQ0MS1lZjdhLTRmYjAtOTM4YS00ZjQwZDJhNjZkMzksIGI0ZjhhNTNiLWI5NGMtNDBiMi1hNjQzLWQ1N2EwNjJlNzlmZSwgY2I0NTUxNTMtMmRiOC00ZjZlLTk4ODItOWNkMjE5N2ZmNGE0LCBhMzRlYWEzYy1iYTEwLTQ2ZjAtYThiNS02ZjQ3OGM1ZDljOGUsIDE3NzJlMmIyLTdhNjYtNDhlMC05ODUwLTJlZDYwNTg3Nzc0NSwgMzY2Y2QzZDQtNmVhNS00ZDU5LTgzNzItOGU2YTI2MjU4ZWNhLCA5MTg2N2E5NS01YzQ4LTQ5MjEtYjc1YS05OWY2ZjkyNzU2OTAsIGQzZDdkMmZmLTBiZGQtNGMyMy1iNWFiLTY4MDA4NTdlNTQ4Y10iLCJjdXN0b206c3VybmFtZSI6Ik1haGFtZWQiLCJhdWQiOiIybjU5bWx0ZnVyb2lsamVsNDlwam91bm10ZCIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IkFiZHVsbGFoaS5NYWhhbWVkQFZ5YWlyZS5jb20iLCJwcm92aWRlck5hbWUiOiJjdXN0b21lcm1tYXN0ZXJtZG1kZXYiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL3N0cy53aW5kb3dzLm5ldFwvNjdjZjRhZDQtNmExYS00YTAxLTlkZmUtYWY5NGMxYWRiYzA3XC8iLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTU4MDgyNjM0MDc1NSJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1ODM4NTk1ODAsIm5hbWUiOiJBYmR1bGxhaGkuTWFoYW1lZEBWeWFpcmUuY29tIiwiZXhwIjoxNTgzODYzMTgwLCJpYXQiOjE1ODM4NTk1ODAsImVtYWlsIjoiQWJkdWxsYWhpLk1haGFtZWRAdnlhaXJlLmNvbSJ9.AZkjoQvyC-ztqEtWOSXG3IjKA7a4NYz5k_PXe9snB6Qn0fZJeoydFD4PiNgoVab3cJt116TkFK9rz06sCUvDG31vZO7sc6AQKdegl1l7XAW653SD6Wsyn2bb5tGzAZWIsmuqSOa3BE_mNmWI97GtG4Rq96WLbKFbdOK_yO6HI904Z9G8Mo3zAGbm7X-nZZW8QVWbuTAyvwrV86HINOzm8RnHcuZhoE8FBZV83gPTL36wMiGWqr8zoxUugB_7NZAUkGIk-ie_WXCRbUh-imaIA5pzYT1ul7Pzg_wCVIIBodZ4eGyhCgrC_VmbEdsK09WTEauvdglrlOs9By5WfpacpQ',
                'Content-Type': 'application/json',
            },
            body: `${'"customermaster.user"'}`,
        })
            .then(res => res.json())
            .then(res => {
                if (res.IsSuccess)
                    this.setState({
                        fetchingWorkflowId: false,
                        formData: {
                            ...initFormdData,
                            ...this.state.formData,
                            WorkflowId: res.ResultData,
                            UserId: 'customerservice.user',
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

    onFieldChange = (val, e) => {
        e.preventDefault();
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
            } else if (
                stateVal === 'distributor' ||
                stateVal === 'self-distributor' ||
                stateVal === 'oem' ||
                stateVal === 'kitter' ||
                stateVal === 'dropship'
            ) {
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
                WorkflowType: formData.RoleTypeId,
                UserId: 'customermaster.user',
                CategoryTypeId: CategoryTypes[formData['Category']],
                SystemTypeId: parseInt(formData.SystemTypeId),
                RoleTypeId: parseInt(formData.RoleTypeId),
                DistributionChannelTypeId: parseInt(
                    formData.DistributionChannelTypeId
                ),
                DivisionTypeId: parseInt(formData.DivisionTypeId),
                CompanyCodeTypeId: parseInt(formData.CompanyCodeTypeId),
            },
        });
    };

    onSubmit = (event, schema, IsSaveToWorkflow) => {
        let { formData } = this.state;
        const { Category, ...data } = formData;
        this.setState(
            {
                formData: {
                    ...data,
                    IsSaveToWorkflow,
                },
            },
            () => {
                yupAllFieldsValidation(
                    formData,
                    merge(schema, yupglobalMDMFieldRules),
                    this.proceedAction,
                    this.setFormErrors
                );
            }
        );
    };

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { dropDownDatas, formData } = this.state;

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
                                value={formData.Title}
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
                                value={formData.WorkflowId}
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
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
