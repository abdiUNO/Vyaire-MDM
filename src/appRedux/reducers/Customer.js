import {
	SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    SHOW_MESSAGE,
    HIDE_MESSAGE
} from "../../constants/ActionTypes";
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    customerdata: [],
    fetching: false,
    error: null,
};

const customerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) { 
      case SEARCH_CUSTOMER:{
        return{
          ...state,
          fetching:true,
        }
      }    
      case SEARCH_CUSTOMER_SUCCESS:{
        return {
          ...state,
          fetching: false,
          customerdata: action.payload
        }
      }
      
    case SHOW_MESSAGE: {
        return {
          ...state,
          alertMessage: action.payload,
          showMessage: true,
        }
      }
      case HIDE_MESSAGE: {
        return {
          ...state,
          alertMessage: '',
          showMessage: false,
        }
      }
      default:
      return state;
  }
}



export default customerReducer;
