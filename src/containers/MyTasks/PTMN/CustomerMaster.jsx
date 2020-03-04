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
import {
    Flex,
    Column,
    Card,
    Button,
    Box,
    Text,
} from '../../../components/common';
import { FormInput, FormSelect } from '../../../components/form';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {CheckBoxItem} from '../../../components/CheckBoxItem';


class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            formData: {},
            printConfirmation: false,
            reject: false,
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
                                label="Type"
                                name="type"
                                variant="outline"
                                type="text"
                            />
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
                                <FormInput
                                    label="NAICS Code"
                                    name="NAICS code"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
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
                                    label="SoldTo/BillTo"
                                    name="sold-to/bill-to"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Sales Sample Cost Center"
                                    name="sales-sample-cost-center"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Sales Sample Sub Cost Center"
                                    name="sales-sample-sub-cost-center"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Effective Date"
                                    name="effective-date"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Purpose of Request"
                                    name="purpose-of-request"
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
                                <FormSelect
                                    label="Customer Type"
                                    name="customer-type"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="10CAP">
                                        Canada, Asia, Pacific Region
                                    </option>
                                    <option value="20EUR">Europe</option>
                                    <option value="30DOM">
                                        {' '}
                                        U.S. Domestic
                                    </option>
                                    <option value="40HOM">
                                        {' '}
                                        Private Practice/Homecare
                                    </option>
                                    <option value="50OEM">OEM</option>
                                    <option value="60GOV">U.S. Gov</option>
                                    <option value="70VEN">Vendor</option>
                                    <option value="80EMP">Employee</option>
                                    <option value="90VAS">Intercompany</option>
                                    <option value="95CAH">GE</option>
                                </FormSelect>
                                <FormSelect
                                    label="Price List"
                                    name="price-list"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="1">1</option>
                                    <option value="3">3</option>
                                </FormSelect>
                                <FormSelect
                                    label="Primary Sales Rep"
                                    name="primary-sales-rep"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="domestic">
                                        ADMIN-SALES DEFAULT
                                    </option>
                                    <option value="international">
                                        ADMIN-SALES INTERNATIONAL
                                    </option>
                                </FormSelect>
                                <FormInput
                                    label="Comments - Internal"
                                    name="comments"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
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
                                <FormInput
                                    label="Address Short Name"
                                    name="address-short-name"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Address Short Name"
                                    name="address-short-name"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormInput
                                    label="Tax Jurisdiction"
                                    name="tax-jurisdiction"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <FormSelect
                                    label="Carrier"
                                    name="carrier"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="UPS">UPS</option>
                                    <option value="FDXG">FDXG</option>
                                    <option value="FWDR">FWDR</option>
                                    <option value="MAIL">MAIL</option>
                                </FormSelect>
                                <FormSelect
                                    label="F.O.B"
                                    name="F.O.B"
                                    variant="solid"
                                    required="true">
                                    <option value="0">Choose from...</option>
                                    <option value="orig">ORIG</option>
                                    <option value="dest">DEST</option>
                                </FormSelect>
                                <FormInput
                                    label="Ship Via"
                                    name="ship-via"
                                    variant="solid"
                                    type="text"
                                    required="true"
                                />
                                <CheckBoxItem
                                    title="Print Confirmation"
                                    stateValue={this.state.printConfirmation}
                                    onValueChange={() =>
                                        this.setState({
                                            printConfirmation: !this.state
                                                .printConfirmation,
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
