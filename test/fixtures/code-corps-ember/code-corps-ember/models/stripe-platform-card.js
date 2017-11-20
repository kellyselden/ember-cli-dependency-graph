define('code-corps-ember/models/stripe-platform-card', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    brand: (0, _attr.default)(),
    country: (0, _attr.default)(),
    expMonth: (0, _attr.default)(),
    expYear: (0, _attr.default)(),
    last4: (0, _attr.default)(),
    name: (0, _attr.default)(),

    stripeToken: (0, _attr.default)(),

    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});