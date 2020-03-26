import {
    GET_TAX_JURISDICTION,
    SET_TAX_JURISDICTION,
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
    SAVE_APOLLO_PRICING,
    SAVE_APOLLO_GLOBALTRADE,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    RELEASE_CHECKLIST
} from '../../constants/ActionTypes';


export const releaseChecklist = data=> { 
    return {
        type: RELEASE_CHECKLIST,
        payload: data,
    };
}

export const getTaxJurisdictionData = data => {
    return {
        type: GET_TAX_JURISDICTION,
        payload: data,
    };
};

export const setTaxJurisdictionData = data => {
    return {
        type: SET_TAX_JURISDICTION,
        payload: data,
    };
};

export const saveApolloMyTaskCustomerMaster = data => {
    return {
        type: SAVE_APOLLO_CUSTOMER_MASTER,
        payload: data,
    };
};

export const saveApolloMyTaskContracts = data => {
    return {
        type: SAVE_APOLLO_CONTRACTS,
        payload: data,
    };
};
export const saveApolloMyTaskCredit = data => {
    return {
        type: SAVE_APOLLO_CREDIT,
        payload: data,
    };
};
export const saveApolloMyTaskPricing = data => {
    return {
        type: SAVE_APOLLO_PRICING,
        payload: data,
    };
};
export const saveApolloMyTaskGlobalTrade = data => {
    return {
        type: SAVE_APOLLO_GLOBALTRADE,
        payload: data,
    };
};
export const showMessage = message => {
    return {
        type: SHOW_MESSAGE,
        payload: message,
    };
};
export const hideMessage = () => {
    return {
        type: HIDE_MESSAGE,
    };
};
