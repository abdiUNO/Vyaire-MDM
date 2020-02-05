import React from 'react';
import { ScrollView, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Button, Box, Text } from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';

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
                                    label="Street"
                                    name="street"
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
                                    label="Telephone"
                                    name="telephone"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Fax"
                                    name="fax"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Category"
                                    name="category"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    mt="10px"
                                    label="Tax Number 1"
                                    disabled
                                    name="tax-number"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="DUNS Number"
                                    disabled
                                    name="duns"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 4"
                                    disabled
                                    name="code-4"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 6"
                                    disabled
                                    name="code-6"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 8"
                                    disabled
                                    name="code-8"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="NAICS Code"
                                    disabled
                                    name="naics-code"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Text
                            mt={5}
                            mb={2}
                            ml="5%"
                            fontWeight="light"
                            color="#4195C7"
                            fontSize="28px">
                            CREDIT FIELDS
                        </Text>

                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Purpose of Request:"
                                    inline
                                    name="Purpose-of-req"
                                    variant="outline"
                                    type="text"
                                />
                                <FormSelect
                                    label="Payment Terms"
                                    name="payment-terms"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="10">Option 1</option>
                                    <option value="11">Option 1</option>
                                    <option value="12">Option 1</option>
                                </FormSelect>

                                <FormInput
                                    label="Credit Limit"
                                    name="credit-limit"
                                    variant="solid"
                                    type="text"
                                />

                                <FormSelect
                                    label="Risk Category"
                                    name="risk-category"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="10">Option 1</option>
                                    <option value="11">Option 1</option>
                                    <option value="12">Option 1</option>
                                </FormSelect>

                                <FormSelect
                                    label="Credit Rep Group"
                                    name="credit-group"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="10">Option 1</option>
                                    <option value="11">Option 1</option>
                                    <option value="12">Option 1</option>
                                </FormSelect>
                                <FormInput
                                    mt={2}
                                    label="Cred Info Number:"
                                    name="cred-info-number"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Payment Index"
                                    name="payment-index"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Last Ext Review"
                                    name="Last-review"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Rating:"
                                    name="rating"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Payer"
                                    name="payer"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Bill To"
                                    name="bill-to"
                                    variant="solid"
                                    type="text"
                                />
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
                                    numberOfLines={6}
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Text
                            mt={5}
                            mb={2}
                            ml="5%"
                            fontWeight="light"
                            color="#4195C7"
                            fontSize="28px">
                            CONTACT PERSON
                        </Text>

                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="First Name"
                                    name="first-name"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Last Name"
                                    name="last-name"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Telephone"
                                    name="telephone"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Email"
                                    name="Email"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center" />
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
