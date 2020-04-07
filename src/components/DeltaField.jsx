import React, { Component, Fragment } from 'react';
import { FormInput, FieldValue, Field, FieldLabel } from './form';

class DeltaField extends Component {
    render() {
        const { delta, label } = this.props;

        return (
            <Fragment>
                <Field inline name={`${delta.Name}-updated`}>
                    <FieldLabel
                        label={`+ ${label || delta.Name}`}
                        inline
                        color="#239d56"
                    />
                    <FieldValue name={`${delta.Name}-updated`}>
                        {delta.UpdatedValue || ''}
                    </FieldValue>
                </Field>
            </Fragment>
        );
    }
}

export default DeltaField;
