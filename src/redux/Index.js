import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import rootSaga from '../sagas/';

export default () => {
    const reducers = combineReducers({
        customers: require('./CustomerRedux').reducer,
    });

    let { store } = configureStore(reducers, rootSaga);

    return store;
};
