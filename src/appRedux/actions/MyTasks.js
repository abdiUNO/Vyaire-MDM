import {
    SAVE_APOLLO_CUSTOMER_MASTER,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
} from '../../constants/ActionTypes';


export const saveApolloMyTaskCustomerMaster = data => {
    return {
        type: SAVE_APOLLO_CUSTOMER_MASTER,
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
