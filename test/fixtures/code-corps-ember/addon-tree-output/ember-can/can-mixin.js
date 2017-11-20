define('ember-can/can-mixin', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Mixin.create({
    canService: _ember['default'].inject.service('can'),

    can: function can(abilityName, resource, additionalProperties) {
      return this.get('canService').can(abilityName, resource, additionalProperties);
    },

    cannot: function cannot(abilityName, resource, additionalProperties) {
      return !this.can(abilityName, resource, additionalProperties);
    }
  });
});