import React, { Component } from 'react';
import { View } from 'react-native';
import { FormInput, FormSelect } from '../../components/form';
import { Box, Text } from '../../components/common';
import Button from '../../components/common/Button';
class Page extends Component {
    render() {
        return (
            <Box display="flex" flex={1} fullHeight mx="12%" my={5}>
                <Box flexDirection="row" justifyContent="space-around" my={4}>
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
                    MDM GLOBAL FIELDS
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
                            name="postal-code"
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
                    </Box>
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormInput
                            label="Telephone"
                            name="telephone"
                            inline
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="Fax"
                            name="fax"
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
                        <FormInput
                            label="Category"
                            name="category"
                            inline
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="Tax Number 1"
                            name="tax-number"
                            inline
                            disabled
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="Duns Number"
                            name="duns-number"
                            inline
                            disabled
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="SIC Code 4"
                            name="sic-code-4"
                            inline
                            disabled
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="SIC Code 6"
                            name="sic-code-6"
                            inline
                            disabled
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="SIC Code 8"
                            name="sic-code-8"
                            inline
                            disabled
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="NAICS Code:"
                            name="naics-code"
                            inline
                            disabled
                            variant="outline"
                            type="text"
                        />
                    </Box>
                </Box>

                <Text
                    mt={4}
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
                            name="system"
                            inline
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="Sold To"
                            name="sold-to"
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
                    <Box width={1 / 2} mx="auto" alignItems="center">
                        <FormInput
                            label="Role"
                            name="role"
                            inline
                            variant="outline"
                            type="text"
                        />
                        <FormInput
                            label="Sales Org"
                            name="sales-org"
                            inline
                            variant="outline"
                            type="text"
                        />
                        <Box
                            mt={'100px'}
                            width={1 / 2}
                            flexDirection="row"
                            alignSelf="flex-end">
                            <Button title="Withdraw" ml={80} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

function MyRequestsForm() {
    return (
        <Box bg="#EFF3F6">
            <Page />
        </Box>
    );
}

export default MyRequestsForm;
