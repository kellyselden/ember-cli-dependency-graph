define('code-corps-ember/models/task-user-mention', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    indices: (0, _attr.default)('array'),
    username: (0, _attr.default)('string'),

    task: (0, _relationships.belongsTo)('task', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});