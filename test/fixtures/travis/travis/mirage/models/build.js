define('travis/mirage/models/build', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    repository: (0, _emberCliMirage.belongsTo)('repository'),
    commit: (0, _emberCliMirage.belongsTo)('commit', { inverseOf: 'build' }),
    branch: (0, _emberCliMirage.belongsTo)('branch', { inverseOf: 'builds' }),
    jobs: (0, _emberCliMirage.hasMany)('job'),
    stages: (0, _emberCliMirage.hasMany)('stage')
  });
});