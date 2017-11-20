define('code-corps-ember/models/donation-goal', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    achieved: (0, _attr.default)(),
    /**
     * Donation amount, in cents
     *
     * @property amount
     * @type { Number }
     */
    amount: (0, _attr.default)('dollar-cents'),
    current: (0, _attr.default)(),
    description: (0, _attr.default)(),

    project: (0, _relationships.belongsTo)('project', { async: true })
  });
});