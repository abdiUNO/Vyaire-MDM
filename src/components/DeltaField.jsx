import React, { Component, Fragment } from 'react';
import { FormInput, FieldValue, Field, FieldLabel } from './form';
import { fetchCustomerMasterDropDownData } from '../redux/DropDownDatas';

class DeltaField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropDownDatas: {},
        };
    }
    componentDidMount() {
        fetchCustomerMasterDropDownData().then((res) => {
            const data = res;
            this.setState({ dropDownDatas: data });
        });
    }
    render() {
        const { delta, label } = this.props;
        const { dropDownDatas } = this.state;
        let fname = delta['Name'] + '-updated',
            flabel = delta['Name'],
            fvalue = delta.UpdatedValue || '';
        if (delta && delta['Name'].toLowerCase().includes('typeid')) {
            if (dropDownDatas[delta['Name']] != undefined) {
                var matched_desc = dropDownDatas[delta['Name']].filter(
                    (dict) => dict.id === parseInt(delta.UpdatedValue)
                );
                flabel = delta['Name'].replace('TypeId', '');
                fvalue =
                    matched_desc.length > 0 ? matched_desc[0].description : '';
            }
        }
        return (
            <Fragment>
                <Field inline name={fname}>
                    <FieldLabel label={`+ ${flabel}`} inline color="#239d56" />
                    <FieldValue name={`${delta.Name}-updated`}>
                        {fvalue}
                    </FieldValue>
                </Field>
            </Fragment>
        );
    }
}

export default DeltaField;
