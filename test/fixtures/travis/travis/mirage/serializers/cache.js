define('travis/mirage/serializers/cache', ['exports', 'travis/mirage/serializers/v2'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    keyForModel: function keyForModel() {
      return 'cache';
    },
    keyForCollection: function keyForCollection() {
      return 'caches';
    }
  });
});