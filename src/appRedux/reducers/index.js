import { combineReducers } from 'redux';
import workflowReducer from './Workflow';
import customerReducer from './Customer';
import myTasksReducer from './MyTasksReducer';
import myRequests from './myRequests';
import authReducer from './Auth';
import toastReducer from './Toast';
import updateFlowReducer from './UpdateFlowReducer';

const reducers = combineReducers({
    customer: customerReducer,
    workflows: workflowReducer,
    myTasks: myTasksReducer,
    myRequests,
    auth: authReducer,
    toasts: toastReducer,
    updateFlow: updateFlowReducer,
});

export default reducers;
