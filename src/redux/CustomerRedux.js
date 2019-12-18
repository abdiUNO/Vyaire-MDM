// @flow

import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    customerRequest: null,
    customerSuccess: ['customers'],
    customerFailure: ['err'],
});

export const CustomerTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data: [],
    fetching: null,
    error: null,
});

/* ------------- Selectors ------------- */

export const CustomerSelectors = {
    getData: state => state.customers,
};

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = state => state.merge({ fetching: true, err: null });

// successful avatar lookup
export const success = (state, { customers }) => {
    return state.merge({ fetching: false, error: null, data: customers });
};

// failed to get the avatar
export const failure = state =>
    state.merge({ fetching: false, error: true, avatar: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.CUSTOMER_REQUEST]: request,
    [Types.CUSTOMER_SUCCESS]: success,
    [Types.CUSTOMER_FAILURE]: failure,
});
