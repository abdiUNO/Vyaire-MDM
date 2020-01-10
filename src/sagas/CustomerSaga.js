import { call, put } from 'redux-saga/effects';
import { path } from 'ramda';
import CustomerActions from '../redux/CustomerRedux';

export function* getCustomers(action) {
    const text = action.query;
    const res = yield call(
        fetch,
        `https://cors-anywhere.herokuapp.com/https://oaa4qq34j6.execute-api.us-east-2.amazonaws.com/dev/customer/${text}/search`
    );

    let json = yield call([res, 'json']);

    const data = {
        customers: [json],
    };

    yield put(CustomerActions.customerSuccess(data.customers));
}
