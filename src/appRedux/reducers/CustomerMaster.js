import { GET_CUSTOMER_MASTER_DETAIL_SUCCESS } from '../../constants/ActionTypes';
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    customerdata: [],
    inp_vals: '',
    inp_props: '',
    fetching: false,
    error: null,
};

function updateObject(oldObject, payload) {
    // Encapsulate the idea of passing a new object as the first parameter
    // to Object.assign to ensure we correctly copy data instead of mutating
    var newValues = {};
    var cust_data = payload;
    let field_val = { CustomerGroup: '' };
    let field_prop = { CustomerGroup: null };
    if (cust_data.Category === 'Self-Distributor') {
        field_val['CustomerGroup'] = '05';
        field_prop['CustomerGroup'] = { disabled: true };
    } else if (
        cust_data.Category === 'OEM' ||
        cust_data.Category === 'Kitter'
    ) {
        field_val['CustomerGroup'] = '10';
        field_prop['CustomerGroup'] = { disabled: true };
    } else if (cust_data.Category === 'DropShip') {
        field_val['CustomerGroup'] = '14';
        field_prop['CustomerGroup'] = { disabled: true };
    } else {
        field_prop['CustomerGroup'] = null;
    }

    newValues['customerdata'] = cust_data;
    // newValues['inp_vals']=field_val
    newValues['inp_props'] = field_prop;
    return Object.assign({}, oldObject, newValues);
}

const customerMasterReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CUSTOMER_MASTER_DETAIL_SUCCESS: {
            return {
                ...state,
                fetching: false,
                customerdata: action.payload,
            };
        }
        default:
            return state;
    }
};

export default customerMasterReducer;
