import React from 'react';
import {
    ScrollView,
    Text,
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
import { Flex, Column, Card, Button } from '../components/common';
import { Colors } from '../theme';
import FormInput, { FormInputOutline } from '../components/form/FormInput';

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
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <Card style={{ paddingBottom: 5 }}>
                        <Flex>
                            <Column
                                three
                                padding="15px 45px 15px 35px"
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput text="Title" />
                            </Column>

                            <Column
                                three
                                padding="15px 45px 15px 35px"
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInputOutline text="Workflow Number" />
                            </Column>

                            <Column
                                three
                                padding="15px 45px 15px 35px"
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInputOutline text="MDM Number" />
                            </Column>
                        </Flex>
                    </Card>
                    <Card>
                        <Text
                            style={{
                                fontSize: 32,
                                fontFamily: 'Poppins',
                                fontWeight: '300',
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
                                <FormInput text="Name" required />

                                <FormInput text="Street" />
                                <FormInput text="City" required />
                                <FormInput text="Region" required />
                                <FormInput text="Postal Code" required />
                            </Column>

                            <Column
                                two
                                padding="15px 35px 15px 45px"
                                style={{ flex: 1, alignItems: 'center' }}>
                                <FormInput text="Country" required />

                                <FormInput text="Telephone" />

                                <FormInput text="Fax" />

                                <FormInput text="Email" />
                                <FormInput text="Category" />

                                <View style={{ marginTop: 15 }}>
                                    <FormInput text="Tax Number" disabled />
                                    <FormInput text="DUNS Number" disabled />
                                    <FormInput text="SIC CODE 4" disabled />
                                    <FormInput text="SIC CODE 6" disabled />
                                    <FormInput text="SIC CODE 8" disabled />
                                    <FormInput text="NAICS Code" disabled />
                                </View>
                            </Column>
                        </Flex>
                    </Card>

                    <Card style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                fontSize: 32,
                                color: Colors.lightBlue,
                                fontFamily: 'Poppins',
                                fontWeight: '300',
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
