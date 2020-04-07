import React, { Component, Fragment } from 'react';
import { Box, Text } from './common';
import { FormInput, FormSelect } from './form';
const _ = require('lodash');

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
        .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

class SystemFields extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { system, ...rest } = this.props.formSchema;
    }

    renderInput() {
        const { system, ...rest } = this.props.formSchema;

        const inputProps = this.props.readOnly
            ? {
                  inline: true,
                  variant: 'outline',
              }
            : {
                  inline: false,
                  onChange: this.props.onFieldChange,
              };

        return _.toPairs(rest).map((obj) => {
            const [key, schema] = obj;

            if (!schema.values) {
                return (
                    <FormInput
                        name={slugify(schema.label)}
                        {...schema}
                        {...inputProps}
                    />
                );
            }
        });
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

        return (
            <Fragment>
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
                            value={this.props.formData.system}
                            onChange={this.props.onFieldChange}
                            variant="solid">
                            <option value="0">Choose from...</option>
                            <option value="sap-apollo">SAP Apollo</option>
                            <option value="sap-olympus">SAP Olympus</option>
                            <option value="pointman">Pointman</option>
                            <option value="made2manage">{`Made2Manage`}</option>
                            <option value="jd-edwards">JD Edwards</option>
                            <option value="salesforce">Salesforce</option>
                        </FormSelect>

                        <FormInput
                            label={
                                this.props.formData.system === 'pointman'
                                    ? 'Sold To/Bill To'
                                    : 'Sold To'
                            }
                            name="sold-to"
                            {...this.props.formSchema.soldTo}
                            {...inputProps}
                        />
                    </Box>

                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormSelect
                            label="Role"
                            name="role"
                            value={this.props.formData.role}
                            onChange={this.props.onFieldChange}
                            variant="solid"
                            {...this.props.formSchema.role}>
                            <option value="0">Choose from...</option>
                            {this.props.formSchema.role.values
                                ? this.props.formSchema.role.values.map(
                                      (val, i) => (
                                          <option
                                              key={`role-option-${i}`}
                                              value={i + 1}>
                                              {val}
                                          </option>
                                      )
                                  )
                                : null}
                        </FormSelect>

                        {this.props.formSchema.salesOrg && (
                            <FormSelect
                                label="Sales Org"
                                name="sales-org"
                                variant="solid"
                                {...this.props.formSchema.salesOrg}>
                                <option value="0">Choose from...</option>
                                {this.props.formSchema.salesOrg.values
                                    ? this.props.formSchema.salesOrg.values.map(
                                          (val, i) => (
                                              <option
                                                  selected={
                                                      val ===
                                                      this.props.formSchema
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
                        )}

                        <FormInput
                            name={slugify('Sales Sample Cost Center')}
                            value={this.props.formData.costCenter}
                            onChange={this.props.onFieldChange}
                            {...this.props.formSchema.costCenter}
                            {...inputProps}
                        />
                        <FormInput
                            name={slugify('Sales Sample Sub Cost Center')}
                            value={this.props.formData.subCostCenter}
                            onChange={this.props.onFieldChange}
                            {...this.props.formSchema.subCostCenter}
                            {...inputProps}
                        />
                        <FormInput
                            label="Effective Date"
                            name={slugify('Effective Date')}
                            type="date"
                            {...inputProps}
                        />
                    </Box>
                </Box>
            </Fragment>
        );
    }
}

export default SystemFields;
