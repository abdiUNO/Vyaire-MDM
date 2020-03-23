import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Column, Flex, Card, Button } from '../components/common';
import { Colors } from '../theme';
import FormInput from '../components/form/FormInput';
import { advanceSearchCustomer } from '../appRedux/actions/Customer';
import { connect } from 'react-redux';
import Loading from '../components/Loading';

const userId = localStorage.getItem('userId');

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: { userId: userId },
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
            this.setState({
                loading: newProps.fetching,
            });
        }
    }

    onFieldChange = (value, e) => {
        const { formData } = this.state;
        const { name } = e.target;
        const keys = [
            'name',
            'street',
            'city',
            'state',
            'zip',
            'country',
            'dunsNumber',
            'taxIDOrVATRegNumber',
        ];

        formData[name] = value;
        const ids = ['workflowid', 'mdmNumber'];

        const touched = keys.some(
            key => formData[key] && formData[key].length > 0
        );

        const idsTouched = ids.some(
            key => formData[key] && formData[key].length > 0
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
        let {
            formData = {
                name: 'name',
                street: 'street',
                city: null,
                state: null,
                zip: null,
                country: null,
                dunsNumber: null,
                taxIDOrVATRegNumber: null,
            },
        } = this.state;

        try {
            let searchModel = {
                customerSearchType: 3,
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
                postData.customerSearchType = 1;
                postData['mdmNumber'] = null;
            } else if (
                formData['mdmNumber'] &&
                formData['mdmNumber'].length > 0
            ) {
                postData.customerSearchType = 2;
                postData['workflowid'] = null;
            } else {
                postData.customerSearchType = 3;
                postData['mdmNumber'] = null;
                postData['workflowid'] = null;
            }

            this.props.advanceSearchCustomer(postData, this.props.history);

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
            style: { lineHeight: '2.075' },
        };
        const editable = {
            inline: false,
            readOnly: false,
            onBlur: this.onFieldChange,
        };

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
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="name"
                                    label="Name"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="street"
                                    label="Street"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="city"
                                    label="City"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="state"
                                    label="State"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="zip"
                                    label="Zip Code"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="dunsNumber"
                                    label="DUNS Number"
                                    my={1}
                                    {...(remainderDisabled
                                        ? readOnly
                                        : editable)}
                                />
                                <FormInput
                                    onChange={this.onFieldChange}
                                    name="taxIDOrVATRegNumber"
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
                            onPress={event => this.onSubmit()}
                            title="Submit"
                        />
                        <Button
                            title="Cancel"
                            onPress={event => this.onSubmit()}
                        />
                    </Flex>
                </View>
            </View>
        );
    }
}

class Default extends React.Component {
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

const mapStateToProps = ({ customer }) => {
    const { searchResult, customerdata, fetching } = customer;
    return { searchResult, customerdata, fetching };
};

export default connect(mapStateToProps, { advanceSearchCustomer })(Default);
