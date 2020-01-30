import React from 'react';
import {
    ScrollView,
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
import { Flex, Column, Card, Button, Box, Text } from '../components/common';
import { FormInput, FormSelect } from '../components/form';

function slugify(string) {
    const a =
        'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b =
        'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

const buildSchema = fields => ({
    ...(fields.system === 'pointman' && {
        role: {
            label: 'Role',
            values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
            required: false,
        },
        soldTo: {
            label: 'Sold To/Bill To',
            display:
                fields.system === 'pointman' && fields.role === 'ship-to'
                    ? 'block'
                    : 'none',
        },
        costCenter: {
            label: 'Sales Sample Cost Center',
            required: true,
            display:
                fields.system === 'pointman' && fields.role === 'sales-rep'
                    ? 'block'
                    : 'none',
        },
        subCostCenter: {
            label: 'Sales Sample Sub Cost Center',
            required: true,
            display:
                fields.system === 'pointman' && fields.role === 'sales-rep'
                    ? 'block'
                    : 'none',
        },
        salesOrg: {
            label: 'Sales Sample Sub Cost Center',
            required: fields.system === ('sap-apollo' || 'sap-olympus'),
            display:
                fields.system === ('sap-apollo' || 'sap-olympus')
                    ? 'block'
                    : 'none',
        },
    }),
    ...(fields.system === 'made2manage' && {
        role: {
            label: 'Role',
            values: ['Sold To/Bill To', 'Ship To', 'Sales Rep'],
            required: true,
        },
        soldTo: {
            label: 'Sold To/Bill To',
            display:
                fields.role === 'ship-to'
                    ? 'block'
                    : fields.role === 'sales-rep'
                    ? 'block'
                    : 'none',
        },
        costCenter: { display: 'none' },
        subCostCenter: { display: 'none' },
        salesOrg: { display: 'none' },
    }),
    ...(fields.system === 'sap-apollo' && {
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
            required: true,
        },
        salesOrg: {
            label: 'Sales Org',
            values: ['0150', '0120', '0130', 'N/A'],
            value:
                fields.country === 'CA'
                    ? '0150'
                    : fields.role === 'sales-rep-0001'
                    ? '0120'
                    : fields.category === 'direct'
                    ? '0120'
                    : fields.category === 'distributor' ||
                      fields.category === 'oem' ||
                      fields.category === 'kitter' ||
                      fields.category === 'dropship'
                    ? '0130'
                    : 'N/A',
            required: true,
        },
        soldTo: { display: 'none' },
        costCenter: { display: 'none' },
        subCostCenter: { display: 'none' },
    }),
    ...(fields.system === '' && {
        role: {
            label: 'Role',
            values: [],
            required: true,
        },
        salesOrg: {
            label: 'Sales Org',
            values: [],
            display: 'none',
        },
        soldTo: { display: 'none' },
        costCenter: { display: 'none' },
        subCostCenter: { display: 'none' },
    }),
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            system: '',
            role: '',
            formData: {},
            formSchema: buildSchema({ system: 'pointman' }),
        };
    }

    componentDidMount(): void {
        console.log(buildSchema({ system: 'pointman' }));
    }

    updateSchema = () =>
        this.setState({
            formSchema: buildSchema(this.state.formData),
        });

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

    render() {
        const { width, height, marginBottom, location } = this.props;

        // const schema {
        //
        // }

        console.log(this.state);

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: '#eff3f6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 10,
                    }}>
                    <Box fullHeight my={2}>
                        <Box
                            flexDirection="row"
                            justifyContent="space-around"
                            my={4}
                            alignItems="center">
                            <FormInput
                                padding="8px 25px 0px 25px"
                                style={{ lineHeight: '2', paddingBottom: 0 }}
                                flex={1 / 4}
                                mb={2}
                                label="Title"
                                name="title"
                            />
                            <FormInput
                                px="25px"
                                flex={1 / 4}
                                label="Workflow Number"
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
                                style={{ lineHeight: '2' }}
                                variant="outline"
                                type="text"
                            />
                        </Box>

                        <Text
                            m="16px 0 16px 5%"
                            fontWeight="light"
                            color="#4195C7"
                            fontSize="28px">
                            MDM GLOBAL FIELDS
                        </Text>

                        <Box flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput label="Name" name="name" required />
                                <FormInput
                                    label="Street"
                                    name="street"
                                    required
                                />
                                <FormInput label="City" name="city" required />
                                <FormInput
                                    label="Region"
                                    name="region"
                                    required
                                />
                                <FormInput
                                    label="Postal Code"
                                    name="postal-code"
                                    required
                                />
                                <FormInput
                                    label="Country"
                                    name="country"
                                    onChange={this.onFieldChange}
                                    required
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormInput label="Telephone" name="Country" />
                                <FormInput label="Fax" name="fax" />
                                <FormInput label="Email" name="email" />
                                <FormSelect
                                    label="Category"
                                    name="category"
                                    onChange={this.onFieldChange}
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="distributor">
                                        Distributor
                                    </option>
                                    <option value="self-distributor">{`Self-Distributor`}</option>
                                    <option value="oem">OEM</option>
                                    <option value="kitter">Kitter</option>
                                    <option value="direct">Direct</option>
                                    <option value="dropship">Drop Ship</option>
                                    <option value="internal">Internal</option>
                                </FormSelect>

                                <FormInput
                                    mt="10px"
                                    label="Tax Number 1"
                                    disabled
                                    name="tax-number"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="DUNS Number"
                                    disabled
                                    name="duns"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 4"
                                    disabled
                                    name="code-4"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 6"
                                    disabled
                                    name="code-6"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 8"
                                    disabled
                                    name="code-8"
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="NAICS Code"
                                    disabled
                                    name="naics-code"
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </Box>
                        </Box>

                        <Text
                            mt={5}
                            mb={2}
                            ml="5%"
                            fontWeight="light"
                            color="#4195C7"
                            fontSize="28px">
                            SYSTEM FIELDS
                        </Text>

                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    label="System"
                                    name="system"
                                    required
                                    value={this.state.formData.system}
                                    onChange={this.onFieldChange}
                                    variant="solid">
                                    <option value="0">Choose from...</option>
                                    <option value="sap-apollo">
                                        SAP Apollo
                                    </option>
                                    <option value="sap-olympus">
                                        SAP Olympus
                                    </option>
                                    <option value="pointman">Pointman</option>
                                    <option value="made2manage">{`Made2Manage`}</option>
                                    <option value="jd-edwards">
                                        JD Edwards
                                    </option>
                                    <option value="salesforce">
                                        Salesforce
                                    </option>
                                </FormSelect>

                                <FormInput
                                    label={
                                        this.state.formData.system ===
                                        'pointman'
                                            ? 'Sold To/Bill To'
                                            : 'Sold To'
                                    }
                                    name="sold-to"
                                    {...this.state.formSchema.soldTo}
                                />
                            </Box>
                            <Box width={1 / 2} mx="auto" alignItems="center">
                                <FormSelect
                                    label="Role"
                                    name="role"
                                    value={this.state.formData.role}
                                    onChange={this.onFieldChange}
                                    variant="solid"
                                    {...this.state.formSchema.role}>
                                    <option value="0">Choose from...</option>
                                    {this.state.formSchema.role.values
                                        ? this.state.formSchema.role.values.map(
                                              (val, i) => (
                                                  <option
                                                      key={`role-option-${i}`}
                                                      value={slugify(val)}>
                                                      {val}
                                                  </option>
                                              )
                                          )
                                        : null}
                                </FormSelect>

                                <FormSelect
                                    label="Sales Org"
                                    name="sales-org"
                                    variant="solid"
                                    {...this.state.formSchema.salesOrg}>
                                    <option value="0">Choose from...</option>
                                    {this.state.formSchema.salesOrg.values
                                        ? this.state.formSchema.salesOrg.values.map(
                                              (val, i) => (
                                                  <option
                                                      selected={
                                                          val ===
                                                          this.state.formSchema
                                                              .salesOrg.value
                                                      }
                                                      key={`sales-org-option-${i}`}
                                                      value={slugify(val)}>
                                                      {val}
                                                  </option>
                                              )
                                          )
                                        : null}
                                </FormSelect>

                                <FormInput
                                    name={slugify('Sales Sample Cost Center')}
                                    value={this.state.formData.costCenter}
                                    onChange={this.onFieldChange}
                                    {...this.state.formSchema.costCenter}
                                />
                                <FormInput
                                    name={slugify(
                                        'Sales Sample Sub Cost Center'
                                    )}
                                    value={this.state.formData.subCostCenter}
                                    onChange={this.onFieldChange}
                                    {...this.state.formSchema.subCostCenter}
                                />
                                <FormInput
                                    label="Effective Date"
                                    name={slugify('Effective Date')}
                                    type="date"
                                />
                            </Box>
                        </Box>
                        <Box mt={2} flexDirection="row" justifyContent="center">
                            <Box width={0.79} mx="auto" alignItems="center">
                                <FormInput
                                    maxWidth={'98%'}
                                    label="Purpose of Request"
                                    name="purpose-request"
                                    multiline
                                    numberOfLines={4}
                                />
                            </Box>
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
