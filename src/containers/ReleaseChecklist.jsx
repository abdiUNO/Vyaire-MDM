import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    CheckBox,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Column, Card, Button, Box, Text } from '../components/common';
import { FormInput } from '../components/form';

const CheckBoxItem = ({ onValueChange, stateValue, title }) => (
    <>
        <Flex
            alignLeft
            style={{
                paddingTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 15,
                marginTop: 10,
                marginBottom: 10,
                marginHorizontal: 25,
            }}>
            <CheckBox value={stateValue} onValueChange={onValueChange} />
            <Text
                my={2}
                alignSelf="flex-start"
                fontSize="16px"
                fontWeight="500"
                fontFamily="Poppins"
                backgroundColor="transparent"
                color="#22438a"
                pl={4}>
                {title}
            </Text>
        </Flex>
    </>
);

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            formData: {},
            tax: false,
            pricing: false,
            salesOperation: false,
            customerService: false,
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
                        alignSelf: 'center',
                    }}>
                    <Text
                        mt={1}
                        mb={2}
                        ml="5%"
                        fontWeight="light"
                        color="lightBlue"
                        fontSize="28px">
                        RELEASE CHECKLIST
                    </Text>

                    <Box my={2}>
                        <CheckBoxItem
                            title="Assign Sales Territory : Sales Operations"
                            stateValue={this.state.salesOperation}
                            onValueChange={() =>
                                this.setState({
                                    salesOperation: !this.state.salesOperation,
                                })
                            }
                        />
                        <CheckBoxItem
                            title="Update Freight Table : Customer Service"
                            stateValue={this.state.customerService}
                            onValueChange={() =>
                                this.setState({
                                    customerService: !this.state
                                        .customerService,
                                })
                            }
                        />
                        <CheckBoxItem
                            title="Load Pricing : Pricing"
                            stateValue={this.state.pricing}
                            onValueChange={() =>
                                this.setState({ pricing: !this.state.pricing })
                            }
                        />
                        <CheckBoxItem
                            title="Mark Customer as exempt Tax : Tax"
                            stateValue={this.state.tax}
                            onValueChange={() =>
                                this.setState({ tax: !this.state.tax })
                            }
                        />
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
                            title="SUBMIT"
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
