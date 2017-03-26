import { buffers } from 'redux-saga';
import { actionChannel, take, cancelled, flush, put, call } from 'redux-saga/effects';

const massACFlush = function* massACFlush(acs) {
  yield acs.forEach(i => flush(i));
};

/**
 * Helper to make easy to wait for implicit transitive actions.
 *
 * @param {Array} actions - Actions that produces another actions in the future.
 * @param {Array} awaitActions - Produced actions to await.
 */
export default function* (actions, awaitActions) {
  const toAwait = yield awaitActions.map(i => actionChannel(i, buffers.expanding(10)));
  try {
    yield actions.map(i => put(i));
    yield toAwait.map(i => take(i));
    yield call(massACFlush, toAwait);
  } finally {
    if (yield cancelled()) {
      yield call(massACFlush, toAwait);
    }
  }
}
