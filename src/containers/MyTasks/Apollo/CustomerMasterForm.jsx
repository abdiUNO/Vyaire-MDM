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
import GlobalMdmFields from '../../../components/GlobalMdmFields';
import debounce from 'lodash.debounce'
import { resolveDependencies, passFields ,yupFieldValidation} from '../../../constants/utils';
import {yupglobalMDMFieldRules,mytaskCustomerMasterRules } from '../../../constants/FieldRules';


const CheckBoxItem = ({ name,title,onValueChange, stateValue }) => (
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
            <CheckBox name={name} value={stateValue} onValueChange={onValueChange} />
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
const waitTime=1;

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            CM_Data:{'Role':'soldTo','Country':'CA','Region':'IN'},
            formData: {'OrderCombination':false,
                'PaymentHistoryRecord':false,
                'RejectionButton':false},            
            formErrors: {}
        };
    }

    setFormErrors = (isValid,key,errors) =>{
        const {formErrors} = this.state;
        if (!isValid) {
              this.setState({formErrors: {...formErrors, [key]: errors}});
            } else {
              this.setState({formErrors: {...formErrors, [key]: null}});
            }
    }

    onFieldChange = ( value,e) => {   
        const {name}=e.target          
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value,
                },
            },
            ()=>{console.log(this.state.formData)});
        
    };

    parseAndHandleFieldChange = (value,e)=>{
        const {name}=e.target
        const val=parseInt(value,10)
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: val,
                },
            },
            ()=>{console.log(this.state.formData)});
    }

    handleSubmit = (event,action,schema) => {
        if(action==='reject')
        {
            this.setState(
                {
                    formData: {
                        ...this.state.formData,
                        RejectionButton: true,
                    },
                },
                () => {
                    yupFieldValidation(this.state.formData,schema,this.setFormErrors);
                }
                );
        }else{
            yupFieldValidation(this.state.formData,schema,this.setFormErrors);
            console.log(this.state.formData)
        }
    };
      
    render() {
        const { width, height, marginBottom, location } = this.props;
        const {CM_Data}=this.state;
        let barwidth = Dimensions.get('screen').width - 1000;
        let progressval = 40;
        let LED=null, LN=null ,displayLN=false;
        if(['soldTo','shipTo','salesRep','dropShip'].includes(CM_Data.Role)){
            displayLN=true
            if(CM_Data.Role==='salesRep'){
                LN='R-SALES'
                LED='12/31/9999'
            }else if(CM_Data.Country!='US'){
                LN='I-INTER'
                LED='12/31/9999'               
            }else if(['IN','UV'].includes(CM_Data.Region )){
                LN='S_IN_STATE'
                LED='12/31/9999'
            } 
        }

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
                        <GlobalMdmFields  readOnly={true} formErrors={this.state.formErrors} onFieldChange={this.onFieldChange.bind(this,yupglobalMDMFieldRules)} />

                        <Text
                            mt={5}
                            mb={2}
                            alignSelf="flex-start"
                            fontWeight="regular"
                            color="lightBlue"
                            fontSize={24}
                            pl={4}>
                            SYSTEM FIELDS
                        </Text>
                        <Box flexDirection="row" justifyContent="center">
                            
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormInput
                                    label="System"
                                    name="System"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Role"
                                    name="Role"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Sales Org"
                                    name="SalesOrg"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                                <FormInput
                                    label="Purpose of Request"
                                    name="PurposeOfRequest"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                               
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
                                
                            {displayLN &&  
                                <>
                                <FormInput
                                    required
                                    label="License Number"
                                    name="LicenseNumber"
                                    error={this.state.formErrors ? this.state.formErrors['LicenseNumber'] : null }
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                    label="License Expiration Date"
                                    name="LicenseExpiratinDate"
                                    variant="solid"
                                    value={LED}
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['LicenseExpiratinDate'] : null }
                                    type="date"
                                    required
                                />
                                </>
                            }
                                <FormInput
                                    label="Search Term 1"
                                    name="SearchTerm1"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['SearchTerm1'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Search Term 2"
                                    name="SearchTerm2"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['SearchTerm2'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Distribution Channel"
                                    name="DistributionChannel"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['DistributionChannel'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Division"
                                    name="Division"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['Division'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Transportation Zone"
                                    name="TransportationZone"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['TransportationZone'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Partner Function Number"
                                    name="PartnerFunctionNumber"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['PartnerFunctionNumber'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput
                                    label="Tax Number 2"
                                    name="TaxNumber2"
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['TaxNumber2'] : null }
                                    onChange={this.onFieldChange}
                                    type="text"
                                />
                                <FormInput
                                    label="Sort Key"
                                    name="SortKey"
                                    variant="solid"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['SortKey'] : null }
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Payment Methods"
                                    name="PaymentMethods"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['PaymentMethods'] : null }
                                    variant="solid"
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Acctg Clerk"
                                    name="AcctgClerk"
                                    variant="solid"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AcctgClerk'] : null }
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Account Statement"
                                    name="AccountStatement"
                                    variant="solid"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AccountStatement'] : null }
                                    type="text"
                                    required
                                />
                                <FormInput
                                    label="Incoterms 2"
                                    name="Incoterms2"
                                    variant="solid"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['Incoterms2'] : null }
                                    type="text"
                                    required
                                />

                                <FormInput
                                    label="Tax Classification"
                                    name="TaxClassification"
                                    variant="solid"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['TaxClassification'] : null }
                                    type="text"
                                    required
                                />
                            </Box>
                        </Box>
                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                
                                <FormSelect
                                    label="Customer Class"
                                    name="CustomerClass"
                                    variant="solid"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['CustomerClass'] : null }
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="01">
                                        Dept of Defense
                                    </option>
                                    <option value="02">
                                        Public Health Services
                                    </option>
                                    <option value="03">
                                        General Services Admin
                                    </option>
                                    <option value="04">
                                        Veterans Admin
                                    </option>
                                    <option value="05">
                                        State/Local
                                    </option>
                                    <option value="06">
                                        Non Government
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Industry Code "
                                    name="IndustryCode5"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['IndustryCode5'] : null }
                                    variant="solid"
                                    >
                                    <option value="0">Choose from...</option>
                                    <option value="0001">
                                        {' '}
                                        Contract Manufacturing
                                    </option>
                                    <option value="0002">
                                        Internal/ICO
                                    </option>
                                    <option value="0003">
                                        GE/Armstrong
                                    </option>
                                    <option value="0004">
                                        Distributor
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Company Code"
                                    name="CompanyCode"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['CompanyCode'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="0120"> 0120</option>
                                    <option value="0150">0150</option>
                                </FormSelect>
                                <FormSelect
                                    label="Industry"
                                    name="Industry"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['Industry'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="0001"> Acute</option>
                                    <option value="0002">Non Acute</option>
                                </FormSelect>
                                <FormSelect
                                    label="Recon Account"
                                    name="ReconAccount"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['ReconAccount'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="12100">Customer/Trade Account</option>
                                    <option value="12900">Intercompany</option>
                                </FormSelect>
                                <FormSelect
                                    label="Sales Office"
                                    name="SalesOffice"
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['SalesOffice'] : null }
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="2100">Direct</option>
                                    <option value="2120">
                                        Sales Reps
                                    </option>
                                    <option value="2140">
                                        International
                                    </option>
                                    <option value="2200">
                                        Government
                                    </option>
                                    <option value="3500">
                                        Distributors
                                    </option>
                                    <option value="3700">
                                        OEM/Kitters
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Customer Group"
                                    name="CustomerGroup"
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['CustomerGroup'] : null }
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="01">Rbtd Dist - CAH</option>
                                    <option value="02">Affiliates</option>
                                    <option value="03">Alternate Site</option>
                                    <option value="04">Biomed Repair</option>
                                    <option value="05"> Non Rbtd Distributor/Self Distributor</option>
                                    <option value="06">Hospital</option>
                                    <option value="08">Internal</option>
                                    <option value="09"> Intl Dealer/ Exporter</option>
                                    <option value="10">OEM/Kitter</option>
                                    <option value="12">Rbtd Dist - Non CAH</option>
                                    <option value="14">Third Party End User</option>
                                </FormSelect>
                                <FormSelect
                                    label="PP Cust Proc"
                                    name="PPCustProc"
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    error={this.state.formErrors ? this.state.formErrors['PPCustProc'] : null }
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="A">
                                        Product Proposal
                                    </option>
                                    <option value="B">
                                        Cross Selling
                                    </option>
                                </FormSelect>
                                
                                <FormInput
                                    label="Additional Notes"
                                    name="AdditionalNotes"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AdditionalNotes'] : null }
                                    multiline
                                    numberOfLines={2}                                    
                                    variant="solid"
                                    type="text"
                                />
                                <FormInput
                                        label="Rejection Reason"
                                        name="RejectionReason"
                                        onChange={this.onFieldChange}
                                        error={this.state.formErrors ? this.state.formErrors['RejectionReason'] : null }
                                        multiline
                                        numberOfLines={2}
                                        variant="solid"
                                        type="text"
                                />
                            
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    label="Price List"
                                    name="PriceList"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['PriceList'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="A1">Intercompany</option>
                                    <option value="VA">Government (VA)</option>
                                    <option value="GV">Government (Non VA)</option>
                                    <option value="DM">Domestic (US, non-government)</option>
                                    <option value="IN">International</option>
                                </FormSelect>
                                <FormSelect
                                    label="Cust Pric Proc"
                                    name="CustPricProc"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['CustPricProc'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="3">Affiliate</option>
                                    <option value="G">MPT Gov pric proc</option>
                                    <option value="1">Standard</option>
                                </FormSelect>
                                <FormSelect
                                    label="Delivery Priority"
                                    name="DeliveryPriority"
                                    onChange={this.parseAndHandleFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['DeliveryPriority'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="30">Domestic Direct, Sales Rep, Trace,Government</option>
                                    <option value="40"> Canada and Mexico</option>
                                    <option value="45">International, Puerto Rico</option>
                                    <option value="35">Distributors</option>
                                </FormSelect>
                                <FormSelect
                                    label="Shipping Conditions"
                                    name="ShippingConditions"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['ShippingConditions'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="DM">DM</option>
                                    <option value="EX">EX</option>
                                </FormSelect>

                                <FormSelect
                                    label="Incoterms 1"
                                    name="Incoterms1"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['Incoterms1'] : null }
                                    variant="solid"
                                    required>
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
                                    name="AcctAssgmtGroup"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AcctAssgmtGroup'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="01">Domestic</option>
                                    <option value="02">
                                        International
                                    </option>
                                    <option value="ZA">
                                        InterCompany
                                    </option>
                                </FormSelect>
                                <FormSelect
                                    label="Partner Function"
                                    name="PartnerFunction"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['PartnerFunction'] : null }
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
                                    name="AccountType"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['AccountType'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="DTR">DTR</option>
                                    <option value="INT">INT</option>
                                    <option value="IDV">IDV</option>
                                    <option value="NRD">NRD</option>
                                    <option value="SDT">SDT</option>
                                    <option value="IEX">IEX</option>
                                    <option value="OEM">OEM</option>
                                    <option value="KTR">KTR</option>
                                </FormSelect>
                                <FormSelect
                                    label="Shipping Customer Type"
                                    name="ShippingCustomerType"
                                    onChange={this.onFieldChange}
                                    error={this.state.formErrors ? this.state.formErrors['ShippingCustomerType'] : null }
                                    variant="solid"
                                    required>
                                    <option value="0">Choose from...</option>
                                    <option value="DIR">DIR</option>
                                    <option value="DIS">DIS</option>
                                    <option value="INT">INT</option>
                                    <option value="OEM">OEM</option>
                                </FormSelect>
                                <CheckBoxItem
                                    title="Order Combination"
                                    name="OrderCombination"
                                    stateValue={this.state.formData.OrderCombination}
                                    onValueChange={() =>
                                        this.setState(
                                            {
                                                formData: {
                                                    ...this.state.formData,
                                                    OrderCombination: !this.state.formData.OrderCombination
                                                }
                                            })
                                        }
                                                                        
                                />
                                <CheckBoxItem
                                    title="Payment History Record"
                                    name="PaymentHistoryRecord"
                                    stateValue={this.state.formData.PaymentHistoryRecord}
                                    onValueChange={() =>
                                        this.setState(
                                            {
                                                formData: {
                                                    ...this.state.formData,
                                                    PaymentHistoryRecord: !this.state.formData.PaymentHistoryRecord
                                                }
                                            })
                                        }
                                />

                                    
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
                            onPress={(event) =>this.handleSubmit(event,'approve',mytaskCustomerMasterRules) }
                            title="Approve"
                        />
                        <Button
                            title="Reject"
                            onPress={(event) =>this.handleSubmit(event,'reject',mytaskCustomerMasterRules) }
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
