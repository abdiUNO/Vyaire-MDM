import { takeLatest, takeLeading, all, call } from 'redux-saga/effects';

import { CustomerTypes } from '../redux/CustomerRedux';

import { getCustomers } from './CustomerSaga';

export default function* root() {
    yield all([takeLatest(CustomerTypes.CUSTOMER_REQUEST, getCustomers)]);
}
