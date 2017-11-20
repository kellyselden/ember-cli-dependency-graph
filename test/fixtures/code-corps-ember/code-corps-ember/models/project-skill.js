define('code-corps-ember/models/project-skill', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    project: (0, _relationships.belongsTo)('project', { async: true }),
    skill: (0, _relationships.belongsTo)('skill', { async: true })
  });
});