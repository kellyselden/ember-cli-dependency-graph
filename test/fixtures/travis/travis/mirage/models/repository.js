define('travis/mirage/models/repository', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    branches: (0, _emberCliMirage.hasMany)(),
    builds: (0, _emberCliMirage.hasMany)('build'),
    envVars: (0, _emberCliMirage.hasMany)(),
    settings: (0, _emberCliMirage.hasMany)(),
    caches: (0, _emberCliMirage.hasMany)(),
    defaultBranch: (0, _emberCliMirage.belongsTo)('branch'),
    currentBuild: (0, _emberCliMirage.belongsTo)('build'),
    account: (0, _emberCliMirage.belongsTo)()
  });
});