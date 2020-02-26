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
                    {this.props.title ? this.props.title : 'MDM GLOBAL FIELDS'}
                </Text>

                <Box flexDirection="row" justifyContent="center">
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormInput
                            label="Name"
                            name="name"
                            required
                            value={
                                this.props.formData && this.props.formData.Name
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Street"
                            name="street"
                            required
                            value={
                                this.props.formData &&
                                this.props.formData.Street
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="City"
                            name="city"
                            required
                            value={
                                this.props.formData && this.props.formData.City
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Region"
                            name="region"
                            required
                            value={
                                this.props.formData &&
                                this.props.formData.Region
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Postal Code"
                            name="postal-code"
                            required
                            value={
                                this.props.formData &&
                                this.props.formData.PostalCode
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Country"
                            name="country"
                            onChange={this.props.onFieldChange}
                            required
                            value={
                                this.props.formData &&
                                this.props.formData.Country
                            }
                            {...inputProps}
                        />

                        {readOnly && (
                            <Fragment>
                                <FormInput
                                    label="Telephone"
                                    name="telephone"
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Telephone ||
                                            this.props.formData
                                                .ContactTelephone)
                                    }
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Fax"
                                    name="fax"
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Fax ||
                                            this.props.formData.ContactFax)
                                    }
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Email ||
                                            this.props.formData
                                                .ContactEmailAddress)
                                    }
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
                                    name="telephone"
                                    disabled={readOnly}
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Fax"
                                    name="fax"
                                    disabled={readOnly}
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    disabled={readOnly}
                                    variant={readOnly && 'outline'}
                                    {...inputProps}
                                />

                                <FormSelect
                                    label="Category"
                                    name="category"
                                    onChange={this.props.onFieldChange}
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
