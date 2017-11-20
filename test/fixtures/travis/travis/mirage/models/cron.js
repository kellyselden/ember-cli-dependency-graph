define('travis/mirage/models/cron', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    branch: (0, _emberCliMirage.belongsTo)('branch'),
    repository: (0, _emberCliMirage.belongsTo)('repository')
  });
});