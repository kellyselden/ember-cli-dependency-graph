define('code-corps-ember/mirage/models/project-category', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    category: (0, _emberCliMirage.belongsTo)(),
    project: (0, _emberCliMirage.belongsTo)()
  });
});