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
import { Flex, Column, Card, Button, Box, Text } from '../../../components/common';
import { FormInput } from '../../../components/form';

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
                    <Box my={2} fullHeight>
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
                            m="16px 0 0 5%"
                            fontWeight="bold"
                            color="primary"
                            fontSize="18px">
                            TITLE & NO.
                        </Text>
                        <Text
                            my={2}
                            m="4px 0 16px 5%"
                            fontWeight="light"
                            color="#4195C7"
                            fontSize="28px">
                            GLOBAL MDM
                        </Text>
                        <Box flexDirection="row" mb={4} justifyContent="center">
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
                                <FormInput
                                    label="Postal Code"
                                    name="postal-code"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Country"
                                    name="country"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Additional Note"
                                    name="additional-note"
                                    multiline
                                    numberOfLines={4}
                                    variant="solid"
                                    type="text"
                                />

                                <FormInput
                                    label="Rejection Reason"
                                    name="Rejecton"
                                    multiline
                                    placeholder="Only required if the reject button is selected"
                                    numberOfLines={4}
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            float="right"
                            alignSelf="flex-end"
                            mb={25}
                            mt={6}
                            mr={5}
                            width={[0.8, 1, 1]}
                            mx="auto"
                            flexDirection="row"
                            justifyContent="flex-end"
                            alignItems="center">
                            <Button
                                onPress={() => this.props.history.goBack()}
                                title="Approve"
                            />
                            <Button title="Reject" />
                        </Box>
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
