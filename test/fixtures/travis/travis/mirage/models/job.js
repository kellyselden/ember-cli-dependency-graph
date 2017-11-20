define('travis/mirage/models/job', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    commit: (0, _emberCliMirage.belongsTo)(),
    build: (0, _emberCliMirage.belongsTo)(),
    repository: (0, _emberCliMirage.belongsTo)('repository'),
    stage: (0, _emberCliMirage.belongsTo)()
  });
});