import { combineReducers } from 'redux';
import workflowReducer from './Workflow';
import customerReducer from './Customer';
import authReducer from './Auth';
const reducers = combineReducers({
    customer: customerReducer,
    workflows: workflowReducer,
    auth: authReducer,
});

export default reducers;
