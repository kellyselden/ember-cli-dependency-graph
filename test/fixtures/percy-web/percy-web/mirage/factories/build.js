define('percy-web/mirage/factories/build', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    branch: 'master',
    state: 'finished',
    totalComparisonsDiff: 8,
    totalComparisonsFinished: 12,
    createdAt: function createdAt() {
      return (0, _moment.default)();
    },
    buildNumber: function buildNumber(i) {
      return i + 1;
    }
  });
});