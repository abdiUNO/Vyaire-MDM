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
import { Flex } from '../../components/common';
import { Table, TableWrapper, Row, Rows, Cell } from '../../components/table';
import { fetchWorkFlow } from '../../redux/mockdata';
import { Link } from '../../navigation/router';
const workFlowStatus = ['Draft', 'In Progress', 'Rejected', 'Approved'];
const workFlowType = ['Create', 'Extend', 'Update', 'Block'];

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableHead: [
                'Workflow Records',
                'Type',
                'Title',
                'Name',
                'Street',
                'City',
                'State',
                'Zip Code',
                'Country',
                'Status',
            ],
            tableData: [
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', ''],
            ],
        };
    }

    componentDidMount(): void {
        //this.fetchTableData();
    }

    fetchTableData() {
        fetchWorkFlow().then(res => {
            const workFlows = res.WorkflowCustomerSearchResults;
            let data = [];

            data = workFlows.map((workflow, index) => [
                index + 1,
                <Link
                    style={{
                        paddingTop: 26,
                        paddingBottom: 27,
                        paddingLeft: 20,
                    }}
                    to={{
                        pathname: `/my-requests/${workflow.WorkflowId}`,
                        state: workflow,
                    }}>
                    {workflow.WorkflowId}
                </Link>,

                workFlowType[workflow.WorkflowType - 1],
                workflow.WorkflowTitle,
                workflow.CustomerName,
                new Date(workflow.WorkflowDateCreated).toLocaleDateString(),
                workFlowStatus[workflow.WorkflowStatusType - 1],
            ]);

            this.setState({ tableData: [...data, ...this.state.tableData] });
        });
    }

    renderRequests() {
        return (
            <Table
                border="1px solid #234382"
                borderStyle={{
                    borderWidth: 1,
                    borderRightWidth: 1,
                    borderColor: '#98D7DA',
                    borderRightStyle: 'solid',
                }}>
                <Row
                    flexArr={[1.75, 1, 1, 1, 1.75, 1, 1, 1, 1, 1]}
                    data={this.state.tableHead}
                    style={{
                        backgroundColor: '#E6F5FA',
                        minHeight: 100,
                    }}
                    borderStyle={{
                        borderWidth: 0,
                        borderTopWidth: 0,
                        borderRightWidth: 1,
                        borderColor: '#98D7DA',
                        borderRightStyle: 'solid',
                    }}
                    textStyle={{
                        textAlign: 'left',
                        color: '#234385',
                        fontWeight: '500',
                        fontFamily: 'Poppins',
                        fontSize: 17,
                        paddingTop: 24,
                        paddingBottom: 24,
                        paddingHorizontal: 15,
                    }}
                />
                <Rows
                    flexArr={[1.75, 1, 1, 1, 1.75, 1, 1, 1, 1, 1]}
                    data={this.state.tableData}
                    style={{ minHeight: 75 }}
                    borderStyle={{
                        borderWidth: 0,
                        borderTopWidth: 0,
                        borderRightWidth: 1,
                        borderColor: '#98D7DA',
                        borderRightStyle: 'solid',
                    }}
                    textStyle={{
                        color: '#353535',
                        fontSize: 15,
                        fontFamily: 'Poppins',
                        borderColor: '#98D7DA',
                        paddingTop: 26,
                        paddingBottom: 27,
                        paddingLeft: 20,
                        textAlign: 'left',
                        backgroundColor: '#F8F8F8',
                    }}
                />
            </Table>
        );
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
                    keyboardShouldPersistTaps="always"
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    {this.renderRequests()}
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
                                    source={require('../../../assets/icons/excel_icon@2x.png')}
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
