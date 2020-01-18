import React from 'react';
import FormInput from '../../../src/components/form';
import { Box } from '../../../src/components/common/Box';

export default function TextInput({ onPress, children }) {
    return (
        <Box px="5px">
            <FormInput
                inline
                variant="outline"
                label="Cred Info Number:"
                name="cred"
                type="text"
            />

            <FormInput
                inline
                variant="outline"
                label="Payment Index:"
                name="payment"
                type="text"
            />

            <FormInput
                inline
                variant="outline"
                label="Last Ext Review:"
                name="review"
                type="text"
            />
        </Box>
    );
}
