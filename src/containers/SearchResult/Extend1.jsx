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
import { Button, Box, Text } from '../../components/common';
import { FormInput, FormSelect } from '../../components/form';
import { Colors } from '../../theme';
import { getCustomerDetail } from '../../appRedux/actions/Customer';
import { connect } from 'react-redux';
import OverflowRight from '../../components/OverflowRight';
import { Table, TableWrapper, Row, Rows, Cell } from '../../components/table';
import MiniTable from '../../components/table/minimisableTable';
import { fetchExtendData, fetchSystemData } from '../../redux/extendMockdata';
import { resolveDependencies, passFields } from '../../constants/utils';
import GlobalMdmFields from '../../components/GlobalMdmFields';
import SystemFields from '../../components/SystemFields';

const getApollo = {
    system: 'sap-apollo',
    role: {
        label: 'Role',
        values: [
            'Sold To',
            'Ship To',
            'Payer',
            'Bill To',
            'Sales Rep',
            'Drop Ship',
        ],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: '2' }, { role: '3' }, { role: '4' }, { role: '5' }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 'sales-rep' }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 'sales-rep' }],
        },
    },
    salesOrg: {
        display: 'none',
    },
};

const getPTMN = {
    system: 'pointman',
    role: {
        label: 'Role',
        values: ['Sold To', 'Ship To', 'Payer', 'Sales Rep', 'Drop Ship'],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            allOf: [{ role: 'ship-to' }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        required: true,
        dependencies: {
            allOf: [{ role: 'sales-rep' }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        required: true,
        dependencies: {
            allOf: [{ role: 'sales-rep' }],
        },
    },
    salesOrg: {
        display: 'none',
    },
};

const getM2M = {
    system: 'made2manage',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: true,
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            allOf: [{ role: 'ship-to' }, { costCenter: 'test' }],
        },
    },
};

const getJDE = {
    system: 'jd-edwards',
    role: {
        label: 'Role',
        values: ['Sold To', 'Ship To', 'Sales Rep'],
        required: true,
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            allOf: [{ role: 'ship-to' }],
        },
    },
};

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
const ParentTable = (
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
                flexArr={[1.5, 1, 1, 1.1, 1, 1, 1, 1.1]}
                data={ParentTableHead}
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
                flexArr={[1.5, 1, 1, 1.1, 1, 1, 1, 1.1]}
                data={ParentTableData}
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
);

const CreditTableHead = ['System', 'Account No', 'CREDIT LIMIT'];
const CreditTableData = [
    ['SAP APOLLO', '1234', '$15,0000.00'],
    ['SAP OLYMPUS', '4324', '$35,0000.00'],
    ['JDE ', '9482', '$1,0000.00'],
    ['', 'GLOBAL CREDIT LIMIT', '$50,0000.00'],
];
const CreditTable = (
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
                flexArr={[1, 1, 1]}
                data={CreditTableHead}
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
                    fontSize: 17,
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingHorizontal: 15,
                }}
            />
            <Rows
                flexArr={[1, 1, 1]}
                data={CreditTableData}
                style={{ minHeight: 10, height: '50px' }}
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
);

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
            formData: {},
            formSchema: passFields(getPTMN, {}),

            sampleCustomerdata: this.props.singleCustomerDetail,
            mdmTblHeight: '400px',
            creditTblHeight: '400px',
            parentTblHeight: '400px',
            mdmData: [],
            systemFields: {
                System: '',
                SoldTo: '',
                PurposeOfRequest: '',
                Role: '',
                SalesOrg: '',
            },
        };

        this.onSubmit.bind(this);
    }
    updateSchema = () => {
        let system = this.state.formData.system;
        var objects = [
            passFields(getApollo, this.state.formData),
            passFields(getPTMN, this.state.formData),
            passFields(getM2M, this.state.formData),
            passFields(getJDE, this.state.formData),
        ];

        const formSchema = _.filter(
            objects,
            _.conforms({
                system(n) {
                    return n === system;
                },
            })
        )[0];

        console.log(this.state.formData, formSchema);

        this.setState({
            formSchema,
        });
    };

    onFieldChange = (value, e) => {
        console.log(e);
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value,
                },
            },
            this.updateSchema
        );
    };

    componentDidUpdate(prevProps) {
        if (this.props.location.state)
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
            console.log('sys', this.state.systemFields);
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

    componentDidMount() {
        this.props.getCustomerDetail('002491624');
        this.fetchTableData();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.singleCustomerDetail != this.props.singleCustomerDetail) {
            this.setState({
                sampleCustomerdata: newProps.singleCustomerDetail,
                formData: {
                    ...this.state.formData,
                    country: newProps.singleCustomerDetail.Country,
                },
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

    render() {
        const {
            width,
            height,
            marginBottom,
            singleCustomerDetail,
        } = this.props;
        const { state } = singleCustomerDetail;
        const customer = this.state.sampleCustomerdata;
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
        const MdmMappingTable = (
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
                        data={MdmMappingTableHead}
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
                            fontSize: 17,
                            paddingTop: 24,
                            paddingBottom: 24,
                            paddingHorizontal: 15,
                        }}
                    />
                    <Rows
                        data={this.state.mdmData}
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
        );

        const MinimisableMdmMapping = (
            <MiniTable
                title="MDM Mapping"
                tblHeight={mdmTblHeight}
                onPressTable={() =>
                    this.toggle('isMdmMappingToggled', !isMdmMappingToggled)
                }
                tableContent={MdmMappingTable}
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
                tableContent={ParentTable}
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
                tableContent={CreditTable}
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
            <View
                keyboardShouldPersistTaps="always"
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#eff3f6',
                }}>
                {this.state.sampleCustomerdata.length != 0 && (
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
                                    onMenuDismiss={() => {
                                        console.log('CLCIKED');
                                        this.toggle('isToggled', false);
                                    }}
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
                                    padding="8px 25px 0px 25px"
                                    style={{
                                        lineHeight: '2',
                                        paddingBottom: 0,
                                    }}
                                    flex={1 / 4}
                                    mb={2}
                                    label="Title"
                                    name="title"
                                />
                                <FormInput
                                    px="25px"
                                    flex={1 / 4}
                                    label="Workflow Number"
                                    value={this.state.formData.WorkFlowNumber}
                                    name="workflow-number"
                                    style={{ lineHeight: '2' }}
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    px="25px"
                                    flex={1 / 4}
                                    label="MDM Number"
                                    name="mdm-number"
                                    value={
                                        this.state.formData.MdmNumber ===
                                        undefined
                                            ? customer.MdmNumber.toString()
                                            : this.state.formData.MdmNumber
                                    }
                                    style={{ lineHeight: '2' }}
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <GlobalMdmFields readOnly />
                            <SystemFields
                                formData={this.state.formData}
                                formSchema={this.state.formSchema}
                                onFieldChange={this.onFieldChange}
                            />
                        </Box>

                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            p="65px 15px 0px 10px"
                            m="20px 25px 25px 0px"
                            style={{ zIndex: -1 }}
                            pointerEvents={'box-none'}>
                            <Button
                                onPress={this.props.history.goBack}
                                title="Cancel"
                            />

                            <Button onPress={this.onSubmit} title="Submit" />
                        </Box>
                    </View>
                )}
            </View>
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

const mapStateToProps = ({ customer }) => {
    const { singleCustomerDetail, fetching } = customer;
    return { singleCustomerDetail, fetching };
};

export default connect(mapStateToProps, { getCustomerDetail })(Default);
