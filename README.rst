================
redux-saga-utils
================

.. image:: https://travis-ci.org/DmitryFillo/redux-saga-utils.svg?branch=master
  :target: https://travis-ci.org/DmitryFillo/redux-saga-utils

.. image:: https://coveralls.io/repos/github/DmitryFillo/redux-saga-utils/badge.svg?branch=master
  :target: https://coveralls.io/github/DmitryFillo/redux-saga-utils?branch=master

High level utils for `redux-saga <https://github.com/redux-saga/redux-saga>`_.  These utils are based on native `redux-saga <https://github.com/redux-saga/redux-saga>`_ effects.

.. contents::

API Reference
=============

takeLatestParametric
--------------------

.. code:: javascript

  takeLatestParametric(pattern, actionCompare, saga, ...args)
    
It works like `takeLatest <https://github.com/redux-saga/redux-saga/tree/v0.14.3/docs/api#takelatestpattern-saga-args>`_, but it checks action object before forking handler saga. Useful when you have actions with the same action type, but with different properties inside the action object to distinguish particular action scope. It's common approach in the redux world that helps to make redux apps reusable, e.g. `redux-form <http://redux-form.com/>`_ uses that.

Signature is a bit different from `takeLatest <https://github.com/redux-saga/redux-saga/tree/v0.14.3/docs/api#takelatestpattern-saga-args>`_: ``actionCompare`` parameter added. It's part of action object to compare with.

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

  const worker = function* worker(action) {
    // ...
  };

  const saga = function* saga() {
    yield takeLatestParametric(actionConst, { scope: 'scopeOne' }, worker),
  };

That's it.
