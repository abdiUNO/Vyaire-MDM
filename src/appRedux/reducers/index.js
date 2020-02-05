import { combineReducers } from 'redux';
import workflowReducer from './Workflow';
import customerReducer from './Customer';

const reducers = combineReducers({
    customer: customerReducer,
    workflows: workflowReducer,
});

export default reducers;
