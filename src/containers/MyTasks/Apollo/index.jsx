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
import { Box, Flex } from '../../../components/common';
import {
    Table,
    TableWrapper,
    Row,
    Rows,
    Cell,
} from '../../../components/table';
import { fetchWorkFlow } from '../../../redux/mockdata';
import { Link } from '../../../navigation/router';
import withLoader from '../../../components/withLoader';
import { connect } from 'react-redux';
import { getWorkflows } from '../../../appRedux/actions';
import {
    WorkflowTaskStateType,
    WorkflowType,
    WorkflowTeamTypeRouteAddress,
    TaskType,
    WorkflowTeamType,
    WorkflowStateType,
    WorkflowTaskType,
    getWorkflowRouteAddress,
} from '../../../constants/WorkflowEnums';
// const workFlowStatus = ['New', 'In Progress', 'Approved', 'Rejected'];
// const workFlowType = ['Create', 'Extend', 'Update', 'Block'];
import FlashMessage from '../../../components/FlashMessage';

const DataTable = ({ tableHead, workflowTasks }) => {
    let tableData = [];
    var tdata;
    let td = workflowTasks.map((wfTask, index) => {
        var linkClassname =
            WorkflowTeamTypeRouteAddress[wfTask.WorkflowTeamType] === '#'
                ? 'disable-link'
                : 'enable-link';
        var navigateTo = getWorkflowRouteAddress(wfTask);

        // if Workflowstatetpe inprogress & WorkflowTaskStateType ReadyForProcessing then not readonly
        var readOnlyStatus = !(
            wfTask.WorkflowStateType == 2 && wfTask.WorkflowTaskStateType == 2
        );

        // console.log(wfTask.WorkflowId);

        tdata = [
            <Link
                style={{
                    paddingTop: 26,
                    paddingBottom: 27,
                    paddingLeft: 20,
                    paddingRight: 15,
                    overflowWrap: 'break-word',
                }}
                className={linkClassname}
                to={{
                    pathname: navigateTo,
                    state: {
                        TaskId: wfTask.TaskId,
                        isReadOnly: readOnlyStatus,
                        WorkflowId: wfTask.WorkflowId,
                        TeamId: wfTask.WorkflowTeamType,
                    },
                }}>
                {wfTask.WorkflowId}
            </Link>,
            WorkflowTaskType[wfTask.WorkflowTaskType],
            WorkflowTeamType[wfTask.WorkflowTeamType],
            TaskType[wfTask.WorkflowType],
            ` Workflow: ${
                WorkflowStateType[wfTask.WorkflowStateType]
            }\n Task: ${WorkflowTaskStateType[wfTask.WorkflowTaskStateType]}`,
        ];
        tableData.push(tdata);
    });

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
                flexArr={[1, 1, 1.5, 1]}
                data={tableHead}
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
                flexArr={[1, 1, 1.5, 1]}
                data={tableData}
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
                    paddingHorizontal: 10,
                    textAlign: 'left',
                    backgroundColor: '#F8F8F8',
                }}
            />
        </Table>
    );
};

const WorkFlowsTable = withLoader(DataTable);

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableHead: [
                'Workflow Number',
                'Task Type',
                'Team',
                'Workflow Type',
                'Status',
            ],
            loading: true,
        };
    }

    componentDidMount() {
        this.props.getWorkflows();
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        var bgcolor = this.props.alert.color || '#FFF';
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
                        paddingHorizontal: width < 1440 ? 50 : width * 0.05,
                        paddingBottom: 5,
                    }}>
                    {this.props.alert.display && (
                        <FlashMessage
                            bg={{ backgroundColor: bgcolor }}
                            message={this.props.alert.message}
                        />
                    )}
                    <WorkFlowsTable
                        loading={this.props.fetching}
                        tableHead={this.state.tableHead}
                        workflowTasks={this.props.workflows || []}
                    />
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

const mapStateToProps = ({ workflows }) => {
    const { myTaskData, fetching, alert } = workflows;
    return { workflows: myTaskData, fetching, alert };
};

export default connect(mapStateToProps, { getWorkflows })(Default);
