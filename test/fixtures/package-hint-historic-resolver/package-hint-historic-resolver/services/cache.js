define('package-hint-historic-resolver/services/cache', ['exports', 'npm:memory-cache'], function (exports, _npmMemoryCache) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    get: function get() {
      return _npmMemoryCache.default.get.apply(_npmMemoryCache.default, arguments);
    },
    put: function put() {
      return _npmMemoryCache.default.put.apply(_npmMemoryCache.default, arguments);
    }
  });
});