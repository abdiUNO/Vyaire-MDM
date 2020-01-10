import React from 'react';
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Keyboard,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Column, Card, Button } from '../components/common';
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
                <View
                    style={{
                        flex: 1,
                        flexBasis: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 650,
                    }}>
                    <ActivityIndicator />
                </View>
            );

        return (
            <View
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <Card>
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 20,
                                paddingLeft: 45,
                            }}>
                            MDM GLOBAL FIELDS
                        </Text>
                        <Flex>
                            <Column
                                two
                                padding="15px 45px 15px 35px"
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput
                                    text="Workflow number"
                                    value={this.state.formData.WorkFlowNumber}
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                WorkFlowNumber: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    text="Title"
                                    required
                                    value={this.state.formData.Title}
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Title: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    text="MDM Number"
                                    value={
                                        this.state.formData.MdmNumber ===
                                        undefined
                                            ? customer.MdmNumber.toString()
                                            : this.state.formData.MdmNumber
                                    }
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                MdmNumber: text,
                                            },
                                        })
                                    }
                                />

                                <FormInput
                                    text="Name"
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
                                    text="Name 2"
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
                                    text="Name 3"
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
                                    text="Name 4"
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
                                    text="Street"
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
                                    text="Street 2"
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
                                    text="City"
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
                                    text="Region"
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
                                    text="Postal Code"
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
                            </Column>

                            <Column
                                two
                                padding="15px 35px 15px 45px"
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput
                                    text="Country"
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
                                    text="Telephone"
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
                                    text="Fax"
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
                                    text="Email"
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
                                <FormInput text="Category" />

                                <FormInput text="Tax Number" disabled />
                                <FormInput text="DUNS Number" disabled />
                                <FormInput text="SIC CODE 4" disabled />
                                <FormInput text="SIC CODE 6" disabled />
                                <FormInput text="SIC CODE 8" disabled />
                                <FormInput text="NAICS Code" disabled />
                            </Column>
                        </Flex>
                    </Card>

                    <Card style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 20,
                                paddingLeft: 45,
                            }}>
                            SYSTEM FIELDS
                        </Text>

                        <Flex>
                            <Column
                                two
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput text="System" required />
                                <FormInput text="Sold to" />
                                <FormInput text="Purpose of Request" />
                            </Column>
                            <Column
                                two
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput text="Role" required />
                                <FormInput text="Sales Org" required />
                            </Column>
                        </Flex>
                    </Card>

                    <Card style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 20,
                                paddingLeft: 45,
                            }}>
                            CONTACT PERSON
                        </Text>

                        <Flex>
                            <Column
                                two
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput
                                    text="First Name"
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
                                    text="Function"
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
                                    text="Fax"
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
                            </Column>
                            <Column
                                two
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput
                                    text="Last Name"
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
                                    text="Telephone"
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
                                    text="Email"
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
                            </Column>
                        </Flex>
                    </Card>

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
                            onPress={this.props.history.goBack}
                            title="Cancel"
                        />

                        <Button onPress={this.onSubmit} title="Submit" />
                    </Flex>
                </View>
            </View>
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
