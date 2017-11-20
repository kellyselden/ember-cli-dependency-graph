define('travis/mirage/models/branch', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    lastBuild: (0, _emberCliMirage.belongsTo)('build'),
    builds: (0, _emberCliMirage.hasMany)('build', { inverseOf: 'branch' }),
    repository: (0, _emberCliMirage.belongsTo)('repository', { inverseOf: 'defaultBranch' })
  });
});