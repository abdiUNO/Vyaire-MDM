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
import { Flex } from '../components/common';
import { HeadCell, Row } from '../components/table';

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;

        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <ScrollView
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <table
                        style={{
                            borderWidth: 1.75,
                            borderColor: '#234382',
                            borderCollapse: 'collapse',
                            borderStyle: 'solid',
                            borderSpacing: 0,
                            borderRadius: 25,
                        }}>
                        <thead
                            style={{
                                borderCollapse: 'collapse',
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
                                    rowSpan={0}
                                    style={{ paddingLeft: 20 }}>
                                    Workflow Records
                                </HeadCell>
                                <HeadCell>WorkFlow Number</HeadCell>
                                <HeadCell>Type</HeadCell>
                                <HeadCell>Title</HeadCell>
                                <HeadCell>Customer Name</HeadCell>
                                <HeadCell>
                                    {'Date'} {'\n of Creation \n'}
                                </HeadCell>
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
                            <Row
                                style={{ height: 0, color: '#E6F5FA' }}
                                odd
                                dataArr={[
                                    '',
                                    '-----',
                                    '',
                                    '',
                                    '----------------------',
                                    '',
                                    '',
                                ]}
                            />
                            <Row dataArr={['', '', '', '', '', '', '']} />
                            <Row odd dataArr={['', '', '', '', '', '', '']} />
                            <Row dataArr={['', '', '', '', '', '', '']} />
                            <Row odd dataArr={['', '', '', '', '', '', '']} />
                            <Row dataArr={['', '', '', '', '', '', '']} />
                        </tbody>
                    </table>
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
                        <TouchableOpacity style={{ marginLeft: 16 }}>
                            <Flex
                                padding="8px 15px"
                                style={{
                                    borderRadius: 2.5,
                                    backgroundColor: '#12243F',
                                    paddingVertical: 8,
                                    paddingHorizontal: 15,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#FFFFFF',
                                        fontFamily: 'Arial',
                                        paddingRight: 5,
                                    }}>
                                    Export To
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
