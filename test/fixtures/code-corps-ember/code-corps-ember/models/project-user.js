define('code-corps-ember/models/project-user', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    role: (0, _attr.default)(),
    project: (0, _relationships.belongsTo)('project', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});