define('code-corps-ember/models/project-category', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    category: (0, _relationships.belongsTo)('category', { async: true }),
    project: (0, _relationships.belongsTo)('project', { async: true })
  });
});