import { createTestStore, arrayOfDeffered } from './utils';

import { takeLatestParametric } from '../index';

const actionConst = 'TEST_ACTION';
const actionScopeOne = 'testOne';
const actionScopeTwo = 'testTwo';

const actionTestOne = index => ({
  type: actionConst,
  scope: actionScopeOne,
  index,
});

const actionTestTwo = index => ({
  type: actionConst,
  scope: actionScopeTwo,
  index,
});

const defs = arrayOfDeffered(4);

// eslint-disable-next-line no-undef
it('takeLatestParametric should takes latest actions for given action matcher', () => {
  const actual = [];

  const worker = function* worker(action) {
    const resp = yield defs[action.index].promise;
    actual.push({ action, resp });
  };

  const testSaga = function* testSaga() {
    yield [
      takeLatestParametric(actionConst, { scope: actionScopeOne }, worker),
      takeLatestParametric(actionConst, { scope: actionScopeTwo }, worker),
    ];
  };

  const store = createTestStore(testSaga);

  return Promise.resolve(1)
    .then(() => store.dispatch(actionTestOne(0)))
    .then(() => store.dispatch(actionTestOne(1)))
    .then(() => defs[0].resolve(0))
    .then(() => store.dispatch(actionTestOne(2)))
    .then(() => store.dispatch(actionTestTwo(2)))
    .then(() => store.dispatch(actionTestTwo(2)))
    .then(() => store.dispatch(actionTestTwo(2)))
    .then(() => store.dispatch(actionTestTwo(3)))
    .then(() => defs[1].resolve(1))
    .then(() => defs[2].resolve(2))
    .then(() => defs[3].resolve(3))
    // eslint-disable-next-line no-undef
    .then(() => expect(actual).toEqual([
      {
        action: actionTestOne(2),
        resp: 2,
      },
      {
        action: actionTestTwo(3),
        resp: 3,
      },
    ]));
});
