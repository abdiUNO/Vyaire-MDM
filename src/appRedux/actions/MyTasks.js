import {
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
    SAVE_APOLLO_PRICING,
    SAVE_APOLLO_GLOBALTRADE,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
} from '../../constants/ActionTypes';


export const saveApolloMyTaskCustomerMaster = data => {
    return {
        type: SAVE_APOLLO_CUSTOMER_MASTER,
        payload: data
    }
}

export const saveApolloMyTaskContracts = data => {
    return {
        type: SAVE_APOLLO_CONTRACTS,
        payload: data
    }
}
export const saveApolloMyTaskCredit = data => {
    return {
        type: SAVE_APOLLO_CREDIT,
        payload: data
    }
}
export const saveApolloMyTaskPricing = data => {
    return {
        type: SAVE_APOLLO_PRICING,
        payload: data
    }
}
export const saveApolloMyTaskGlobalTrade = data => {
    return {
        type: SAVE_APOLLO_GLOBALTRADE,
        payload: data
    }
}
export const showMessage = (message) => {
    return {
      type: SHOW_MESSAGE,
      payload: message
    }
}
export const hideMessage = () => {
    return {
      type: HIDE_MESSAGE,
    }
}
