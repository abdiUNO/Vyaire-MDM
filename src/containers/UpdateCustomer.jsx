import React from 'react';
import { ScrollView, View, ActivityIndicator, Keyboard } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Button, Box, Text } from '../components/common';
import FormInput from '../components/form/FormInput';
import { Colors } from '../theme';

const apiUrl =
    'https://cors-anywhere.herokuapp.com/https://jbkxfopy91.execute-api.us-east-2.amazonaws.com/Dev';

class Page extends React.Component {
    constructor(props) {
        super(props);

        Keyboard.removeAllListeners();

        this.state = {
            loading: false,
            formData: {},
        };

        this.onSubmit.bind(this);
    }

    onSuccess = (res, customer) => {
        this.setState(
            {
                loading: false,
            },
            () => {
                this.props.history.push({
                    pathname: `/search-results`,
                    state: {
                        ...customer,
                        ...this.state.formData,
                    },
                });
            }
        );
    };

    updateCustomer = () => {
        const { location } = this.props;
        const { state } = location;
        const customer = state;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...customer,
                ...this.state.formData,
            }),
        }).then(res => this.onSuccess(res, customer));
    };

    onSubmit = () => {
        const formData = this.state.formData;
        this.setState(
            {
                formData,
                loading: true,
            },
            this.updateCustomer
        );
    };

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        const customer = state;

        if (!state || this.state.loading === true)
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
                pointerEvents={'box-none'}
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    pointerEvents={'box-none'}
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
                                value={this.state.formData.Title}
                                onChange={text =>
                                    this.setState({
                                        formData: {
                                            ...this.state.formData,
                                            Title: text,
                                        },
                                    })
                                }
                                flex={1 / 4}
                                mb={2}
                                label="Title"
                                name="title"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                value={this.state.formData.WorkFlowNumber}
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
                                value={
                                    this.state.formData.MdmNumber === undefined
                                        ? customer.MdmNumber.toString()
                                        : this.state.formData.MdmNumber
                                }
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                            />
                        </Box>
                        <Text
                            m="16px 0 16px 5%"
                            fontWeight="light"
                            color="lightBlue"
                            fontSize="28px">
                            MDM GLOBAL FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Name"
                                    value={
                                        this.state.formData.Name === undefined
                                            ? customer.Name.toString()
                                            : this.state.formData.Name
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Name: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Name 2"
                                    value={
                                        this.state.formData.Name2 === undefined
                                            ? customer.Name2.toString()
                                            : this.state.formData.Name2
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Name2: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Name 3"
                                    value={
                                        this.state.formData.Name3 === undefined
                                            ? customer.Name3.toString()
                                            : this.state.formData.Name3
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Name3: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Name 4"
                                    value={
                                        this.state.formData.Name4 === undefined
                                            ? customer.Name4.toString()
                                            : this.state.formData.Name4
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Name4: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    label="Street"
                                    required
                                    value={
                                        this.state.formData.Street === undefined
                                            ? customer.Street.toString()
                                            : this.state.formData.Street
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Street: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Street 2"
                                    value={
                                        this.state.formData.Street2 ===
                                        undefined
                                            ? customer.Street2.toString()
                                            : this.state.formData.Street2
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Street2: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="City"
                                    required
                                    value={
                                        this.state.formData.City === undefined
                                            ? customer.City.toString()
                                            : this.state.formData.City
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                City: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Region"
                                    required
                                    value={
                                        this.state.formData.Region === undefined
                                            ? customer.Region.toString()
                                            : this.state.formData.Region
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Region: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Postal Code"
                                    required
                                    value={
                                        this.state.formData.PostalCode ===
                                        undefined
                                            ? customer.PostalCode.toString()
                                            : this.state.formData.PostalCode
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                PostalCode: text,
                                            },
                                        })
                                    }
                                />
                            </Box>

                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Country"
                                    required
                                    value={
                                        this.state.formData.Country ===
                                        undefined
                                            ? customer.Country.toString()
                                            : this.state.formData.Country
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Country: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    label="Telephone"
                                    value={
                                        this.state.formData.ContactTelephone ===
                                        undefined
                                            ? customer.ContactTelephone.toString()
                                            : this.state.formData
                                                  .ContactTelephone
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactTelephone: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    label="Fax"
                                    value={
                                        this.state.formData.ContactFax ===
                                        undefined
                                            ? customer.ContactFax.toString()
                                            : this.state.formData.ContactFax
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactFax: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    label="Email"
                                    value={
                                        this.state.formData
                                            .ContactEmailAddress === undefined
                                            ? customer.ContactEmailAddress.toString()
                                            : this.state.formData
                                                  .ContactEmailAddress
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactEmailAddress: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput label="Category" />

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
                            color="lightBlue"
                            fontSize="28px">
                            SYSTEM FIELDS
                        </Text>

                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput label="System" required />
                                <FormInput label="Sold to" />
                                <FormInput label="Purpose of Request" />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput label="Role" required />
                                <FormInput label="Sales Org" required />
                            </Box>
                        </Box>

                        <Text
                            mt={5}
                            mb={2}
                            ml="5%"
                            fontWeight="light"
                            color="lightBlue"
                            fontSize="28px">
                            CONTACT PERSON
                        </Text>

                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="First Name"
                                    value={
                                        this.state.formData.ContactFirstName ===
                                        undefined
                                            ? customer.ContactFirstName.toString()
                                            : this.state.formData
                                                  .ContactFirstName
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactFirstName: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Function"
                                    value={
                                        this.state.formData.ContactFunction ===
                                        undefined
                                            ? customer.ContactFunction.toString()
                                            : this.state.formData
                                                  .ContactFunction
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactFunction: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Fax"
                                    value={
                                        this.state.formData.ContactFax ===
                                        undefined
                                            ? customer.ContactFax.toString()
                                            : this.state.formData.ContactFax
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactFax: text,
                                            },
                                        })
                                    }
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Last Name"
                                    value={
                                        this.state.formData.ContactLastName ===
                                        undefined
                                            ? customer.ContactLastName.toString()
                                            : this.state.formData
                                                  .ContactLastName
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactLastName: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Telephone"
                                    value={
                                        this.state.formData.ContactTelephone ===
                                        undefined
                                            ? customer.ContactTelephone.toString()
                                            : this.state.formData
                                                  .ContactTelephone
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactTelephone: text,
                                            },
                                        })
                                    }
                                />
                                <FormInput
                                    label="Email"
                                    value={
                                        this.state.formData
                                            .ContactEmailAddress === undefined
                                            ? customer.ContactEmailAddress.toString()
                                            : this.state.formData
                                                  .ContactEmailAddress
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                ContactEmailAddress: text,
                                            },
                                        })
                                    }
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        flex={1}
                        flexDirection="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        p="65px 15px 0px 10px"
                        m="20px 25px 25px 0px"
                        pointerEvents={'box-none'}>
                        <Button
                            onPress={this.props.history.goBack}
                            title="Cancel"
                        />

                        <Button onPress={this.onSubmit} title="Submit" />
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
