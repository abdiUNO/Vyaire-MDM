import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Card, Flex, Column } from '../components/common';
import Input from '../components/Input';
import { Colors } from '../styles';

const FormField = ({ text, placeholder, required, disabled }) => (
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

const Page = ({ width }) => {
    return (
        <View
            style={{
                paddingTop: 100,
            }}>
            <ScrollView
                style={{
                    flex: 1,
                    paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                    paddingVertical: 5,
                }}>
                <Card>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 32,
                            color: Colors.lightBlue,
                            marginBottom: 35,
                        }}>
                        MDM Global Fields
                    </Text>

                    <Flex>
                        <Column two padding="15px 45px 15px 35px">
                            <FormField text="Workflow number" />

                            <FormField text="Title" required />

                            <FormField text="MDM Number" />

                            <FormField text="Name" />
                            <FormField text="Name 2" />
                            <FormField text="Name 3" />
                            <FormField text="Name 4" />

                            <FormField text="Street" required />
                            <FormField text="Street 2" />
                            <FormField text="City" required />
                            <FormField text="Region" required />
                            <FormField text="Postal Code" required />
                        </Column>

                        <Column two padding="15px 35px 15px 45px">
                            <FormField text="Country" required />

                            <FormField text="Telephone" />

                            <FormField text="Fax" />

                            <FormField text="Email" />
                            <FormField text="Category" />

                            <FormField text="Tax Number" disabled />
                            <FormField text="DUNS Number" disabled />
                            <FormField text="SIC CODE 4" disabled />
                            <FormField text="SIC CODE 6" disabled />
                            <FormField text="SIC CODE 8" disabled />
                            <FormField text="NAICS Code" disabled />
                        </Column>
                    </Flex>

                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 32,
                            color: Colors.lightBlue,
                            marginVertical: 35,
                        }}>
                        System Fields
                    </Text>

                    <Flex>
                        <Column two>
                            <FormField text="System" required />
                            <FormField text="Sold to" />
                            <FormField text="Purpose of Request" />
                        </Column>
                        <Column two>
                            <FormField text="Role" required />
                            <FormField text="Sales Org" required />
                        </Column>
                    </Flex>
                </Card>
            </ScrollView>
        </View>
    );
};

const Default = props => (
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

export default Default;
