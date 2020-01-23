import {
	SEARCH_CUSTOMER,
    SEARCH_CUSTOMER_SUCCESS,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    GET_CUSTOMER_DETAIL,
    GET_CUSTOMER_DETAIL_SUCCESS
} from "../../constants/ActionTypes";
import Immutable from 'seamless-immutable';

const INITIAL_STATE = {
    customerdata: [],
    singleCustomerDetail:[],
    fetching: false,
    error: null,
};

const customerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) { 
      case GET_CUSTOMER_DETAIL:{
        return{
          ...state,
          fetching:true,
        }
      }
      case GET_CUSTOMER_DETAIL_SUCCESS:{
        return{
          ...state,
          fetching:false,
          singleCustomerDetail:action.payload
        }
      }
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
