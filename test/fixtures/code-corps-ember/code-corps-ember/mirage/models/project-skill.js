define('code-corps-ember/mirage/models/project-skill', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    project: (0, _emberCliMirage.belongsTo)(),
    skill: (0, _emberCliMirage.belongsTo)()
  });
});