define('code-corps-ember/models/task-skill', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    task: (0, _relationships.belongsTo)('task', { async: true }),
    skill: (0, _relationships.belongsTo)('skill', { async: true })
  });
});