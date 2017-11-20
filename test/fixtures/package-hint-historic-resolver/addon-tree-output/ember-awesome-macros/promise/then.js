define('ember-awesome-macros/promise/then', ['exports', 'ember-macro-helpers/lazy-curried-computed'], function (exports, _lazyCurriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var RSVP = Ember.RSVP;
  var resolve = RSVP.resolve;
  exports.default = (0, _lazyCurriedComputed.default)(function (getValue, promise, property) {
    promise = getValue(promise);
    if (promise === undefined) {
      return resolve();
    }
    return promise.then(function (x) {
      property = getValue(property);
      if (property !== undefined) {
        return get(x, property);
      }
    });
  });
});