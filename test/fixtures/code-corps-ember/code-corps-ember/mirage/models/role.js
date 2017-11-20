define('code-corps-ember/mirage/models/role', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    userRoles: (0, _emberCliMirage.hasMany)('user-role')
  });
});