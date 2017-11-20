define('code-corps-ember/models/user-skill', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    skill: (0, _relationships.belongsTo)('skill', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});