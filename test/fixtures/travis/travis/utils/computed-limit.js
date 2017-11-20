define('travis/utils/computed-limit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var get = Ember.get;


  var limit = function limit(dependentKey, limitKey) {
    return computed(dependentKey, dependentKey + '.[]', function () {
      var limit = get(this, limitKey),
          array = this.get(dependentKey);

      return array ? array.toArray().slice(0, limit) : [];
    });
  };

  exports.default = limit;
});