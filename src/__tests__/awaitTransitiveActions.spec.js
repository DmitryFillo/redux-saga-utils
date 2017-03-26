import { call, take, put } from 'redux-saga/effects';

import { createTestStore, deferred } from './utils';

import { awaitTransitiveActions } from '../index';

const actionTestA = () => ({
  type: 'ACTION_TEST_A',
});

const actionTestB = () => ({
  type: 'ACTION_TEST_B',
});

const actionTestC = () => ({
  type: 'ACTION_TEST_C',
});

const actionTestD = () => ({
  type: 'ACTION_TEST_D',
});

const actionTestE = () => ({
  type: 'ACTION_TEST_E',
});

const def = deferred();

// eslint-disable-next-line no-undef
it('awaitTransitiveActions can wait for transitive actions', () => {
  let done = false;

  const sagaABC = function* sagaABC() {
    yield take('ACTION_TEST_A');
    yield put(actionTestB());
    yield put(actionTestC());
  };

  const sagaDE = function* sagaDE() {
    yield take('ACTION_TEST_D');
    yield def.promise;
    yield put(actionTestE());
  };

  const testSaga = function* testSaga() {
    yield awaitTransitiveActions([
      actionTestA(),
      actionTestD(),
    ], [
      'ACTION_TEST_E',
      'ACTION_TEST_C',
      'ACTION_TEST_B',
    ]);
    done = true;
  };

  const rootSaga = function* rootSaga() {
    yield [
      call(sagaABC),
      call(sagaDE),
      call(testSaga),
    ];
  };

  const store = createTestStore(rootSaga);

  return Promise.resolve(1)
    // eslint-disable-next-line no-undef
    .then(() => expect(done).toBeFalsy())
    .then(() => store.dispatch(actionTestA()))
    .then(() => store.dispatch(actionTestD()))
    // eslint-disable-next-line no-undef
    .then(() => expect(done).toBeFalsy())
    .then(() => def.resolve())
    // eslint-disable-next-line no-undef
    .then(() => expect(done).toBeTruthy());
});
