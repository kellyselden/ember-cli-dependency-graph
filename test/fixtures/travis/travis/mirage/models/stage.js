define('travis/mirage/models/stage', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    jobs: (0, _emberCliMirage.hasMany)('job')
  });
});