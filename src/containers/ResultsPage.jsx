import React, { useState } from 'react';
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
import { Button, Flex } from '../components/common';
import { Link } from '../navigation/router';

import { getMockSearchResult } from '../appRedux/sagas/config';
import {WorkflowStateType} from '../constants/WorkflowEnums';
import { Tabs } from '../components/tabs';

const HeadCell = ({ children, rowSpan, style }) => (
    <th
        rowSpan={rowSpan}
        style={{
            fontSize: 16,
            borderSpacing: 0,
            borderRightWidth: 1,
            borderColor: '#98D7DA',
            borderRightStyle: 'solid',
            paddingTop: 24,
            paddingBottom: 24,
            paddingHorizontal: 15,
            paddingLeft: 14,
            paddingRight: 16,
            textAlign: 'left',
            wordWrap: 'break-word',
            ...style,
        }}>
        {children}
    </th>
);

const Cell = ({ children, style, odd }) => (
    <td
        style={{
            borderRightWidth: 1,
            borderColor: '#98D7DA',
            borderRightStyle: 'solid',
            borderSpacing: 0,
            paddingTop: 26,
            paddingBottom: 27,
            textAlign: 'left',
            backgroundColor: odd ? '#F8F8F8' : '#FFF',
            ...style,
        }}>
        {children}
    </td>
);

const Row = ({ children, style, dataArr, odd, borderLess }) => (
    <tr>
        {dataArr.map((value, index) => {
            if (index === 0)
                return (
                    <Cell
                        key={index}
                        odd={odd}
                        borderLess={borderLess}
                        style={{
                            paddingLeft: index === 0 ? 20 : 16,
                            paddingRight: 12,
                            borderRightWidth:
                                index === dataArr.length - 1 ? 0 : 1,
                        }}>
                        <Link
                            to={{
                                pathname: `/customers/${value}`,
                                data: {},
                            }}>
                            {value}
                        </Link>
                    </Cell>
                );
            else
                return (
                    <Cell
                        key={index}
                        odd={odd}
                        style={{
                            paddingLeft: index === 0 ? 20 : 16,
                            paddingRight: 12,
                            borderRightWidth:
                                index === dataArr.length - 1 ? 0 : 1,
                        }}>
                        {value}
                    </Cell>
                );
        })}
    </tr>
);

const CustomerRow = ({ children, customer, odd }) => (
    <tr>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 20,
                paddingRight: 12,
                borderRightWidth: 1,
            }}>
            <Link
                to={{
                    pathname: `/search-results/${customer.MdmNumber}`,
                    state: customer,
                }}>
                {customer.MdmNumber}
            </Link>
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Name}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Street}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.City}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Region}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.PostalCode}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Country}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
                borderRightWidth: 0,
            }}>
            {customer.DunsNumber}
        </Cell>
    </tr>
);

const workFlowStatus = ['Draft', 'In Progress', 'Rejected', 'Approved'];
const workFlowTypes = ['Create', 'Extend', 'Update', 'Block'];

const WorkFlowRow = ({ children, workflow: customer, odd }) => (
    <tr>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 20,
                paddingRight: 12,
                borderRightWidth: 1,
            }}>
            <Link
                to={{
                    pathname: `/search-results/${customer.WorkflowId}`,
                    state: customer,
                }}>
                {customer.WorkflowId}
            </Link>
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.WorkflowType}
        </Cell>
        <Cell
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Title}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Name}
        </Cell>
        <Cell
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.CreatedDate}
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
                borderRightWidth: 0,
            }}>
            {WorkflowStateType[customer.WorkflowStatusType]}
        </Cell>
    </tr>
);

class ResultsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        getMockSearchResult().then(res => {
            this.setState({
                workflowSearchResults: res.WorkflowCustomerSearchResults,
                mdmSearchResults: res.MdmSearchResults,
            });
        });
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        const data = state;

        const { mdmSearchResults, workflowSearchResults } = this.state;

        if (!data || !mdmSearchResults)
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
                    backgroundColor: '#fff',
                    paddingTop: 40,
                    paddingBottom: 75,
                }}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    style={{
                        flex: 1,
                        marginTop: 75,
                        paddingHorizontal: width < 1400 ? 100 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <Tabs selectedIndex={0}>
                        <View
                            label="MDM"
                            style={{
                                maxWidth: 160,
                            }}>
                            <table
                                style={{
                                    zIndex: 0,
                                    borderWidth: 1.75,
                                    borderColor: '#234382',
                                    borderStyle: 'solid',
                                    borderSpacing: 0,
                                }}>
                                <thead
                                    style={{
                                        borderSpacing: 0,
                                    }}>
                                    <tr
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ddd',
                                            borderSpacing: 0,
                                            color: '#234385',
                                            backgroundColor: '#E6F5FA',
                                        }}>
                                        <HeadCell
                                            style={{
                                                paddingLeft: 20,
                                                width: 120,
                                            }}>
                                            MDM Number
                                        </HeadCell>
                                        <HeadCell>Name</HeadCell>
                                        <HeadCell>Street</HeadCell>
                                        <HeadCell>City</HeadCell>
                                        <HeadCell>State</HeadCell>
                                        <HeadCell>Zip</HeadCell>
                                        <HeadCell>Country</HeadCell>
                                        <HeadCell
                                            style={{ borderRightWidth: 0 }}>
                                            DUNS Number
                                        </HeadCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mdmSearchResults.map(customer => {
                                        console.log(customer);
                                        return (
                                            <CustomerRow
                                                customer={customer}
                                                odd
                                            />
                                        );
                                    })}
                                    <Row
                                        odd
                                        dataArr={[
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                        ]}
                                    />
                                    <Row
                                        dataArr={[
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                        ]}
                                    />
                                    <Row
                                        odd
                                        dataArr={[
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                        ]}
                                    />
                                    <Row
                                        dataArr={[
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                        ]}
                                    />
                                    <Row
                                        odd
                                        dataArr={[
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                        ]}
                                    />
                                    <Row
                                        dataArr={[
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                            '',
                                        ]}
                                    />
                                </tbody>
                            </table>
                        </View>
                        <View label="Workflow">
                            <table
                                style={{
                                    zIndex: 0,
                                    borderWidth: 1.75,
                                    borderColor: '#234382',
                                    borderStyle: 'solid',
                                    borderSpacing: 0,
                                }}>
                                <thead
                                    style={{
                                        borderSpacing: 0,
                                    }}>
                                    <tr
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ddd',
                                            borderCollapse: 'collapse',
                                            borderSpacing: 0,
                                            color: '#234385',
                                            backgroundColor: '#E6F5FA',
                                        }}>
                                        <HeadCell
                                            style={{
                                                paddingLeft: 20,
                                                width: 120,
                                            }}>
                                            Workflow Number
                                        </HeadCell>
                                        <HeadCell>Type</HeadCell>
                                        <HeadCell>Title</HeadCell>
                                        <HeadCell>Customer Name</HeadCell>
                                        <HeadCell>Date of Creation</HeadCell>
                                        <HeadCell
                                            style={{
                                                borderRightWidth: 0,
                                            }}>
                                            Status
                                        </HeadCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(workflow => (
                                        <WorkFlowRow workflow={workflow} />
                                    ))}
                                    <Row
                                        odd
                                        dataArr={['', '', '', '', '', '']}
                                    />
                                    <Row dataArr={['', '', '', '', '', '']} />
                                    <Row
                                        odd
                                        dataArr={['', '', '', '', '', '']}
                                    />
                                    <Row dataArr={['', '', '', '', '', '']} />
                                    <Row
                                        odd
                                        dataArr={['', '', '', '', '', '']}
                                    />
                                    <Row dataArr={['', '', '', '', '', '']} />
                                </tbody>
                            </table>
                        </View>
                    </Tabs>

                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 70,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 15,
                            marginTop: 20,
                            marginBottom: 10,
                            marginHorizontal: 25,
                        }}>
                        <Button
                            onPress={() =>
                                this.props.history.push('/customers/create')
                            }
                            title="Create New"
                        />
                        <TouchableOpacity
                            style={{
                                paddingHorizontal: 12,
                                paddingTop: 10.2,
                                paddingBottom: 8.5,
                                backgroundColor: '#12243F',
                                borderRadius: 2.5,
                                marginRight: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Flex padding="0px">
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: '#FFFFFF',
                                        textAlignVertical: 'center',
                                        textAlign: 'center',
                                        paddingTop: 1,
                                        paddingRight: 5,
                                        fontFamily: 'Poppins',
                                        fontWeight: '400',
                                    }}>
                                    EXPORT TO
                                </Text>
                                <Image
                                    source={require('../../assets/icons/excel_icon@2x.png')}
                                    style={{
                                        width: 17.5,
                                        height: 16,
                                    }}
                                />
                            </Flex>
                        </TouchableOpacity>
                    </Flex>
                </ScrollView>
            </View>
        );
    }
}

class Default extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        const props = this.props;

        return (
            <DimensionAware
                render={dimensions => (
                    <ResultsPage
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
