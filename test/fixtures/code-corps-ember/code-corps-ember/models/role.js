define('code-corps-ember/models/role', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var equal = Ember.computed.equal;
  exports.default = _model.default.extend({
    ability: (0, _attr.default)(),
    kind: (0, _attr.default)(),
    name: (0, _attr.default)(),

    userRoles: (0, _relationships.hasMany)('user-role', { async: true }),

    isCreative: equal('kind', 'creative'),
    isSupport: equal('kind', 'support'),
    isTechnology: equal('kind', 'technology')
  });
});