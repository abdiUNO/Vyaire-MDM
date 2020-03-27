import React from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    Image,
    Keyboard,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { AntDesign } from '@expo/vector-icons';
import { Button, Box, Text, Flex } from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';
import GlobalMdmFields from '../../../components/GlobalMdmFields';
import Loading from '../../../components/Loading';

import { getMdmMappingMatrix } from '../../../appRedux/actions/UpdateFlowAction';
import { connect } from 'react-redux';
import OverflowRight from '../../../components/OverflowRight';
import {
    Table,
    TableWrapper,
    Row,
    Rows,
    Cell,
} from '../../../components/table';
import MiniTable from '../../../components/table/minimisableTable';
import {
    fetchExtendData,
    fetchSystemData,
} from '../../../redux/extendMockdata';

const TableComponent = ({ flexArray, headings , tableData }) => (
    <View>
        <Table
            border="2px solid #234382"
            borderStyle={{
                borderWidth: 1,
                borderRightWidth: 1,
                borderColor: '#98D7DA',
                borderRightStyle: 'solid',
            }}>
            <Row
                flexArr={flexArray}
                data={headings}
                style={{
                    backgroundColor: '#E6F5FA',
                    height: '60px',
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
                    fontWeight: '600',
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingHorizontal: 15,
                }}
            />
            <Rows
                flexArr={flexArray}
                data={tableData}
                style={{ minHeight: 20, height: '50px' }}
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
                    fontWeight: '500',
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
    </View>
)

const MdmMappingTableHead = [
    'System',
    'Role',
    'Sys Account No',
    'Global Record Indicator',
];
const MdmMappingTableData = [
    ['MDM', '', '00001', 'X'],
    ['SAP APOLLO', 'SOLD TO', '324212', ''],
    ['SAP APOLLO', 'SOLD TO', '731351', 'X'],
];

const ParentTableHead = [
    ' ',
    'DNUS',
    'NAME',
    'ADDRESS',
    'CITY',
    'STATE',
    'ZIP',
    'COUNTRY',
];
const ParentTableData = [
    ['Global', '', '', '', '', '', '', ''],
    ['Domestic', '', '', '', '', '', '', ''],
    ['Immediate', '', '', '', '', '', '', ''],
];
const CreditTableHead = ['System', 'Account No', 'CREDIT LIMIT'];
const CreditTableData = [
    ['SAP APOLLO', '1234', '$15,0000.00'],
    ['SAP OLYMPUS', '4324', '$35,0000.00'],
    ['JDE ', '9482', '$1,0000.00'],
    ['', 'GLOBAL CREDIT LIMIT', '$50,0000.00'],
];


class Page extends React.Component {
    constructor(props) {
        super(props);

        Keyboard.removeAllListeners();
        this.state = {
            loading: false,
            isToggled: false,
            isMdmMappingToggled: true,
            isParentTableToggled: true,
            isCreditTableToggled: true,
            formData: [],
            sampleCustomerdata: this.props.singleCustomerDetail,
            mdmTblHeight: '400px',
            creditTblHeight: '400px',
            parentTblHeight: '400px',
            mdmData: [],
            systemFields: {},
        };

        this.onSubmit.bind(this);
    }

