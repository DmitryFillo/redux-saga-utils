import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

export default (saga) => {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        () => {},
        applyMiddleware(sagaMiddleware),
    );

    sagaMiddleware.run(saga);

    return store;
};
