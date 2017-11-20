define('code-corps-ember/mirage/models/task-list', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    project: (0, _emberCliMirage.belongsTo)(),
    tasks: (0, _emberCliMirage.hasMany)()
  });
});