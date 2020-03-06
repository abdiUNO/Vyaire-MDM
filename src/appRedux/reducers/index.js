import { combineReducers } from 'redux';
import workflowReducer from './Workflow';
import customerReducer from './Customer';
import myTasksReducer from './MyTasksReducer';
import authReducer from './Auth';

const reducers = combineReducers({
    customer: customerReducer,
    workflows: workflowReducer,
    myTasks: myTasksReducer,    
    auth: authReducer,
});

export default reducers;
