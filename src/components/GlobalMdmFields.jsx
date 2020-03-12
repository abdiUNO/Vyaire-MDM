/**
 * @prettier
 */

import React, { Component, Fragment } from 'react';
import { Box, Text } from './common';
import { FormInput, FormSelect } from './form';
import { FontAwesome } from '@expo/vector-icons';
import { times } from 'lodash';

const AddIcon = ({ onPress }) => (
    <Box ml={3}>
        <FontAwesome.Button
            name="plus"
            size={15}
            color="#FFFFFF"
            backgroundColor="#264384"
            borderRadius={13}
            iconStyle={{ marginRight: 0, paddingHorizontal: 1 }}
            onPress={onPress}
        />
    </Box>
);

class GlobalMdmFields extends Component {
    state = {
        namesInput: 0,
    };

    addNameInput = () => {
        const { namesInput } = this.state;

        if (namesInput < 3) {
            this.setState({
                namesInput: namesInput + 1,
            });
        }
    };

    componentDidMount() {
        this.setState({ namesInput: 3 });
    }

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

        const { namesInput } = this.state;

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
                            display="flex"
                            flex={1}
                            flexDirection="row"
                            label="Name"
                            name="Name1"
                            error={
                                this.props.formErrors
                                    ? this.props.formErrors['Name1']
                                    : null
                            }
                            required
                            defaultValue={
                                this.props.formData &&
                                this.props.formData['Name1']
                            }
                            rightComponent={() =>
                                !readOnly && (
                                    <AddIcon onPress={this.addNameInput} />
                                )
                            }
                            {...inputProps}
                        />

                        {times(namesInput, index => (
                            <FormInput
                                label={`Names ${index + 1}`}
                                name={`Names${index + 1}`}
                                {...inputProps}
                            />
                        ))}

                        <FormInput
                            label="Street"
                            name="Street"
                            error={
                                this.props.formErrors
                                    ? this.props.formErrors['Street']
                                    : null
                            }
                            required
                            value={
                                this.props.formData &&
                                this.props.formData.Street
                            }
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
                            error={
                                this.props.formErrors
                                    ? this.props.formErrors['City']
                                    : null
                            }
                            required
                            value={
                                this.props.formData && this.props.formData.City
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Region"
                            name="Region"
                            error={
                                this.props.formErrors
                                    ? this.props.formErrors['Region']
                                    : null
                            }
                            required
                            value={
                                this.props.formData &&
                                this.props.formData.Region
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Postal Code"
                            name="PostalCode"
                            error={
                                this.props.formErrors
                                    ? this.props.formErrors['PostalCode']
                                    : null
                            }
                            required
                            value={
                                this.props.formData &&
                                (this.props.formData.PostalCode ||
                                    this.props.formData.Postalcode)
                            }
                            {...inputProps}
                        />
                        <FormInput
                            label="Country"
                            name="Country"
                            error={
                                this.props.formErrors
                                    ? this.props.formErrors['Country']
                                    : null
                            }
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
                                    {...inputProps}
                                />

                                <FormInput
                                    label="Category"
                                    name="category"
                                    type="text"
                                    value={
                                        this.props.formData &&
                                        this.props.formData.Category
                                    }
                                    {...inputProps}
                                />
                            </Fragment>
                        )}
                    </Box>
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        {!readOnly && (
                            <Fragment>
                                <FormInput
                                    type="number"
                                    label="Telephone"
                                    name="Telephone"
                                    error={
                                        this.props.formErrors
                                            ? this.props.formErrors['Telephone']
                                            : null
                                    }
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Telephone ||
                                            this.props.formData
                                                .ContactTelephone)
                                    }
                                    disabled={readOnly}
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Fax"
                                    name="Fax"
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Fax ||
                                            this.props.formData.ContactFax)
                                    }
                                    error={
                                        this.props.formErrors
                                            ? this.props.formErrors['Fax']
                                            : null
                                    }
                                    disabled={readOnly}
                                    {...inputProps}
                                />
                                <FormInput
                                    label="Email"
                                    name="Email"
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Email ||
                                            this.props.formData
                                                .ContactEmailAddress)
                                    }
                                    error={
                                        this.props.formErrors
                                            ? this.props.formErrors['Email']
                                            : null
                                    }
                                    disabled={readOnly}
                                    {...inputProps}
                                />

                                <FormSelect
                                    label="Category"
                                    name="Category"
                                    value={this.props.formData.Category}
                                    onChange={this.props.onFieldChange}
                                    required
                                    error={
                                        this.props.formErrors
                                            ? this.props.formErrors['Category']
                                            : null
                                    }
                                    variant="solid">
                                    <option value="">Choose from...</option>
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
                            name="Taxnumber"
                            value={
                                this.props.formData &&
                                this.props.formData.Taxnumber
                            }
                            inline
                            variant="outline"
                            type="text"
                        />

                        <FormInput
                            label="DUNS Number"
                            disabled
                            name="DunsNumber"
                            value={
                                this.props.formData &&
                                this.props.formData.DunsNumber
                            }
                            inline
                            variant="outline"
                            type="text"
                        />

                        <FormInput
                            label="SIC Code 4"
                            disabled
                            name="SicCode4"
                            value={
                                this.props.formData &&
                                this.props.formData.SicCode4
                            }
                            inline
                            variant="outline"
                            type="text"
                        />

                        <FormInput
                            label="SIC Code 6"
                            disabled
                            name="SicCode6"
                            value={
                                this.props.formData &&
                                this.props.formData.SicCode6
                            }
                            inline
                            variant="outline"
                            type="text"
                        />

                        <FormInput
                            label="SIC Code 8"
                            disabled
                            name="SicCode8"
                            value={
                                this.props.formData &&
                                this.props.formData.SicCode8
                            }
                            inline
                            variant="outline"
                            type="text"
                        />

                        <FormInput
                            label="NAICS Code"
                            disabled
                            name="NaicsCode"
                            value={
                                this.props.formData &&
                                this.props.formData.NaicsCode
                            }
                            inline
                            variant="outline"
                            type="text"
                        />

                        <FormInput
                            label="Vat Reg No"
                            disabled
                            name="VatRegNo"
                            value={
                                this.props.formData &&
                                this.props.formData.VatRegNo
                            }
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
