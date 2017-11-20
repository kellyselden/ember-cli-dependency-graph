define('code-corps-ember/models/stripe-connect-plan', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _model, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    project: (0, _relationships.belongsTo)('project', { async: true })
  });
});