import { createTestStore, arrayOfDeffered } from './utils';

import takeLatestParametric from '../takeLatestParametric';

const actionConst = 'TEST_ACTION_RECEIVED';

const actionCreatorOne = payload => ({
    type: actionConst,
    name: 'testOne',
    payload: payload,
});

const actionCreatorTwo = payload => ({
    type: actionConst,
    name: 'testTwo',
    payload: payload,
});

const defs = arrayOfDeffered(4);

test('TODO: done this test', () => {
    const store = createTestStore(testSaga);

    const actual = [];

    function* testSaga() {
        yield [
            takeLatestParametric(actionConst, { name: 'testOne' }, worker),
            takeLatestParametric(actionConst, { name: 'testTwo' }, workerTwo),
        ];
    }

    function* worker(action) {
        const resp = yield defs[action.payload - 1].promise;
        actual.push({ action, resp });
    }

    function* workerTwo(action) {
        const resp = yield defs[action.payload - 1].promise;
        actual.push({ action, resp });
    }

    Promise.resolve(1)
        .then(() => store.dispatch(actionCreatorOne(1)))
        .then(() => store.dispatch(actionCreatorOne(2)))
        .then(() => defs[0].resolve('w-1'))
        .then(() => store.dispatch(actionCreatorOne(3)))
        .then(() => store.dispatch(actionCreatorTwo(3)))
        .then(() => store.dispatch(actionCreatorTwo(3)))
        .then(() => store.dispatch(actionCreatorTwo(3)))
        .then(() => store.dispatch(actionCreatorTwo(4)))
        .then(() => defs[1].resolve('w-2'))
        .then(() => defs[2].resolve('w-3'))
        .then(() => defs[3].resolve('w-4'))
        .then(() => console.log(actual));

    expect(1).toBe(1);
});
