import React, { Component } from 'react';
import { FormInput, FormSelect } from './form';

class DynamicSelect extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { inputProps, readOnly } = this.props;

        let arrayOfData = this.props.arrayOfData;
        let options =
            arrayOfData != undefined &&
            arrayOfData.map((data) => (
                <option
                    team={this.props.team || data.id}
                    key={data.id}
                    value={data.id}
                    disabled={inputProps ? inputProps.disabled : false}>
                    {' '}
                    {data.description}{' '}
                </option>
            ));

        return (
            <>
                {!readOnly ? (
                    <FormSelect
                        label={this.props.label}
                        name={this.props.name}
                        value={this.props.value}
                        error={
                            this.props.formErrors ? this.props.formErrors : null
                        }
                        required={this.props.isRequired}
                        onChange={this.props.onFieldChange}
                        variant="solid"
                        {...inputProps}>
                        <option hidden={true}>Choose from...</option>
                        {options}
                    </FormSelect>
                ) : (
                    <FormInput
                        px="25px"
                        flex={1 / 4}
                        label={this.props.label}
                        name={this.props.name}
                        variant="outline"
                        inline
                        type="text"
                        value={this.props.value}
                        readOnly
                    />
                )}
            </>
        );
    }
}

export default DynamicSelect;
