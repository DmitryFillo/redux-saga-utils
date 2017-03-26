import { fork, take, cancel } from 'redux-saga/effects';

const compareObject = (action, actionCompare) => (
  !!Object.getOwnPropertyNames(actionCompare).map(i => (
    actionCompare[i] === action[i]
  )).reduce((p, n) => p * n)
);

/**
 * Helper to make easy do takeLatest for parametric actions.
 *
 * @param {String|Array|Function} pattern - Action constant.
 * @param {Object} actionCompare - Part of action to compare with (action matcher).
 * @param {Function} saga - Handler saga.
 * @param {*[]} args - Additional args that will be passed to the handler saga.
 * @returns {Object} task - [Task descriptor]{@link https://redux-saga.github.io/redux-saga/docs/api/index.html#task-descriptor}.
 */
export default function* (pattern, actionCompare, saga, ...args) {
  const task = yield fork(function* takeLatestParametric() {
    let lastTask;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const action = yield take(pattern);
      if (compareObject(action, actionCompare)) {
        if (lastTask) {
          yield cancel(lastTask);
        }
        lastTask = yield fork(saga, ...args.concat(action));
      }
    }
  });
  return task;
}
