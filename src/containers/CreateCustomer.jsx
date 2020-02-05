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
import { resolveDependencies, passFields } from '../constants/utils';
import GlobalMdmFields from '../components/GlobalMdmFields';
import SystemFields from '../components/SystemFields';
const _ = require('lodash');
const getApollo = {
    system: 'sap-apollo',
    role: {
        label: 'Role',
        values: [
            'Sold To',
            'Ship To',
            'Payer',
            'Bill To',
            'Sales Rep',
            'Drop Ship',
        ],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: 2 }],
        },
    },
    salesOrg: {
        display: 'none',
    },
};

const getPTMN = {
    system: 'pointman',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: 2 }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 3 }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 3 }],
        },
    },
};

const getM2M = {
    system: 'made2manage',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: true,
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            oneOf: [{ role: 'ship-to' }],
        },
    },
};

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

        this.setState({
            formSchema,
        });
    };

    onFieldChange = (value, e) => {
        console.log('EL', e);
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value,
                },
            },
            () => {
                if (this.state.formData.system) this.updateSchema();
            }
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
