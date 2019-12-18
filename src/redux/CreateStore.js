import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

export default (rootReducer, rootSaga) => {
    const middleware = [];
    const enhancers = [];

    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancer =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    middleware.push(rootSaga);

    if (window.location.hostname === `localhost`) {
        middleware.push(logger);
    }

    enhancers.push(applyMiddleware(...middleware));

    const store = createStore(
        rootReducer,
        applyMiddleware(sagaMiddleware, logger)
    );

    let sagasManager = sagaMiddleware.run(rootSaga);

    return {
        store,
        sagasManager,
        sagaMiddleware,
    };
};
