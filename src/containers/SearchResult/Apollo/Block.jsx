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
const _ = require('lodash');

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
                data={MdmMappingTableData}
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

const getApollo = {
    system: 'sap-apollo',
    role: {
        label: 'Role',
        values: [
            'Sold To (0001)',
            'Ship To (0001)',
            'Payer (0003)',
            'Bill To (0004)',
            'Sales Rep (0001)',
            'Drop Ship (0001)',
        ],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: 2 }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    salesOrg: {
        label: 'Sales Org',
        display: 'none',
    },
};

const getPTMN = {
    system: 'pointman',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: false,
    },
    soldTo: {
        label: 'Sold To',
        dependencies: {
            oneOf: [{ role: 2 }],
        },
    },
    costCenter: {
        label: 'Sales Sample Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 3 }],
        },
    },
    subCostCenter: {
        label: 'Sales Sample Sub Cost Center',
        required: true,
        dependencies: {
            oneOf: [{ role: 3 }],
        },
    },
};

const getM2M = {
    system: 'made2manage',
    role: {
        label: 'Role',
        values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
        required: true,
    },
    costCenter: {
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    subCostCenter: {
        display: 'none',
        dependencies: {
            oneOf: [{ role: 4 }],
        },
    },
    soldTo: {
        label: 'Sold To/Bill To',
        dependencies: {
            oneOf: [{ role: 'ship-to' }],
        },
    },
};

class Page extends React.Component {
    constructor(props) {
        super(props);

        Keyboard.removeAllListeners();

        this.state = {
            loading: false,
            isToggled: false,
            formData: [],
            sampleCustomerdata: this.props.singleCustomerDetail,
            isMdmMappingToggled: true,
            isParentTableToggled: true,
            isCreditTableToggled: true,
            mdmTblHeight: '400px',
            creditTblHeight: '400px',
            parentTblHeight: '400px',
            system: '',
            role: '',
            formSchema: passFields(getPTMN, {}),
        };
        this.onSubmit.bind(this);
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
        this.props.getCustomerDetail('002491624');
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

    updateSchema = () => {
        let system = this.state.formData.system;
        var objects = [
            passFields(getPTMN, this.state.formData),
            passFields(getM2M, this.state.formData),
            passFields(getApollo, this.state.formData),
        ];

        const formSchema = _.filter(
            objects,
            _.conforms({
                system(n) {
                    return n === system;
                },
            })
        )[0];

        this.setState({
            formSchema,
        });
    };

    onFieldChange = (value, e) => {
        console.log('EL', e);
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [e.target.name]: e.target.value,
                },
            },
            () => {
                if (this.state.formData.system) this.updateSchema();
            }
        );
    };

    onSubmit = () => {
        const formData = this.state.formData;
        this.setState(
            {
                formData,
                loading: true,
                mdmTblHeight: '400px',
                creditTblHeight: '400px',
                parentTblHeight: '400px',
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

        console.log(customer);

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
                                    padding="8px 25px 0px 25px"
                                    style={{
                                        lineHeight: '2',
                                        paddingBottom: 0,
                                    }}
                                    value={this.state.formData.Title}
                                    onChange={text =>
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                Title: text,
                                            },
                                        })
                                    }
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
                            <GlobalMdmFields readOnly formData={customer} />

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
                                    />
                                    <FormInput
                                        label="Role"
                                        name="role"
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    <FormInput
                                        label={`System\nAccount No\n`}
                                        colon={false}
                                        name="system-account-no"
                                        inline
                                        variant="outline"
                                        type="text"
                                    />
                                    {/*<FormSelect*/}
                                    {/*    required={true}*/}
                                    {/*    label="Sales Org"*/}
                                    {/*    name="sales-org"*/}
                                    {/*    variant="solid">*/}
                                    {/*    <option value="0">*/}
                                    {/*        Choose from...*/}
                                    {/*    </option>*/}
                                    {/*    <option value="Option">Option 1</option>*/}
                                    {/*    <option value="Option2">*/}
                                    {/*        Option 2*/}
                                    {/*    </option>*/}
                                    {/*</FormSelect>*/}
                                    {/*<FormSelect*/}
                                    {/*    required={true}*/}
                                    {/*    label="Order Block"*/}
                                    {/*    name="order-block"*/}
                                    {/*    variant="solid">*/}
                                    {/*    <option value="0">*/}
                                    {/*        Choose from...*/}
                                    {/*    </option>*/}
                                    {/*    <option value="Option">Option 1</option>*/}
                                    {/*    <option value="Option2">*/}
                                    {/*        Option 2*/}
                                    {/*    </option>*/}
                                    {/*</FormSelect>*/}
                                </Box>
                                <Box
                                    width={1 / 2}
                                    mx="auto"
                                    alignItems="center">
                                    {/*<FormSelect*/}
                                    {/*    required={true}*/}
                                    {/*    label="Posting Block"*/}
                                    {/*    name="posting-block"*/}
                                    {/*    variant="solid">*/}
                                    {/*    <option value="0">*/}
                                    {/*        Choose from...*/}
                                    {/*    </option>*/}
                                    {/*    <option value="Option">Option 1</option>*/}
                                    {/*    <option value="Option2">*/}
                                    {/*        Option 2*/}
                                    {/*    </option>*/}
                                    {/*</FormSelect>*/}
                                    {/*<FormSelect*/}
                                    {/*    required={true}*/}
                                    {/*    label="Delivery Block"*/}
                                    {/*    name="delivery-block"*/}
                                    {/*    variant="solid">*/}
                                    {/*    <option value="0">*/}
                                    {/*        Choose from...*/}
                                    {/*    </option>*/}
                                    {/*    <option value="Option">Option 1</option>*/}
                                    {/*    <option value="Option2">*/}
                                    {/*        Option 2*/}
                                    {/*    </option>*/}
                                    {/*</FormSelect>*/}
                                </Box>
                            </Box>
                        </Box>

                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    required={true}
                                    label="Sales Org"
                                    name="sales-org"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="Option">Option 1</option>
                                    <option value="Option2">Option 2</option>
                                </FormSelect>
                                <FormSelect
                                    required={true}
                                    label="Company Code"
                                    name="company-code"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="Option">0120: Direct</option>
                                    <option value="Option2">
                                        0150: Canada
                                    </option>
                                </FormSelect>
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    required={true}
                                    label="Posting Block"
                                    name="posting-block"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="Option">Option 1</option>
                                    <option value="Option2">Option 2</option>
                                </FormSelect>
                                <FormSelect
                                    required={true}
                                    label="Delivery Block"
                                    name="delivery-block"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="Option">Option 1</option>
                                    <option value="Option2">Option 2</option>
                                </FormSelect>
                            </Box>
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
                                onPress={() => this.props.history.goBack()}
                                title="Cancel"
                            />
                            <Button title="Save As Draft" />

                            <Button
                                onPress={() =>
                                    this.props.history.push(
                                        '/customers/create-additional'
                                    )
                                }
                                title="Submit"
                            />
                        </Flex>
                    </View>
                )}
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

const mapStateToProps = ({ customer }) => {
    const { singleCustomerDetail, fetching } = customer;
    return { singleCustomerDetail, fetching };
};

export default connect(mapStateToProps, { getCustomerDetail })(Default);
