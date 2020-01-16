import {combineReducers} from "redux";
import customerReducer from "./Customer";

const reducers = combineReducers({
  customer: customerReducer
});

export default reducers;
