define('ember-validators/utils/is-promise', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = isPromise;
  var canInvoke = _ember['default'].canInvoke;

  function isPromise(p) {
    return !!(p && canInvoke(p, 'then'));
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */