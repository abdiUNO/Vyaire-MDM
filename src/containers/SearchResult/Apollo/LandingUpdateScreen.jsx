import React from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
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
import { getCustomerDetail } from '../../../appRedux/actions/Customer';
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
import { resolveDependencies, passFields } from '../../../constants/utils';
import GlobalMdmFields from '../../../components/GlobalMdmFields';
import SystemFields from '../../../components/SystemFields';
import {SystemType,SalesOrgType} from '../../../constants/WorkflowEnums';
import Loading from '../../../components/Loading';
import { getMdmMappingMatrix } from '../../../appRedux/actions/UpdateFlowAction';
import { fetchCreateCustomerDropDownData } from '../../../redux/DropDownDatas';
import DynamicSelect from '../../../components/DynamicSelect';


const _ = require('lodash');


const SalesOrgValidValues = Object.keys(SalesOrgType).map(index => {
    const system = SalesOrgType[index];
    return { id: index, description: system, value: system };
});

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
            mdmTblHeight: '400px',
            creditTblHeight: '400px',
            parentTblHeight: '400px',
            dropDownDatas: {},
        };

    }
    componentDidUpdate(prevProps) {
        if (
            this.props.location !== prevProps.location &&
            this.state.isToggled === true
        ) {
            this.toggle(false);
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        var postJson={'MdmNumber':id}
        this.props.getMdmMappingMatrix(postJson);

        fetchCreateCustomerDropDownData().then(res => {
            const data = res;
            this.setState({ dropDownDatas: data });
        });

    }

    componentWillReceiveProps(newProps) {
        if (newProps.mdmcustomerdata != this.props.mdmcustomerdata) {
            this.setState({
                sampleCustomerdata: newProps.singleCustomerDetail,
            });
        }
    }

    toggle = (stateKey, stateValue) => {
        this.setState({ [stateKey]: stateValue },()=>console.log('tog',stateKey,' ',stateValue));
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


      
    setSystemFieldStates = (erpData) => { 
        this.setState(
            {
                selectedErp:erpData,
                sysFieldFormData:{
                    WorkflowId: "",
                    CustomerNumber:erpData.CustomerNumber,
                    SystemTypeId:erpData.SystemTypeId,
                    RoleTypeId:erpData.RoleTypeIds[0],
                    SalesOrgTypeId:erpData.SalesOrgTypeIds[0],
                    DistributionChannelTypeId:erpData.DistributionChannelTypeIds[0],
                    DivisionTypeId:erpData.DivisionTypeIds[0],
                    CompanyCodeTypeId:erpData.CompanyCodeTypeIds[0]
                }
            });
    }

    onFieldChange = (value, e) => {
        const { name } = e.target;
        this.setState(
            {
                sysFieldFormData: {
                    ...this.state.sysFieldFormData,
                    [name]: value,
                },
            });
    };


    render() {
        const { width, 
            location,
            fetching,
            mdmcustomerdata:{
                MDMGlobalData: globalMdmDetail = {},
                MDMMappingMatrix: mdmMappingMatrix =[],
                CreditData: mdmCreditData=[]
            }, 
        } = this.props;
        
        const { state: customer } = location;
        const {
            mdmTblHeight,
            creditTblHeight,
            parentTblHeight,
            isToggled,
            isMdmMappingToggled,
            isParentTableToggled,
            isCreditTableToggled,
            dropDownDatas
        } = this.state;
        console.log('s',globalMdmDetail)
        let mdmTableData = mdmMappingMatrix.map((mdmMapping, index) => [
            SystemType[mdmMapping.SystemTypeId],
            <Button
                onPress={() => this.setSystemFieldStates(mdmMapping)}
                style={{ backgroundColor: 'transparent' }}
                titleStyle={{ color: 'blue' }}
                title={mdmMapping.CustomerNumber}
            />,
            mdmMapping.IsGoldenRecord ? 'X' : null,
        ]);
       
        let creditTableData = mdmCreditData.map((mdmCredit, index) => [
            SystemType[mdmCredit.SystemTypeId],
            mdmCredit.CustomerNumber,           
            mdmCredit.SystemCreditLimit,
        ]);
       

        const MinimisableMdmMapping = (            
            <MiniTable
                title="MDM Mapping"
                tblHeight={mdmTblHeight}
                onPressTable={() =>
                    this.toggle('isMdmMappingToggled', !isMdmMappingToggled)
                }
                tableContent={<TableComponent  flexarray={[1, 1, 1]}
                headings={MdmMappingTableHead} 
                tableData={mdmTableData} />}
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
                tableData={creditTableData} />}
                onMenuDismiss={() => this.toggle('isCreditTableToggled', false)}
                isToggled={isCreditTableToggled}
            />
        );

        const TableInSlidePane = (
            <View>
                <Box>
                    {MinimisableMdmMapping}
                    <Text
                        mt="2%"
                        ml="5%"
                        fontWeight="light"
                        color="lightBlue"
                        fontSize="24px">
                        GLOBAL VIEW
                    </Text>
                    {MinimisableCreditTable}
                </Box>
            </View>
        );

        if (this.state.loading === true)
            return (
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="650px">
                    <ActivityIndicator />
                </Box>
            );

        return (
            <ScrollView
                pointerEvents={'box-none'}
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                    height: '2800px',
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
                        <Box style={{ zIndex: -1 }} my={2}>
                            <Box
                                flexDirection="row"
                                justifyContent="space-around"
                                my={4}
                                alignItems="center">
                                <FormInput
                                    px="25px"
                                    flex={1 / 4}
                                    label="MDM Number"
                                    name="mdm-number"
                                    value={customer.MdmNumber.toString()}
                                    style={{ lineHeight: '2' }}
                                    variant="outline"
                                    type="text"
                                />
                                <Box px="25px" flex={1 / 4} />
                                <Box px="25px" flex={1 / 4} />
                            </Box>
                            <GlobalMdmFields
                                title="MDM Record"
                                readOnly
                                formData={globalMdmDetail}
                            />
                            {this.state.selectedErp &&

                            <>
                            <Text
                                mt={5}
                                mb={3}
                                ml="5%"
                                fontWeight="light"
                                color="lightBlue"
                                fontSize="28px">
                                SYSTEM FIELDS
                            </Text>

                            <Box flexDirection="row" justifyContent="center">
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    <FormInput
                                        label="System"
                                        name="system"
                                        inline                                        
                                        variant="outline"
                                        type="text"
                                        value={SystemType[this.state.selectedErp.SystemTypeId]}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.DistributionChannelType &&
                                            dropDownDatas.DistributionChannelType.filter(
                                                channel => ( (channel.systemId ===
                                                    parseInt(this.state.selectedErp.SystemTypeId)) && 
                                                    (
                                                        this.state.selectedErp.DistributionChannelTypeIds.includes(channel.id)
                                                    )
                                                )
                                            )
                                        }
                                        label="Distribution Channel"
                                        name="DistributionChannelTypeId"
                                        isRequired
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                    'DistributionChannelTypeId'
                                                ]
                                                : null
                                        }
                                        value={this.state.selectedErp.DistributionChannelTypeIds[0]}
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.DivisionType &&
                                            dropDownDatas.DivisionType.filter(
                                                division => ( (division.systemId ===
                                                    parseInt(this.state.selectedErp.SystemTypeId)) && 
                                                    (
                                                        this.state.selectedErp.DivisionTypeIds.includes(division.id)
                                                    )
                                                )
                                            )
                                        }
                                        label="Division"
                                        name="DivisionTypeId"
                                        isRequired
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                    'DivisionTypeId'
                                                ]
                                                : null
                                        }
                                        value={this.state.selectedErp.DivisionTypeIds[0]}
                                        onFieldChange={this.onFieldChange}
                                    />

                                </Box>
                                <Box width={1 / 2} mx="auto" alignItems="center">
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.RoleTypeId &&
                                            dropDownDatas.RoleTypeId.filter(
                                                role => ( (role.systemId ===
                                                    parseInt(this.state.selectedErp.SystemTypeId)) && 
                                                    (
                                                        this.state.selectedErp.RoleTypeIds.includes(role.id)
                                                    )
                                                )
                                            )
                                        }
                                        label="Role"
                                        name="RoleTypeId"
                                        isRequired
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                    'RoleTypeId'
                                                ]
                                                : null
                                        }
                                        value={this.state.selectedErp.RoleTypeIds[0]}
                                        onFieldChange={this.onFieldChange}
                                    />
                                    <DynamicSelect
                                        arrayOfData={SalesOrgValidValues.filter(
                                            salesorg => ( this.state.selectedErp.SalesOrgTypeIds.includes( parseInt(salesorg.id)) )
                                        )
                                        }
                                        label="Sales Org"
                                        name="SalesOrgTypeId"
                                        value={this.state.selectedErp.SalesOrgTypeIds[0]}
                                        isRequired
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                    'SalesOrgTypeId'
                                                ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                        
                                    />
                                    <DynamicSelect
                                        arrayOfData={
                                            dropDownDatas.CompanyCodeTypeId &&
                                            dropDownDatas.CompanyCodeTypeId.filter(
                                                compcode => ( (compcode.systemId ===
                                                    parseInt(this.state.selectedErp.CompanyCodeTypeIds[0])) && 
                                                    (
                                                        this.state.selectedErp.CompanyCodeTypeIds.includes(compcode.id)
                                                    )
                                                )
                                            )
                                        }
                                        label="Company Code"
                                        name="CompanyCodeTypeId"                                       
                                        value={this.state.selectedErp.CompanyCodeTypeIds[0]}
                                        isRequired
                                        formErrors={
                                            this.state.formErrors
                                                ? this.state.formErrors[
                                                    'CompanyCodeTypeId'
                                                ]
                                                : null
                                        }
                                        onFieldChange={this.onFieldChange}
                                    />
                                </Box>

                            </Box>
                            </>
                            }
                        </Box>
                        <Flex
                            justifyEnd
                            alignCenter
                            style={{
                                paddingTop: 65,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 10,
                                paddingRight: 15,
                                marginTop: 20,
                                marginBottom: 10,
                                marginHorizontal: 25,
                            }}>
                            <Button
                                onPress={() => {
                                    this.props.history.push({
                                        pathname: `/search-results/${customer.MdmNumber}/block`,
                                        state: {
                                            ...customer,
                                            ...this.state.formData,
                                        },
                                    });
                                }}
                                title="Block"
                            />
                            <Button title="Update" onPress={() => {
                                    this.state.selectedErp ? (
                                        this.props.history.push({
                                            pathname: `/cm_masterdata/${customer.MdmNumber}`,
                                            state: {
                                                globalMdmDetail,
                                                MdmNumber:customer.MdmNumber,
                                                sysFieldsData:this.state.sysFieldFormData
                                            },
                                        })
                                    ) : 
                                    (
                                        this.props.history.push({
                                            pathname: `/update/globaldata/${customer.MdmNumber}`,
                                            state: {
                                                ...globalMdmDetail,
                                                MdmNumber:customer.MdmNumber
                                            },
                                        })
                                    )
                                }}/>
                            <Button title="Extend To New System" />
                            <Button title="Extend To Sales Org" />
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
