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
import {WorkflowTaskStateType,WorkflowType,WorkflowTeamTypeRouteAddress} from '../../../constants/WorkflowEnums';
// const workFlowStatus = ['New', 'In Progress', 'Approved', 'Rejected'];
// const workFlowType = ['Create', 'Extend', 'Update', 'Block'];
import FlashMessage from '../../../components/FlashMessage';

const DataTable = ({ tableHead, workflows }) => {
    let filledArray = [...new Array(10)].map(() => ({ hello: 'goodbye' }));
    let tableData=[];
    var tdata;
    let td = workflows.map((workflow, index) => {
         workflow.WorkflowTasks.map((wfTask,index)=>{
            var linkClassname = WorkflowTeamTypeRouteAddress[wfTask.WorkflowTeamType]==='#'? 'disable-link' : 'enable-link'; 
            var navigateTo=WorkflowTeamTypeRouteAddress[wfTask.WorkflowTeamType]+'/'+workflow.WorkflowId 
            
            // if Workflowstatetpe inprogress & WorkflowTaskStateType ReadyForProcessing then not readonly
            var readOnlyStatus= (workflow.WorkflowStateType==2  && wfTask.WorkflowTaskStateType==2  ) ? false : true;
            tdata=[
            workflow.SystemName,
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
                    pathname:navigateTo,
                    state: {
                        ...workflow.WorkflowCustomerGlobalModel,
                        WorkflowId: workflow.WorkflowId,
                        MdmCustomerNumber:workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.MdmCustomerId :'',
                        TaskId: wfTask.TaskId,
                        isReadOnly:readOnlyStatus
                    },
                }}>
                {workflow.WorkflowId}
            </Link>,
            WorkflowType[workflow.WorkflowType],
            workflow.Role,
            workflow.WorkflowCustomerGlobalModel!=null? workflow.WorkflowCustomerGlobalModel.Title :'',
            workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.Name1:'',
            workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.Street:'',
            workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.City:'',
            workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.Region:'',
            workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.PostalCode:'',
            workflow.WorkflowCustomerGlobalModel!=null?workflow.WorkflowCustomerGlobalModel.Country.toUpperCase():'',
            WorkflowTaskStateType[wfTask.WorkflowTaskStateType],
        ]
        tableData.push(tdata);
    }
    
        )
        
    }
        );
    console.log('td',tableData);
    let data = [
        ...tableData,
        ...Array.from({ length: 2 }, () => [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ]),
    ];

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
                flexArr={[1, 1.5, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1]}
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
                flexArr={[1, 1.5, 1, 1, 1, 1, 1.5, 1, 1, 1, 1, 1]}
                data={data}
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
                'System',
                'Workflow Records',
                'Workflow Type',
                'Role',
                'Title',
                'Name',
                'Street',
                'City',
                'State',
                'Zip Code',
                'Country',
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
        var bgcolor=this.props.alert.color || '#FFF';
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
                    {this.props.alert.display &&                    
                        <FlashMessage bg={{backgroundColor:bgcolor}}  message={this.props.alert.message} />
                    }
                    <WorkFlowsTable
                        loading={this.props.fetching}
                        tableHead={this.state.tableHead}
                        workflows={this.props.workflows || []}
                    />
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
                                    source={require('../../../../assets/icons/excel_icon@2x.png')}
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

const mapStateToProps = ({ workflows }) => {
    const { myTaskData,  fetching ,alert} = workflows;
    return { workflows: myTaskData,  fetching,alert };
};

export default connect(mapStateToProps, { getWorkflows })(Default);
