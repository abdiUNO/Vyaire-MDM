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
import { Button, Flex, Column } from '../components/common';
import { Link } from '../navigation/router';

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
                    pathname: `/customers/${customer.MdmNumber}`,
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
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.Country}
        </Cell>
        <Cell
            style={{
                paddingLeft: 16,
                paddingRight: 12,
                borderRightWidth: 0,
            }}></Cell>
    </tr>
);

const WorkFlowRow = ({ children, customer, odd }) => (
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
                    pathname: `/customers/${customer.MdmNumber}`,
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
            Types
        </Cell>
        <Cell
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            Mr.
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            {customer.ContactFirstName} {customer.ContactLastName}
        </Cell>
        <Cell
            style={{
                paddingLeft: 16,
                paddingRight: 12,
            }}>
            12/12/2019
        </Cell>
        <Cell
            odd={odd}
            style={{
                paddingLeft: 16,
                paddingRight: 12,
                borderRightWidth: 0,
            }}>
            In Process
        </Cell>
    </tr>
);

class ResultsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        const data = state;

        if (!data)
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
                                            style={{
                                                borderRightWidth: 1,
                                                borderColor: '#234382',
                                                borderRightStyle: 'solid',
                                            }}>
                                            DUNS Number
                                        </HeadCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    <CustomerRow customer={data} />
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
                                                borderRightWidth: 1,
                                                borderColor: '#234382',
                                                borderRightStyle: 'solid',
                                            }}>
                                            Status
                                        </HeadCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    <WorkFlowRow customer={data} />
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
