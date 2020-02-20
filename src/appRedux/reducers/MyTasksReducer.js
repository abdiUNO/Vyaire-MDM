import {
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    SAVE_APOLLO_CUSTOMER_MASTER,
    SAVE_APOLLO_CONTRACTS
} from '../../constants/ActionTypes';

const INITIAL_STATE = {
    fetching: false,
    alert:{'display':false,'message':'','color':'#FFF'},
};

const myTasksReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE_APOLLO_CUSTOMER_MASTER:{
            return {
                ...state,
                fetching: true,
            };
        }
        case SAVE_APOLLO_CONTRACTS:{
            return {
                ...state,
                fetching: true,
            };
        }

        case SHOW_MESSAGE: {
            return {
                ...state,
                fetching:false,
                alert:{'display':true,'message':action.payload.msg,'color':action.payload.color},
                
            };
        }
        case HIDE_MESSAGE: {
            return {
                ...state,
                alert:{'display':false,'message':'','color':'#FFF'},
            };
        }
        default:
            return state;
    }
};

export default myTasksReducer;
