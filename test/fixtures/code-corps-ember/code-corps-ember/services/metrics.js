define('code-corps-ember/services/metrics', ['exports', 'ember-metrics/services/metrics'], function (exports, _metrics) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _metrics.default;
    }
  });
});