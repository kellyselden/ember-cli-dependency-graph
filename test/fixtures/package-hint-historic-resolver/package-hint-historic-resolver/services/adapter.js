define('package-hint-historic-resolver/services/adapter', ['exports', 'ember-data-application-adapter-service/services/adapter'], function (exports, _adapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
});