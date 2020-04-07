import React, { Component } from 'react';
import { FormInput,FormSelect } from './form';
import { fetchCustomerMasterDropDownData } from '../redux/DropDownDatas';

class DynamicSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
            dropDownDatas:{},
            fvalue:''
        }
    }
    componentDidMount(){
         fetchCustomerMasterDropDownData().then((res) => {
            const data = res;
             this.setState({ dropDownDatas: data },()=>{
                 if(this.props.readOnly){
                     this.getDropDownDescription(this.state.dropDownDatas)
                 }
             });
        });
    }

    getDropDownDescription = (dropDownDatas) =>{
        let fname=this.props.name.trim() ;
        let {fvalue}=this.state;
        if(dropDownDatas[fname] != undefined){
            var matched_desc=dropDownDatas[fname].filter(
                (dict)=> dict.id===parseInt(this.props.value)
            )
            fvalue=matched_desc.length>0 ? matched_desc[0].description : '';
            this.setState({'fvalue':fvalue} )
        }
        
    }
    render() {
        const { inputProps ,readOnly} = this.props;
        const {dropDownDatas}=this.state;
        let fname=this.props.name, flabel=this.props.label,fvalue=this.props.value || '';
        
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
            {!readOnly ? (<FormSelect
                label={this.props.label}
                name={this.props.name}
                value={this.props.value}
                error={this.props.formErrors ? this.props.formErrors : null}
                required={this.props.isRequired}
                onChange={this.props.onFieldChange}
                variant="solid"
                {...inputProps}>
                <option hidden={true}>Choose from...</option>
                {options}
            </FormSelect> ) : 
            <FormInput
                px="25px"
                flex={1 / 4}
                label={this.props.label}
                name={this.props.name}
                variant="outline"
                inline
                type="text"
                value={this.state.fvalue}
                readOnly
            />
            }
            </>
        );
    }
}

export default DynamicSelect;
