import { applyMiddleware, compose, createStore } from 'redux';
import reducers from '../reducers/index';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as createHistory from 'history';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';

const history = createHistory.createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
    const store = createStore(
        reducers,
        initialState,
        applyMiddleware(...middlewares)
    );

    sagaMiddleware.run(rootSaga);

    return store;
}
export { history };
