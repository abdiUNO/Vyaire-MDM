import React, {Component} from 'react';
import {  FormSelect } from './form';

class DynamicSelect extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { inputProps } = this.props;
        let arrayOfData = this.props.arrayOfData;
        let options = arrayOfData != undefined && arrayOfData.map((data) =>
                <option key={data.id} value={data.id} disabled={inputProps ? inputProps.disabled :false }> {data.description}  </option>
            );
        
        return (
        <FormSelect 
        label={this.props.label} 
        name={this.props.name}
        value={this.props.value}
        error={this.props.formErrors ? this.props.formErrors : null } 
        required={this.props.isRequired}
        onChange={this.props.onFieldChange}
        variant="solid"
        {...inputProps}>
            <option  hidden={true} >Choose from...</option>
            {options}
        </FormSelect>
        )
    }
}

export default DynamicSelect;