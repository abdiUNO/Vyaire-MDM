import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    CheckBox,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Flex, Column, Card, Button, Box, Text } from '../../components/common';
import { FormInput, FormSelect } from '../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

const CheckBoxItem = ({ onValueChange, stateValue, title }) => (
    <>
        <Flex
            alignLeft
            style={{
                paddingTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 15,
                marginBottom: 10,
                marginHorizontal: 25,
                maxWidth: '350px',
                width: '100%',
            }}>
            <CheckBox value={stateValue} onValueChange={onValueChange} />
            <Text
                my={2}
                alignSelf="flex-start"
                fontSize="16px"
                fontWeight="500"
                fontFamily="Poppins"
                backgroundColor="transparent"
                color="#22438a"
                pl={4}>
                {title}
            </Text>
        </Flex>
    </>
);

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            formData: {},
            order: false,
            reject: false,
            paymentHistory: false,
        };
    }

    render() {
        const { width, height, marginBottom, location } = this.props;
        let barwidth = Dimensions.get('screen').width - 1000;
        let progressval = 40;
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 60 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <View style={styles.progressIndicator}>
                        <ProgressBarAnimated
                            width={barwidth}
                            value={progressval}
                            backgroundColor="#6CC644"
                            backgroundColorOnComplete="#6CC644"
                        />
                        <Text style={styles.statusText}>Status:</Text>
                    </View>

                    <Box fullHeight my={2}>
                        <Box
                            flexDirection="row"
                            justifyContent="space-around"
                            my={4}>
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Title"
                                name="title"
                                variant="outline"
                                type="text"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
                                name="workflow-number"
                                variant="outline"
                                type="text"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="MDM Number"
                                name="mdm-number"
                                variant="outline"
                                type="text"
                            />
                        </Box>

                        <Text
                            my={2}
                            alignSelf="flex-start"
                            fontWeight="light"
                            color="lightBlue"
                            fontSize="xlarge"
                            pl={4}>
                            GLOBAL MDM FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Name"
                                    name="name"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Name 2"
                                    name="name2"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Name 3"
                                    name="name3"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Name 4"
                                    name="name4"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Street"
                                    name="street"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Street 2"
                                    name="street2"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="City"
                                    name="city"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Region"
                                    name="region"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Postal Code"
                                    name="Postal Code"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Country"
                                    name="country"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Telephone"
                                    name="telephone"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Fax"
                                    name="Fax"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Text
                            mt={5}
                            mb={2}
                            alignSelf="flex-start"
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            CUSTOMER MASTER FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Tax Number"
                                    name="tax no"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="VAT Reg No"
                                    name="vat"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="DNUS No"
                                    name="dnus"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="SIC Code 4"
                                    name="SIC Code 4"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="SIC Code 6"
                                    name="SIC Code 6"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="SIC Code 8"
                                    name="SIC Code 8"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="NAICS Code"
                                    name="NAICS code"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="System"
                                    name="systme"
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
                                    label="Sold To"
                                    name="Sold To"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="Sales Org"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Purpose of Request"
                                    name="Purpose of Request"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    required="true"
                                    label="License Number"
                                    name="License"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="License Expiration Date"
                                    name="License-Expiratin"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Search Term 1"
                                    name="search-1"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Search Term 2"
                                    name="search-2"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Distribution Channel"
                                    name="Distribution-1"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Division"
                                    name="Division-2"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Transportation Zone"
                                    name="Transportation-class"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Partner Function Number"
                                    name="Partner Function Number"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Tax Number 2"
                                    name="tax-number"
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="Sort Key"
                                    name="sort-key"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Payment Method"
                                    name="payment mtd"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Acctg Clerk"
                                    name="Acctg Clerk"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Account Statement"
                                    name="Account Statement"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Incoterms 2"
                                    name="Incoterms 2"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />

                                <FormInput
                                    label="Tax Classification"
                                    name="Tax Classification"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                            </Box>
                        </Box>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    required="true"
                                    label="Category"
                                    name="category"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="Distributor">
                                        Distributor
                                    </option>
                                    <option value="Self-Distributor">
                                        Self-Distributor
                                    </option>
                                    <option value="OEM">OEM</option>
                                    <option value="Kitter">Kitter</option>
                                    <option value="Direct">Direct</option>
                                    <option value="Internal">Internal</option>
                                </FormSelect>

                                <FormSelect
                                    label="Customer Class"
                                    name="customer class"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="deptOfDefense">
                                        Dept of Defense
                                    </option>
                                    <option value="publicHealthServices">
                                        Public Health Services
                                    </option>
                                    <option value="generalServicesAdmin">
                                        General Services Admin
                                    </option>
                                    <option value="veteransAdmin">
                                        Veterans Admin
                                    </option>
                                    <option value="stateLocal">
                                        State/Local
                                    </option>
                                    <option value="nonGovernment">
                                        Non Government
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Industry Code 1"
                                    name="Industry-Code-1"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="contractManufacturing">
                                        {' '}
                                        Contract Manufacturing
                                    </option>
                                    <option value="internal/ico">
                                        Internal/ICO
                                    </option>
                                    <option value="ge/armstrong">
                                        GE/Armstrong
                                    </option>
                                    <option value="distributor">
                                        Distributor
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Company Code"
                                    name="Company code"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="0120"> 0120</option>
                                    <option value="0150">0150</option>
                                </FormSelect>
                                <FormSelect
                                    label="Industry"
                                    name="industry"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="Acute"> Acute</option>
                                    <option value="nonAcute">Non Acute</option>
                                </FormSelect>
                                <FormSelect
                                    label="Recon Account"
                                    name="recon-acnt"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="12100">12100</option>
                                    <option value="12900">12900</option>
                                </FormSelect>
                                <FormSelect
                                    label="Sales Office"
                                    name="sales-office"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="direct">Direct</option>
                                    <option value="salesReps">
                                        Sales Reps
                                    </option>
                                    <option value="international">
                                        International
                                    </option>
                                    <option value="government">
                                        Government
                                    </option>
                                    <option value="distributors">
                                        Distributors
                                    </option>
                                    <option value="oEM/Kitters">
                                        OEM/Kitters
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="PP Cust Proc"
                                    name="PP Cust Proc"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="productProposal">
                                        Product Proposal
                                    </option>
                                    <option value="crossSelling">
                                        Cross Selling
                                    </option>
                                </FormSelect>
                                <FormInput
                                    label="Additional Notes"
                                    multiline
                                    numberOfLines={6}
                                    name="additionalNotes"
                                    variant="solid"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    label="Cust Pric Proc"
                                    name="Cust Pric Proc"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="1">1</option>
                                    <option value="3">3</option>
                                </FormSelect>
                                <FormSelect
                                    label="Delivery Priority"
                                    name="Delivery Priority"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="30">
                                        Domestic Direct, Sales Rep, Trace,
                                        Government
                                    </option>
                                    <option value="40">
                                        Canada and Mexico
                                    </option>
                                    <option value="45">
                                        International, Puerto Rico
                                    </option>
                                    <option value="35">Distributors</option>
                                </FormSelect>
                                <FormSelect
                                    label="Shipping Conditions"
                                    name="Shipping Conditions"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="dm">DM</option>
                                    <option value="ex">EX</option>
                                </FormSelect>

                                <FormSelect
                                    label="Incoterms 1"
                                    name="Incoterms 1"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="COL">COL</option>
                                    <option value="CP2">CP2</option>
                                    <option value="CPT">CPT</option>
                                    <option value="DAP">DAP</option>
                                    <option value="DDP">DDP</option>
                                    <option value="DPA">DPA</option>
                                    <option value="EXW">EXW</option>
                                    <option value="FCA">FCA</option>
                                    <option value="PPA">PPA</option>
                                    <option value="PPD">PPD</option>
                                </FormSelect>
                                <FormSelect
                                    label="Acct Assgmt Group"
                                    name="Acct Assgmt Group"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="Domestic">Domestic</option>
                                    <option value="International">
                                        International
                                    </option>
                                    <option value="InterCompany">
                                        InterCompany
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Partner Function"
                                    name="Partner Function"
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="BP">BP</option>
                                    <option value="PY">PY</option>
                                    <option value="SH">SH</option>
                                    <option value="Y0">Y0</option>
                                    <option value="YO">YO</option>
                                    <option value="YL">YL</option>
                                    <option value="YS">YS</option>
                                </FormSelect>
                                <FormSelect
                                    label="Account Type"
                                    name="Account Type"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                </FormSelect>
                                <FormSelect
                                    label="Shipping Customer Type"
                                    name="Shipping Customer Type"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="DIR">DIR</option>
                                    <option value="DIS">DIS</option>
                                    <option value="INT">INT</option>
                                    <option value="OEM">OEM</option>
                                </FormSelect>
                                <CheckBoxItem
                                    title="Order Combination"
                                    stateValue={this.state.order}
                                    onValueChange={() =>
                                        this.setState({
                                            order: !this.state.order,
                                        })
                                    }
                                />
                                <CheckBoxItem
                                    title="Payment History Record"
                                    stateValue={this.state.paymentHistory}
                                    onValueChange={() =>
                                        this.setState({
                                            paymentHistory: !this.state
                                                .paymentHistory,
                                        })
                                    }
                                />

                                {this.state.reject && (
                                    <FormInput
                                        label="Rejection Reason"
                                        multiline
                                        numberOfLines={2}
                                        name="Rejecton"
                                        variant="solid"
                                        type="text"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 15,
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
                            title="Approve"
                        />
                        <Button
                            title="Reject"
                            onPress={() => this.setState({ reject: true })}
                        />
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

export default Default;

const styles = StyleSheet.create({
    progressIndicator: {
        flex: 1,
        paddingBottom: 5,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 15,
        color: '#1D4289',
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 20,
    },
});
