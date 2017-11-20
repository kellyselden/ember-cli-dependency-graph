define('code-corps-ember/models/user-role', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    role: (0, _relationships.belongsTo)('role', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});