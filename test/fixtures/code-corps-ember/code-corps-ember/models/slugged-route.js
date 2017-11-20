define('code-corps-ember/models/slugged-route', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    slug: (0, _attr.default)('string'),

    organization: (0, _relationships.belongsTo)('organization', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});