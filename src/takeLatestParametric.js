import { fork, take, cancel } from 'redux-saga/effects';

const compareObject = (action, actionCompare) => !!Object.getOwnPropertyNames(actionCompare).map(i => actionCompare[i] === action[i]).reduce((p, n) => p * n);

/**
 * Helper to make easy do takeLatest for parametric actions.
 *
 * @param {String|Array|Function} pattern - Action constant.
 * @param {Object} actionCompare - Part of action to compare with.
 * @param {Function} saga - Handling generator.
 * @param {*[]} args - Additional args for handling generator.
 * @returns {Object} task - Task object (redux-saga).
 */
export default function* (pattern, actionCompare, saga, ...args) {
    const task = yield fork(function* () {
        let lastTask;
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
