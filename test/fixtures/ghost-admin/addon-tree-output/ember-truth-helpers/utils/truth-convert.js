define('ember-truth-helpers/utils/truth-convert', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = truthConvert;
  var isArray = Ember.isArray;
  var get = Ember.get;
  function truthConvert(result) {
    var truthy = result && get(result, 'isTruthy');
    if (typeof truthy === 'boolean') {
      return truthy;
    }

    if (isArray(result)) {
      return get(result, 'length') !== 0;
    } else {
      return !!result;
    }
  }
});