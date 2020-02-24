import {
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS,
    SAVE_APOLLO_CREDIT,
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
