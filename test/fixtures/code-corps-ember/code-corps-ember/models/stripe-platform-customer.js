define('code-corps-ember/models/stripe-platform-customer', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    email: (0, _attr.default)(),

    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});