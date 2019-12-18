import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Card, Flex, Column } from '../components/common';
import Input from '../components/common/Input';
import { Colors } from '../styles';
import { connect } from 'react-redux';
import CustomerActions from '../redux/CustomerRedux';

const FormField = ({ text, placeholder, value, required, disabled }) => (
    <Flex alignCenter justifyAround margin="15px 0px 15px 0px">
        <View
            style={[
                {
                    flex: 0.45,
                },
                required && {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
            ]}>
            <Text
                style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: !disabled ? '#22438A' : '#63676d',
                }}>
                {text}
            </Text>
            {required && (
                <Text
                    style={{
                        color: '#e74c3c',
                        fontSize: 25,
                        textAlignVertical: 'center',
                        paddingRight: 10,
                    }}>
                    *
                </Text>
            )}
        </View>
        <Input
            value={value}
            containerstyle={{
                marginHorizontal: 0,
                flex: 1 / 2,
            }}
            clear
            required
            labelNumber={4}
        />
    </Flex>
);

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height, marginBottom, customers } = this.props;
        const customer = customers[0];

        return (
            <View
                style={{
                    backgroundColor: '#fafafa',
                    paddingTop: 50,
                }}>
                <ScrollView
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <Card>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 25,
                            }}>
                            MDM Global Fields
                        </Text>
                        <Flex>
                            <Column two padding="15px 45px 15px 35px">
                                <FormField text="Workflow number" />

                                <FormField text="Title" required />

                                <FormField
                                    text="MDM Number"
                                    value={customer.MdmNumber.toString()}
                                />

                                <FormField text="Name" value={customer.Name} />
                                <FormField
                                    text="Name 2"
                                    value={customer.Name2}
                                />
                                <FormField
                                    text="Name 3"
                                    value={customer.Name3}
                                />
                                <FormField
                                    text="Name 4"
                                    value={customer.Name4}
                                />

                                <FormField
                                    text="Street"
                                    value={customer.Street}
                                    required
                                />
                                <FormField
                                    text="Street 2"
                                    value={customer.Street2}
                                />
                                <FormField
                                    text="City"
                                    required
                                    value={customer.City}
                                />
                                <FormField
                                    text="Region"
                                    required
                                    value={customer.Region}
                                />
                                <FormField
                                    text="Postal Code"
                                    required
                                    value={customer.PostalCode}
                                />
                            </Column>

                            <Column two padding="15px 35px 15px 45px">
                                <FormField
                                    text="Country"
                                    required
                                    value={customer.Country}
                                />

                                <FormField
                                    text="Telephone"
                                    value={customer.ContactTelephone}
                                />

                                <FormField
                                    text="Fax"
                                    value={customer.ContactFax}
                                />

                                <FormField
                                    text="Email"
                                    value={customer.ContactEmailAddress}
                                />
                                <FormField text="Category" />

                                <FormField text="Tax Number" disabled />
                                <FormField text="DUNS Number" disabled />
                                <FormField text="SIC CODE 4" disabled />
                                <FormField text="SIC CODE 6" disabled />
                                <FormField text="SIC CODE 8" disabled />
                                <FormField text="NAICS Code" disabled />
                            </Column>
                        </Flex>
                    </Card>

                    <Card style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 25,
                            }}>
                            System Fields
                        </Text>

                        <Flex>
                            <Column two>
                                <FormField
                                    text="System"
                                    required
                                    value={customer.ErpSystem.Name}
                                />
                                <FormField text="Sold to" />
                                <FormField text="Purpose of Request" />
                            </Column>
                            <Column two>
                                <FormField text="Role" required />
                                <FormField
                                    text="Sales Org"
                                    required
                                    value={customer.SalesOrg.Name}
                                />
                            </Column>
                        </Flex>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

class Default extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getCustomer();
    }

    render() {
        const props = this.props;

        if (this.props.customers.length <= 0) return <View></View>;

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

const mapStateToProps = state => {
    return {
        customers: state.customers.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCustomer: () => dispatch(CustomerActions.customerRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Default);
