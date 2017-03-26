================
redux-saga-utils
================

.. image:: https://travis-ci.org/DmitryFillo/redux-saga-utils.svg?branch=master
  :target: https://travis-ci.org/DmitryFillo/redux-saga-utils

.. image:: https://coveralls.io/repos/github/DmitryFillo/redux-saga-utils/badge.svg?branch=master
  :target: https://coveralls.io/github/DmitryFillo/redux-saga-utils?branch=master

High level utils for `redux-saga <https://github.com/redux-saga/redux-saga>`_.  These utils are based on the native `redux-saga <https://github.com/redux-saga/redux-saga>`_ effects.

.. contents::

Installation
============

Via `Yarn <https://yarnpkg.com/en/>`_ (recommended):

.. code::

  yarn add redux-saga-utils

Via NPM:

.. code::

  npm install redux-saga-utils --save

API Reference
=============

takeLatestParametric
--------------------

.. code:: javascript

  takeLatestParametric(pattern, actionCompare, saga, ...args)
    
It works like `takeLatest <https://github.com/redux-saga/redux-saga/tree/v0.14.3/docs/api#takelatestpattern-saga-args>`_, but it checks action object before forking handler saga. Useful when you have actions with the same action type, but with different properties inside the action object to distinguish particular action scope. It's common approach in the redux world that helps to make redux apps reusable, e.g. `redux-form <http://redux-form.com/>`_ uses that.

Signature is a bit different from `takeLatest <https://github.com/redux-saga/redux-saga/tree/v0.14.3/docs/api#takelatestpattern-saga-args>`_: ``actionCompare`` parameter is added. It's part of action object to compare with.

Imagine these action creators in the redux app:

.. code:: javascript

  const actionConst = 'EXAMPLE_ACTION';

  const actionScopeOne = payload => ({
    type: actionConst,
    scope: 'scopeOne',
    payload,
  });

  const actionScopeTwo = payload => ({
    type: actionConst,
    scope: 'scopeTwo',
    payload,
  });
  
Then you can catch only actions with particular scope properties in the sagas:

.. code:: javascript

  import { takeLatestParametric } from 'redux-saga-utils';

  const worker = function* worker(action) {
    // ...
  };

  const saga = function* saga() {
    yield takeLatestParametric(actionConst, { scope: 'scopeOne' }, worker),
  };

awaitTransitiveActions
----------------------

.. code:: javascript

  awaitTransitiveActions(actions, awaitActions)

``actions`` — array of actions. ``awaitActions`` — array of action constants.

Useful when you want to wait for actions which will be produced by another actions. Such a case can occur in sagas that are waiting for page initialization, etc.

Imagine that you've these action creators:

.. code:: javascript

  const actionA = () => ({
    type: 'ACTION_A',
  });

  const actionB = () => ({
    type: 'ACTION_B',
  });

  const actionC = () => ({
    type: 'ACTION_C',
  });

  const actionD = () => ({
    type: 'ACTION_D',
  });

  const actionE = () => ({
    type: 'ACTION_E',
  });

And a couple of sagas:

.. code:: javascript

  const sagaABC = function* sagaABC() {
    yield take('ACTION_A');
    // Do some I/O here.
    yield put(actionB());
    yield put(actionC());
  };

  const sagaDE = function* sagaDE() {
    yield take('ACTION_D');
    yield put(actionE());
  };

Your ``ACTION_A`` will trigger ``ACTION_B`` and ``ACTION_C`` after I/O, as well as ``ACTION_D`` will trigger ``ACTION_E``, *but before you can say knife*.

You can easily wait for all that stuff:

.. code:: javascript

  import { awaitTransitiveActions } from 'redux-saga-utils';

  const saga = function* saga() {
    yield awaitTransitiveActions([
      actionA(),
      actionD(),
    ], [
      'ACTION_E',
      'ACTION_C',
      'ACTION_B',
    ]);
    // ...
  };
