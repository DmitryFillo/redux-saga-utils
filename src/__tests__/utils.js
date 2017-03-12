import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

export function deferred(props = {}) {
    let def = {...props}
    const promise = new Promise((resolve, reject) => {
        def.resolve = resolve
        def.reject = reject
    })
    def.promise = promise
    return def
}

export function arrayOfDeffered(length) {
    const arr = []
    for (let i = 0; i < length; i++) {
        arr.push(deferred())
    }
    return arr
}


export const createTestStore = (saga) => {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        () => {},
        applyMiddleware(sagaMiddleware),
    );

    sagaMiddleware.run(saga);

    return store;
};
