import {applyMiddleware, compose, createStore} from "redux";
import reducers from "../reducers/index";
import createHistory from "history/createBrowserHistory";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/index";

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const store = createStore(reducers, initialState,applyMiddleware(...middlewares));

  sagaMiddleware.run(rootSaga);

  return store;
}
export {history};
