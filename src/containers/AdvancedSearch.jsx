import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Column, Flex, Card, Button, Box } from '../components/common';
import { Colors } from '../theme';
import FormInput from '../components/form/FormInput';
import { advanceSearchCustomer } from '../appRedux/actions/Customer';
import { connect } from 'react-redux';
import Loading from '../components/Loading';
import FlashMessage, { FlashMessages } from '../components/FlashMessage';
import { removeMessage } from '../appRedux/actions';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            mdmDisabled: false,
            workFlowDisabled: false,
            remainderDisabled: false,
            loading: this.props.fetching,
        };
    }

    componentWillReceiveProps(newProps) {
        // if (newProps.searchResult != this.props.searchResult) {
        //     this.props.history.push({
        //         pathname: `/search/results`,
        //         state: newProps.searchResult,
        //     });
        // }
        if (newProps.fetching != this.props.fetching) {
            if (newProps.fetching) {
                this.setState({
                    workFlowDisabled: false,
                    mdmDisabled: false,
                    remainderDisabled: false,
                });
            }
            this.setState({
                loading: newProps.fetching,
            });
        }
    }

    onFieldChange = (value, e) => {
        const { formData } = this.state;
        const { name } = e.target;
        const keys = [
            'Name',
            'Street',
            'city',
            'State',
            'Zip',
            'Country',
            'DunsNumber',
            'TaxIDOrVATRegNumber',
        ];

        formData[name] = value;
        const ids = ['workflowid', 'mdmNumber'];

        const touched = keys.some(
            (key) => formData[key] && formData[key].length > 0
        );

        const idsTouched = ids.some(
            (key) => formData[key] && formData[key].length > 0
        );

        const anyTouched = touched || idsTouched;

        if (anyTouched) {
            if (idsTouched) {
                this.setState({
                    workFlowDisabled: name === ids[1],
                    mdmDisabled: name === ids[0],
                    remainderDisabled: true,
                });
            } else {
                this.setState({
                    workFlowDisabled: true,
                    mdmDisabled: true,
                    remainderDisabled: false,
                });
            }
        } else {
            this.setState({
                workFlowDisabled: false,
                mdmDisabled: false,
                remainderDisabled: false,
            });
        }

        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value.trim(),
            },
        });
    };

    onSubmit = () => {
        window.scrollTo(0, 0);

        const keys = [
            'Name',
            'Street',
            'city',
            'State',
            'Zip',
            'Country',
            'DunsNumber',
            'TaxIDOrVATRegNumber',
        ];

        let {
            formData = {
                Name: 'name',
                Street: 'street',
                City: null,
                State: null,
                Zip: null,
                Country: null,
                DunsNumber: null,
                TaxIDOrVATRegNumber: null,
            },
        } = this.state;

        try {
            let searchModel = {
                CustomerSearchType: 3,
                CustomerMasterSearchHits: {
                    from: 0,
                    size: 10,
                },
                WorkflowSearchHits: {
                    from: 0,
                    size: 10,
                },
            };

            var postData = {
                ...searchModel,
                ...formData,
            };

            if (formData['workflowid'] && formData['workflowid'].length > 0) {
                postData.CustomerSearchType = 1;
                postData['mdmNumber'] = null;
            } else if (
                formData['mdmNumber'] &&
                formData['mdmNumber'].length > 0
            ) {
                postData.CustomerSearchType = 2;
                postData['workflowid'] = null;
            } else {
                postData.CustomerSearchType = 3;
                postData['mdmNumber'] = null;
                postData['workflowid'] = null;
            }

            this.setState({ formData: {} }, () =>
                this.props.advanceSearchCustomer(postData, this.props.history)
            );

            // this.resetForm();
        } catch (error) {
            console.log('form validtion error');
        }
    };

    render() {
        const { mdmDisabled, workFlowDisabled, remainderDisabled } = this.state;
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        const customer = state;
        if (this.state.loading) {
            return <Loading />;
        }

        const readOnly = {
            inline: false,
            disabled: true,
            readOnly: true,
        };

        const editable = {
            inline: false,
            readOnly: false,
            onBlur: this.onFieldChange,
            onSubmit: this.onSubmit,
            onSubmitEditing: this.onSubmit,
        };

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    height: '100vh',
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
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
                            Advance Search
                        </Text>
                        <Flex>
                            <Column
                                padding="15px 45px 15px 55px"
                                style={{
                                    flex: 1,
                                    alignItems: 'flex-start',
                                }}>
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="workflowid"
                                    label="Workflow Id"
                                    my={1}
                                    {...(workFlowDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="mdmNumber"
                                    label="MDM Number"
                                    my={1}
                                    {...(mdmDisabled ? readOnly : editable)}
                                    autoComplete="off"
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="Name"
                                    label="Name"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                    autoComplete="off"
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="street"
                                    label="Street"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                    autoComplete="off"
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="city"
                                    label="City"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                    autoComplete="off"
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="State"
                                    label="State"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                    autoComplete="off"
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="Zip"
                                    label="Zip Code"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                    autoComplete="off"
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="DunsNumber"
                                    label="DUNS Number"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="TaxIDOrVATRegNumber"
                                    label="Tax ID/ VAT Reg No:"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                            </Column>
                        </Flex>
                    </Card>
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
                            onPress={(event) => this.onSubmit()}
                            title="Submit"
                        />
                        <Button
                            title="Cancel"
                            onPress={() => this.props.history.goBack()}
                        />
                    </Flex>
                </View>
            </ScrollView>
        );
    }
}

class Default extends React.Component {
    render() {
        const props = this.props;

        return (
            <DimensionAware
                render={(dimensions) => (
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

const mapStateToProps = ({ customer }) => {
    const { searchResult, customerdata, fetching, alert } = customer;
    return { searchResult, customerdata, fetching, alert };
};

export default connect(mapStateToProps, {
    advanceSearchCustomer,
    removeMessage,
})(Default);
