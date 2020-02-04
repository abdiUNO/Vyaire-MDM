import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Column, Card, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';
import GlobalMdmFields from '../components/GlobalMdmFields';
import SystemFields from '../components/SystemFields';

const _ = require('lodash');

const resolveDependencies = (dependencies, schema, obj) => {
    const condFields = _.reduce(dependencies, (sum, dependency, index) => ({
        ...sum,
        ...dependency,
    }));

    return {
        ...schema,
        display: !_.isMatch(obj, condFields) ? 'none' : 'block',
    };
};

const passFields = (_system, fields) => {
    console.log(fields);
    const config = _.mapValues(_system(fields), (schema, fieldKey, obj) => {
        const { dependencies, ...rest } = schema;

        if (!dependencies) {
            return _.isObject(schema)
                ? { ...rest, name: fieldKey, display: 'block' }
                : schema;
        } else {
            const rests = _.map(dependencies, (val, key) => {
                if (key === 'allOf') {
                    return resolveDependencies(val, rest, fields);
                }
            });

            return _.reduce(rests, (sum, n) => console.log(sum, n));
        }
    });

    return config;
};

const getPTMN = fields => ({
    system: 'sap-apollo',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            allOf: [{ role: 'ship-to' }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        required: true,
        dependencies: {
            allOf: [{ role: 'sales-rep' }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        required: true,
        dependencies: {
            allOf: [{ role: 'sales-rep' }],
        },
    },
    salesOrg: {
        label: 'Sales Org',
        required: true,
        display:
            fields.system === ('sap-apollo' || 'sap-olympus')
                ? 'block'
                : 'none',
    },
});

const getM2M = fields => ({
    system: 'made2manage',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: true,
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            allOf: [{ role: 'ship-to' }, { costCenter: 'test' }],
        },
    },
    salesOrg: {
        label: 'Sales Org',
        required: true,
        display:
            fields.system === ('sap-apollo' || 'sap-olympus')
                ? 'block'
                : 'none',
    },
});

const buildSchema = fields => ({
    ...(fields.system === 'pointman' && {
        role: {
            label: 'Role',
            values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
            required: false,
        },
        soldTo: {
            label: 'Sold To/Bill To',
            display:
                fields.system === 'pointman' && fields.role === 'ship-to'
                    ? 'block'
                    : 'none',
        },
        costCenter: {
            label: 'Sales Sample Cost Center',
            required: true,
            display:
                fields.system === 'pointman' && fields.role === 'sales-rep'
                    ? 'block'
                    : 'none',
        },
        subCostCenter: {
            label: 'Sales Sample Sub Cost Center',
            required: true,
            display:
                fields.system === 'pointman' && fields.role === 'sales-rep'
                    ? 'block'
                    : 'none',
        },
        salesOrg: {
            label: 'Sales Sample Sub Cost Center',
            required: fields.system === ('sap-apollo' || 'sap-olympus'),
            display:
                fields.system === ('sap-apollo' || 'sap-olympus')
                    ? 'block'
                    : 'none',
        },
    }),
    ...(fields.system === 'made2manage' && {
        role: {
            label: 'Role',
            values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
            required: true,
        },
        soldTo: {
            label: 'Sold To/Bill To',
            display:
                fields.role === 'ship-to'
                    ? 'block'
                    : fields.role === 'sales-rep'
                    ? 'block'
                    : 'none',
        },
        costCenter: { display: 'none' },
        subCostCenter: { display: 'none' },
        salesOrg: { display: 'none' },
    }),
    ...(fields.system === 'sap-apollo' && {
        role: {
            label: 'Role',
            values: [
                'Sold To (0001)',
                'Ship To (0001)',
                'Payer (0003)',
                'Bill To (0004)',
                'Sales Rep (0001)',
                'Drop Ship (0001)',
            ],
            required: true,
        },
        salesOrg: {
            label: 'Sales Org',
            values: ['0150', '0120', '0130', 'N/A'],
            value:
                fields.country === 'CA'
                    ? '0150'
                    : fields.role === 'sales-rep-0001'
                    ? '0120'
                    : fields.category === 'direct'
                    ? '0120'
                    : fields.category === 'distributor' ||
                      fields.category === 'oem' ||
                      fields.category === 'kitter' ||
                      fields.category === 'dropship'
                    ? '0130'
                    : 'N/A',
            required: true,
        },
        soldTo: { display: 'none' },
        costCenter: { display: 'none' },
        subCostCenter: { display: 'none' },
    }),
    ...(fields.system === '' && {
        role: {
            label: 'Role',
            values: [],
            required: true,
        },
        salesOrg: {
            label: 'Sales Org',
            values: [],
            display: 'none',
        },
        soldTo: { display: 'none' },
        costCenter: { display: 'none' },
        subCostCenter: { display: 'none' },
    }),
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            system: '',
            role: '',
            formData: {},
            formSchema: passFields(getPTMN, {}),
        };
    }

    updateSchema = () => {
        let system = this.state.formData.system;
        var objects = [
            passFields(getPTMN, this.state.formData),
            passFields(getM2M, this.state.formData),
        ];

        const formSchema = _.filter(
            objects,
            _.conforms({
                system(n) {
                    return n === system;
                },
            })
        )[0];

        console.log(this.state.formData, formSchema);

        this.setState({
            formSchema,
        });
    };

    onFieldChange = (value, e) => {
        console.log(e);
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value,
                },
            },
            this.updateSchema
        );
    };

    render() {
        const { width, height, marginBottom, location } = this.props;

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
                                label="Title"
                                name="title"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
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

                        <GlobalMdmFields onFieldChange={this.onFieldChange} />
                        <SystemFields
                            formData={this.state.formData}
                            formSchema={this.state.formSchema}
                            onFieldChange={this.onFieldChange}
                        />
                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={0.79} mx="auto" alignItems="center">
                                <FormInput
                                    maxWidth={'98%'}
                                    label="Purpose of Request"
                                    name="purpose-request"
                                    multiline
                                    numberOfLines={4}
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
                        <Button
                            onPress={() => this.props.history.goBack()}
                            title="Cancel"
                        />
                        <Button title="Save As Draft" />

                        <Button
                            onPress={() =>
                                this.props.history.push(
                                    '/customers/create-additional'
                                )
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

export default Default;
