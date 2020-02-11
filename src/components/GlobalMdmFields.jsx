import React, { Component, Fragment } from 'react';
import { Box, Text } from './common';
import { FormInput, FormSelect } from './form';

class GlobalMdmFields extends Component {
    render() {
        const { readOnly } = this.props;
        const inputProps = readOnly
            ? {
                  inline: true,
                  variant: 'outline',
              }
            : {
                  inline: false,
                  onChange: this.props.onFieldChange,
                  
              };

        return (
            <Fragment>
                <Text
                    m="16px 0 16px 5%"
                    fontWeight="light"
                    color="#4195C7"
                    fontSize="28px">
                    MDM GLOBAL FIELDS
                </Text>

                <Box flexDirection="row" justifyContent="center">
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormInput
                            label="Name"
                            name="Name1"
                            error={this.props.formErrors ? this.props.formErrors['Name1'] : null }
                            required
                            {...inputProps}
                        />
                        <FormInput
                            label="Name 2"
                            name="Name2"
                            {...inputProps}
                        />
                        <FormInput
                            label="Name 3"
                            name="Name3"
                            {...inputProps}
                        />
                        <FormInput
                            label="Name 4"
                            name="Name4"
                            {...inputProps}
                        />
                        <FormInput
                            label="Street"
                            name="Street"
                            error={this.props.formErrors ? this.props.formErrors['Street'] : null }
                            required
                            {...inputProps}
                        />
                        <FormInput
                            label="Street 2"
                            name="Street2"
                            {...inputProps}
                        />
                        <FormInput
                            label="City"
                            name="City"
                            error={this.props.formErrors ? this.props.formErrors['City'] : null }
                            required
                            {...inputProps}
                        />
                        <FormInput
                            label="Region"
                            name="Region"
                            error={this.props.formErrors ? this.props.formErrors['Region'] : null }
                            required
                            {...inputProps}
                        />
                        <FormInput
                            label="Postal Code"
                            name="PostalCode"
                            error={this.props.formErrors ? this.props.formErrors['PostalCode'] : null }
                            required
                            {...inputProps}
                        />
                        <FormInput
                            label="Country"
                            name="Country"
                            error={this.props.formErrors ? this.props.formErrors['Country'] : null }
                            required
                            {...inputProps}
                        />

                        {readOnly && (
                            <Fragment>
                                <FormInput
                                    label="Telephone"
                                    name="telephone"
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Fax"
                                    name="fax"
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    variant={readOnly && 'outline'}
                                    {...inputProps}
                                />

                                <FormInput
                                    label="Category"
                                    name="category"
                                    type="text"
                                    {...inputProps}
                                />
                            </Fragment>
                        )}
                    </Box>
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        {!readOnly && (
                            <Fragment>
                                <FormInput
                                    label="Telephone"
                                    name="Telephone"
                                    error={this.props.formErrors ? this.props.formErrors['Telephone'] : null }
                                    disabled={readOnly}
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Fax"
                                    name="Fax"
                                    error={this.props.formErrors ? this.props.formErrors['Fax'] : null }
                                    disabled={readOnly}
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Email"
                                    name="Email"
                                    error={this.props.formErrors ? this.props.formErrors['Email'] : null }
                                    disabled={readOnly}
                                    variant={readOnly && 'outline'}
                                    {...inputProps}
                                />

                                <FormSelect
                                    label="Category"
                                    name="Category"
                                    required
                                    onChange={this.props.onFieldChange}
                                    error={this.props.formErrors ? this.props.formErrors['Category'] : null }
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
                                    <option value="other">Other</option>
                                </FormSelect>
                            </Fragment>
                        )}

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
            </Fragment>
        );
    }
}

export default GlobalMdmFields;
