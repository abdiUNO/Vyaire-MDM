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
import { Flex, Column, Card, Button, Box, Text } from '../../components/common';
import { FormInput } from '../../components/form';

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            formData: {},
        };
    }

    render() {
        const { width, height, marginBottom, location } = this.props;

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 60 : width * 0.1,
                        paddingBottom: 10,
                    }}>
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
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                            />
                        </Box>

                        <Text
                            my={2}
                            alignSelf="flex-start"
                            fontWeight="light"
                            color="lightBlue"
                            fontSize="xlarge"
                            pl={4}>
                            GLOBAL MDM FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Name"
                                    name="name"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Name 2"
                                    name="name2"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Name 3"
                                    name="name3"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Name 4"
                                    name="name4"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Street"
                                    name="street"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Street 2"
                                    name="street2"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="City"
                                    name="city"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Region"
                                    name="region"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center" />
                        </Box>

                        <Text
                            mt={5}
                            mb={2}
                            alignSelf="flex-start"
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            CUSTOMER MASTER FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="License Number"
                                    name="License"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="License Expiration Date"
                                    name="License-Expiratin"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Search Term 1"
                                    name="search-1"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Search Term 2"
                                    name="search-2"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Customer Class"
                                    placeholder="Choose from..."
                                    name="customer-class"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Industry Code"
                                    placeholder="Choose from..."
                                    name="Industry"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Company Code"
                                    placeholder="Choose from..."
                                    name="Company-Expiratin"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Distribution Channel"
                                    name="Distribution-1"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Division"
                                    name="Division-2"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Transportation Zone"
                                    name="Transportation-class"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Box mt={4} flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Industry"
                                    name="ndustry"
                                    variant="solid"
                                    placeholder="Choose from..."
                                    type="text"
                                />
                                <FormInput
                                    label="Tax Number"
                                    name="tax-number"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Recon Account"
                                    placeholder="Choose from..."
                                    name="recon-account"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Sort Key"
                                    name="sort-key"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Rejection Reason"
                                    multiline
                                    numberOfLines={6}
                                    name="Rejecton"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Text Type"
                                    name="text-type"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="System Text"
                                    multiline
                                    numberOfLines={8}
                                    name="system-text"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                        </Box>
                    </Box>

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
                            onPress={() => this.props.history.goBack()}
                            title="Approve"
                        />
                        <Button title="Reject" />
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
