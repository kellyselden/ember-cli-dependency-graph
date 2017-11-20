define('travis/mirage/models/settings', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    settings: (0, _emberCliMirage.hasMany)()
  });
});