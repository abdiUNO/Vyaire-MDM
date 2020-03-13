import { combineReducers } from 'redux';
import workflowReducer from './Workflow';
import customerReducer from './Customer';
import myTasksReducer from './MyTasksReducer';
import myRequests from './myRequests';
import authReducer from './Auth';

const reducers = combineReducers({
    customer: customerReducer,
    workflows: workflowReducer,
    myTasks: myTasksReducer,
    myRequests,
    auth: authReducer,
});

export default reducers;
