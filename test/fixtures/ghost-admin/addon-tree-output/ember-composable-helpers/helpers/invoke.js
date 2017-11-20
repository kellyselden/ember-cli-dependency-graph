define('ember-composable-helpers/helpers/invoke', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invoke = invoke;

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var isEmberArray = Ember.isArray;
  var helper = Ember.Helper.helper;
  var tryInvoke = Ember.tryInvoke;
  var RSVP = Ember.RSVP;
  var all = RSVP.all;
  function invoke(_ref) {
    var _ref2 = _toArray(_ref),
        methodName = _ref2[0],
        args = _ref2.slice(1);

    var obj = args.pop();

    if (isEmberArray(obj)) {
      return function () {
        var promises = obj.map(function (item) {
          return tryInvoke(item, methodName, args);
        });

        return all(promises);
      };
    }

    return function () {
      return tryInvoke(obj, methodName, args);
    };
  }

  exports.default = helper(invoke);
});