import createStore from './createStore';

import takeLatestParametric from '../takeLatestParametric';

import { take } from 'redux-saga/effects';

const actionConst = 'TEST_ACTION_RECEIVED';

const actionCreatorOne = () => ({
    type: actionConst,
    name: 'testOne',
    payload: 'testOne',
});

const actionCreatorTwo = () => ({
    type: actionConst,
    name: 'testTwo',
    payload: 'testTwo',
});

test('TODO: done this test', () => {
    const store = createStore(testSaga);

    const actual = [];

    function* testSaga() {
        yield takeLatestParametric(actionConst, { name: 'testOne' }, worker);
    }

    function* worker(action) {
        actual.push(action);
    }

    store.dispatch(actionCreatorOne());
    store.dispatch(actionCreatorOne());
    store.dispatch(actionCreatorOne());
    console.log(actual);

    expect(1).toBe(1);
});
