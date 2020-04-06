/**
 * @prettier
 */

import React, { Component, Fragment } from 'react';
import { Box, Text } from './common';
import { FormInput, FormSelect, CountryDropdown, RegionDropdown } from './form';
import { FontAwesome } from '@expo/vector-icons';
import { times } from 'lodash';
import { CategoryTypes } from '../constants/WorkflowEnums.js';
import { View } from 'react-native';
import { TextInput } from 'react-native-web';
import CountryRegionData from '../constants/data.normalized';
import idx from 'idx';
import DeltaField from './DeltaField';

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

const RemoveIcon = ({ onPress }) => (
    <Box ml={3}>
        <FontAwesome.Button
            name="minus"
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
        country: '',
        region: '',
    };

    selectCountry(val) {
        this.setState({ country: val });
    }

    selectRegion(val) {
        this.setState({ region: val });
    }

    addNameInput = () => {
        const { namesInput } = this.state;

        if (namesInput < 3) {
            this.setState({
                namesInput: namesInput + 1,
            });
        }
    };

    removeNameInput = () => {
        const { namesInput } = this.state;

        if (namesInput >= 1) {
            this.setState({
                namesInput: namesInput - 1,
            });
        }
    };

    componentDidMount() {
        if (this.props.readOnly) {
            this.setState({ namesInput: 3 });
        }
    }

    render() {
        let { readOnly, formData = {}, deltas = {}, hide } = this.props;
        if (!formData) formData = {};

        const inputProps = readOnly
            ? {
                  inline: true,
                  variant: 'outline',
                  readOnly: true,
              }
            : {
                  inline: false,
                  readOnly: false,
                  onBlur: this.props.onFieldChange,
              };

        const { namesInput } = this.state;

        const country =
            idx(CountryRegionData, (_) => _[formData.Country]) || {};

        const region = idx(country, (_) => _.regions[formData.Region]) || {};

        return (
            <Fragment>
                <Text
                    m="10px 0 16px 5%"
                    fontWeight="light"
                    color="#4195C7"
                    fontSize="28px">
                    {this.props.title ? this.props.title : 'MDM GLOBAL FIELDS'}
                </Text>

                <Box flexDirection="row" justifyContent="center">
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        {deltas[`Name1`] ? (
                            <DeltaField delta={deltas[`Name1`]} label="Name" />
                        ) : (
                            <FormInput
                                display="flex"
                                flex={1}
                                flexDirection="row"
                                label="Name"
                                name="Name1"
                                required
                                value={formData['Name1']}
                                rightComponent={() =>
                                    !readOnly && (
                                        <AddIcon onPress={this.addNameInput} />
                                    )
                                }
                                {...inputProps}
                            />
                        )}

                        {times(namesInput, (index) => {
                            index += 1;
                            if (readOnly) {
                                return deltas[`Name${index + 1}`] ? (
                                    <DeltaField
                                        delta={deltas[`Name${index + 1}`]}
                                    />
                                ) : formData[`Names${index + 1}`] ? (
                                    <FormInput
                                        key={`name${index}`}
                                        label={`Names ${index + 1}`}
                                        name={`Names${index + 1}`}
                                        error={
                                            this.props.formErrors
                                                ? this.props.formErrors[
                                                      `Names${index + 1}`
                                                  ]
                                                : null
                                        }
                                        value={formData[`Names${index + 1}`]}
                                        rightComponent={() =>
                                            !readOnly && (
                                                <RemoveIcon
                                                    onPress={
                                                        this.removeNameInput
                                                    }
                                                />
                                            )
                                        }
                                        {...inputProps}
                                    />
                                ) : null;
                            } else {
                                return (
                                    <FormInput
                                        key={`name${index}`}
                                        label={`Names ${index + 1}`}
                                        name={`Names${index + 1}`}
                                        error={
                                            this.props.formErrors
                                                ? this.props.formErrors[
                                                      `Names${index + 1}`
                                                  ]
                                                : null
                                        }
                                        value={formData[`Names${index + 1}`]}
                                        rightComponent={() =>
                                            !readOnly && (
                                                <RemoveIcon
                                                    onPress={
                                                        this.removeNameInput
                                                    }
                                                />
                                            )
                                        }
                                        {...inputProps}
                                    />
                                );
                            }
                        })}

                        {deltas[`Street`] ? (
                            <DeltaField delta={deltas[`Street`]} />
                        ) : (
                            <FormInput
                                label="Street"
                                name="Street"
                                error={
                                    this.props.formErrors
                                        ? this.props.formErrors['Street']
                                        : null
                                }
                                required
                                value={formData.Street}
                                {...inputProps}
                            />
                        )}

                        {deltas[`Street2`] ? (
                            <DeltaField
                                delta={deltas[`Street2`]}
                                label="Street 2"
                            />
                        ) : (
                            <FormInput
                                label="Street 2"
                                name="Street2"
                                {...inputProps}
                            />
                        )}

                        {deltas[`City`] ? (
                            <DeltaField delta={deltas[`Street2`]} />
                        ) : (
                            <FormInput
                                label="City"
                                name="City"
                                error={
                                    this.props.formErrors
                                        ? this.props.formErrors['City']
                                        : null
                                }
                                required
                                value={formData.City}
                                {...inputProps}
                                autoComplete="off"
                            />
                        )}

                        {readOnly ? (
                            <FormInput
                                label="Region"
                                name="Region"
                                error={
                                    this.props.formErrors
                                        ? this.props.formErrors['Region']
                                        : null
                                }
                                required
                                value={region.name || ''}
                                {...inputProps}
                                upperCase
                                autoComplete="off"
                            />
                        ) : (
                            <RegionDropdown
                                country={formData.Country}
                                label="Region"
                                name="Region"
                                error={
                                    this.props.formErrors
                                        ? this.props.formErrors['Region']
                                        : null
                                }
                                required
                                value={formData.Region}
                                upperCase
                                autoComplete="off"
                                inline={false}
                                readOnly={false}
                                onChange={(val, e) => {
                                    console.log({ val, e });
                                    this.props.onFieldChange(val, e);
                                }}
                            />
                        )}

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
                            autoComplete="off"
                        />
                        {readOnly ? (
                            <FormInput
                                label="Country"
                                name="Country"
                                error={
                                    this.props.formErrors
                                        ? this.props.formErrors['Country']
                                        : null
                                }
                                required
                                value={country.countryName || ''}
                                {...inputProps}
                                upperCase
                                autoComplete="off"
                            />
                        ) : (
                            <CountryDropdown
                                label="Country"
                                name="Country"
                                inline={false}
                                readOnly={false}
                                error={
                                    this.props.formErrors
                                        ? this.props.formErrors['Country']
                                        : null
                                }
                                required
                                value={formData.Country}
                                upperCase
                                autoComplete="off"
                                onChange={(val, e) => {
                                    console.log({ val, e });
                                    this.props.onFieldChange(val, e);
                                }}
                            />
                        )}

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
                                    autoComplete="off"
                                />

                                <FormInput
                                    label="Category"
                                    name="CategoryTypeId"
                                    type="text"
                                    value={
                                        CategoryTypes[formData.CategoryTypeId]
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
                                <TextInput
                                    name="email"
                                    type="hidden"
                                    value={
                                        this.props.formData &&
                                        (this.props.formData.Email ||
                                            this.props.formData
                                                .ContactEmailAddress)
                                    }
                                    {...(readOnly
                                        ? {
                                              readOnly: true,
                                          }
                                        : {
                                              readOnly: false,
                                              onBlur: this.props.onFieldChange,
                                          })}
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
                                    autoComplete="off"
                                />

                                <FormSelect
                                    label="Category"
                                    name="CategoryTypeId"
                                    onChange={this.props.onFieldChange}
                                    required
                                    error={
                                        this.props.formErrors
                                            ? this.props.formErrors[
                                                  'CategoryTypeId'
                                              ]
                                            : null
                                    }
                                    variant="solid"
                                    value={
                                        this.props.formData['CategoryTypeId']
                                    }>
                                    <option hidden={true}>
                                        Choose from...
                                    </option>
                                    {CategoryTypes.map((category, index) => (
                                        <option
                                            key={`category-${index}`}
                                            value={index + 1}>
                                            {category}
                                        </option>
                                    ))}
                                </FormSelect>
                            </Fragment>
                        )}

                        {this.props.children ? (
                            this.props.children
                        ) : (
                            <>
                                <FormInput
                                    mt="10px"
                                    label="Tax Jurisdiction"
                                    name="TaxJurisdiction"
                                    error={
                                        this.props.formErrors
                                            ? this.props.formErrors[
                                                  'TaxJurisdiction'
                                              ]
                                            : null
                                    }
                                    type="text"
                                    required
                                    value={
                                        this.props.formData
                                            ? this.props.formData[
                                                  'TaxJurisdiction'
                                              ]
                                            : null
                                    }
                                    variant="outline"
                                    inline
                                />
                                <FormInput
                                    mt="10px"
                                    label="Tax Number 1"
                                    disabled
                                    name="Taxnumber"
                                    value={formData.TaxNumber}
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="DUNS Number"
                                    disabled
                                    name="DunsNumber"
                                    value={formData.DunsNumber}
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 4"
                                    disabled
                                    name="SicCode4"
                                    value={formData.SicCode4}
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 6"
                                    disabled
                                    name="SicCode6"
                                    value={formData.SicCode6}
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="SIC Code 8"
                                    disabled
                                    name="SicCode8"
                                    value={formData.SicCode8}
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="NAICS Code"
                                    disabled
                                    name="NaicsCode"
                                    value={formData.NaicsCode}
                                    inline
                                    variant="outline"
                                    type="text"
                                />

                                <FormInput
                                    label="Vat Reg No"
                                    disabled
                                    name="VatRegNo"
                                    value={formData.VatRegNo}
                                    inline
                                    variant="outline"
                                    type="text"
                                />
                            </>
                        )}
                    </Box>
                </Box>
            </Fragment>
        );
    }
}

export default GlobalMdmFields;
