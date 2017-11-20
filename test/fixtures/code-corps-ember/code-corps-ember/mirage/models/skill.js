define('code-corps-ember/mirage/models/skill', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    userSkills: (0, _emberCliMirage.hasMany)('user-skill')
  });
});