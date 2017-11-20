define('percy-web/mirage/models/snapshot', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    build: (0, _emberCliMirage.belongsTo)('build'),
    screenshots: (0, _emberCliMirage.hasMany)('screenshot')
  });
});