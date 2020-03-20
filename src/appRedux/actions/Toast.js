import { ADD_TOAST, REMOVE_TOAST } from '../../constants/ActionTypes';

export const showMessage = message => {
    console.log('CALLED');
    return {
        type: ADD_TOAST,
        payload: message,
    };
};
export const removeMessage = id => {
    return {
        type: REMOVE_TOAST,
        payload: id,
    };
};