    componentDidMount() {
        let customerId = this.props.match.params.customerId
        var postJson={'CustomerId':customerId}
        this.props.getMdmMappingMatrix(postJson);
        this.fetchTableData();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.location !== prevProps.location &&
            this.state.isToggled === true
        ) {
            this.toggle('isToggled', false);
        }
    }

    onSystemAccountNumberPressed = num => {
        fetchSystemData().then(res => {
            const Sysfields = res.SystemFields;
            let data = Sysfields.filter(field => {
                return field.SystemAccountNo === num;
            });

            this.setState({ systemFields: data[0] });
        });
    };

    fetchTableData() {
        fetchExtendData().then(res => {
            const mdmMappings = res.MdmMappings;
            let data = [];

            data = mdmMappings.map((mdmMapping, index) => [
                mdmMapping.System,
                mdmMapping.Role,
                <Button
                    onPress={() =>
                        this.onSystemAccountNumberPressed(
                            mdmMapping.SystemAccountNo
                        )
                    }
                    style={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: 'blue' }}
                    title={mdmMapping.SystemAccountNo}
                />,
                mdmMapping.GlobalIndicator,
            ]);

            this.setState({ mdmData: [...data, ...this.state.mdmData] });
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.singleCustomerDetail != this.props.singleCustomerDetail) {
            this.setState({
                sampleCustomerdata: newProps.singleCustomerDetail,
            });
        }
    }

    toggle = (stateKey, stateValue) => {
        this.setState({ [stateKey]: stateValue });
        if (stateValue === false) {
            if (stateKey === 'isMdmMappingToggled') {
                this.setState({ mdmTblHeight: '0px' });
            } else if (stateKey === 'isCreditTableToggled') {
                this.setState({ creditTblHeight: '0px' });
            } else {
                this.setState({ parentTblHeight: '0px' });
            }
        } else {
            if (stateKey === 'isMdmMappingToggled') {
                this.setState({ mdmTblHeight: '400px' });
            } else if (stateKey === 'isCreditTableToggled') {
                this.setState({ creditTblHeight: '400px' });
            } else {
                this.setState({ parentTblHeight: '400px' });
            }
        }
    };

    onSubmit = () => {
        const formData = this.state.formData;
        this.setState(
            {
                formData,
                loading: true,
            },
            this.updateCustomer
        );
    };

    formatedMdmMappingTableData=()=>{
        const {
            mdmcustomerdata:{
                MDMMappingMatrix: mdmMappingMatrix =[],
            },
        } = this.props;
        
        for(let i=0;i<mdmMappingMatrix.length;i++){
            
        }

    
    }

    render() {
        const {
            width,
            height,
            marginBottom,
            fetching,
            mdmcustomerdata:{
                MDMMappingMatrix: mdmMappingMatrix =[],
            },
        } = this.props;
        const sysField = this.state.systemFields;
        const {
            mdmTblHeight,
            creditTblHeight,
            parentTblHeight,
            isToggled,
            isMdmMappingToggled,
            isParentTableToggled,
            isCreditTableToggled,
        } = this.state;
        
        
        const MinimisableMdmMapping = (            
            <MiniTable
                title="MDM Mapping"
                tblHeight={mdmTblHeight}
                onPressTable={() =>
                    this.toggle('isMdmMappingToggled', !isMdmMappingToggled)
                }
                tableContent={<TableComponent  flexarray={[1, 1, 1, 1]}
                headings={MdmMappingTableHead} 
                tableData={this.state.mdmData} />}
                onMenuDismiss={() => this.toggle('isMdmMappingToggled', false)}
                isToggled={isMdmMappingToggled}
            />
        );

        const MinimisableParentTable = (
            <MiniTable
                title="Parent Table"
                tblHeight={parentTblHeight}
                onPressTable={() =>
                    this.toggle('isParentTableToggled', !isParentTableToggled)
                }
                tableContent={<TableComponent 
                    flexarray={[1.5, 1, 1, 1.1, 1, 1, 1, 1.1]}
                    headings={ParentTableHead} 
                    tableData={ParentTableData} />}
                onMenuDismiss={() => this.toggle('isParentTableToggled', false)}
                isToggled={isParentTableToggled}
            />
        );

        const MinimisableCreditTable = (
            <MiniTable
                title="Credit Table"
                tblHeight={creditTblHeight}
                onPressTable={() =>
                    this.toggle('isCreditTableToggled', !isCreditTableToggled)
                }
                tableContent={<TableComponent flexarray={[1, 1, 1]}
                headings={CreditTableHead} 
                tableData={CreditTableData} />}
                onMenuDismiss={() => this.toggle('isCreditTableToggled', false)}
                isToggled={isCreditTableToggled}
            />
        );

        const TableInSlidePane = (
            <View>
                <Box>
                    {MinimisableMdmMapping}
                    <Text
                        mt="5%"
                        ml="5%"
                        fontWeight="light"
                        color="lightBlue"
                        fontSize="24px">
                        GLOBAL VIEW
                    </Text>

                    {MinimisableParentTable}

                    {MinimisableCreditTable}
                </Box>
            </View>
        );

        if (this.props.fetching) {
            return <Loading />;
        }

        return (
            <ScrollView
                pointerEvents={'box-none'}
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                    <View
                        pointerEvents={'box-none'}
                        style={{
                            flex: 1,
                            paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                            paddingBottom: 10,
                        }}>
                        <Box flexDirection="row-reverse" alignItems="flex-end">
                            <TouchableOpacity
                                onPress={() =>
                                    this.toggle('isToggled', !isToggled)
                                }>
                                <AntDesign
                                    name="arrowleft"
                                    size={38}
                                    color="#11307D"
                                />
                            </TouchableOpacity>
                            <View style={{ zIndex: 1 }}>
                                <OverflowRight
                                    content={TableInSlidePane}
                                    onMenuDismiss={() =>
                                        this.toggle('isToggled', false)
                                    }
                                    style={{ position: 'absolute', zIndex: 1 }}
                                    isToggled={isToggled}
                                />
                            </View>
                        </Box>
                        <GlobalMdmFields formData={mdmcustomerdata && mdmMappingMatrix[0].MDMGlobalData} readOnly />

                        <Box
                            display="flex"
                            flex={1}
                            flexDirection="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            p="65px 15px 0px 10px"
                            m="20px 25px 25px 0px"
                            pointerEvents={'box-none'}>
                            <FormInput
                                mr={2}
                                label="Effective Date"
                                inline
                                type="date"
                            />
                            <TouchableOpacity style={{ marginRight: 16 }}>
                                <Flex
                                    padding="8px 15px"
                                    style={{
                                        borderRadius: 2.5,
                                        backgroundColor: '#12243F',
                                        paddingVertical: 12.3,
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
                                        Attachment
                                    </Text>
                                    <Image
                                        source={require('../../../../assets/icons/clip.png')}
                                        style={{
                                            width: 17.5,
                                            height: 16,
                                        }}
                                    />
                                </Flex>
                            </TouchableOpacity>
                            <Button
                                onPress={this.props.history.goBack}
                                title="Cancel"
                            />

                            <Button onPress={this.onSubmit} title="Submit" />
                        </Box>
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
const styles = StyleSheet.create({
    TableHeaderContainer: {
        paddingLeft: 32,
        backgroundColor: '#234385',
        paddingVertical: 12,
    },
    menuItemsHeader: {
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 17,
    },
    menuItemText: {
        fontSize: 16,
        color: '#10254D',
        fontFamily: 'Poppins',
        fontWeight: '400',
    },
    bold: { color: '#10254D', fontFamily: 'Poppins', fontWeight: '700' },
});

const mapStateToProps = ({ updateFlow }) => {
    const { mdmcustomerdata, fetching } = updateFlow;
    return { mdmcustomerdata, fetching };
};

export default connect(mapStateToProps, { getMdmMappingMatrix })(Default);
