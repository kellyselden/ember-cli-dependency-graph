define('code-corps-ember/models/stripe-connect-subscription', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    quantity: (0, _attr.default)('dollar-cents'),

    project: (0, _relationships.belongsTo)('project', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});