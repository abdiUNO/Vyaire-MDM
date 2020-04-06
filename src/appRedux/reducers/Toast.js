import { ADD_TOAST, REMOVE_TOAST } from '../../constants/ActionTypes';

export default (state = [], action) => {
    const { payload, type } = action;

    switch (type) {
        case ADD_TOAST:
            return [{ ...payload, id: payload.msg }];

        case REMOVE_TOAST:
            return state.filter((toast) => toast.id !== payload);

        default:
            return state;
    }
};
