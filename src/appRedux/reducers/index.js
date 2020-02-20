import { combineReducers } from 'redux';
import workflowReducer from './Workflow';
import customerReducer from './Customer';
import myTasksReducer from './MyTasksReducer';

const reducers = combineReducers({
    customer: customerReducer,
    workflows: workflowReducer,
    myTasks: myTasksReducer
});

export default reducers;
