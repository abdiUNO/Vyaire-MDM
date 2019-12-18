import { call, put } from 'redux-saga/effects';
import { path } from 'ramda';
import CustomerActions from '../redux/CustomerRedux';

const data = {
    customers: [
        {
            MdmNumber: 324,
            ContactFirstName: 'FirstName',
            ContactLastName: 'LastName',
            ContactFunction: 'Contact',
            ContactTelephone: '4444444444',
            ContactFax: '8883334444',
            ContactEmailAddress: 'test@test.com',
            Name: 'Test Customer',
            Name2: '',
            Name3: '',
            Name4: '',
            Street: '123 test',
            Street2: 'ste 123',
            City: 'Houston',
            Region: 'TX',
            PostalCode: '55555',
            Country: 'USA',
            SalesOrg: {
                Id: 10,
                Name: 'Test Sales Org',
            },
            ErpSystem: {
                Id: 1,
                Name: 'JDEdwards',
                DisplayName: 'JD Edwards',
            },
        },
    ],
};

export function* getCustomers(action) {
    yield put(CustomerActions.customerSuccess(data.customers));
}
