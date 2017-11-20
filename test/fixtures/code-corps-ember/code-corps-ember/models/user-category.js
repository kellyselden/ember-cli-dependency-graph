define('code-corps-ember/models/user-category', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    category: (0, _relationships.belongsTo)('category', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});