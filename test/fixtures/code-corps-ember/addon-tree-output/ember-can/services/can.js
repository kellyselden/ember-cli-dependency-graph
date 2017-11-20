define('ember-can/services/can', ['exports', 'ember', 'ember-can/utils/normalize'], function (exports, _ember, _emberCanUtilsNormalize) {
  var getOwner = _ember['default'].getOwner;
  exports['default'] = _ember['default'].Service.extend({
    parse: function parse(name) {
      return (0, _emberCanUtilsNormalize.normalizeCombined)(name);
    },

    build: function build(abilityString, resource, properties) {
      var names = this.parse(abilityString);
      var ability = getOwner(this).lookup('ability:' + names.abilityName);

      _ember['default'].assert('No ability type found for ' + names.abilityName, ability);

      // see if we've been given properties instead of resource
      if (!properties && resource && !(resource instanceof _ember['default'].Object)) {
        properties = resource;
        resource = null;
      }

      if (resource) {
        ability.set("model", resource);
      }

      if (properties) {
        ability.setProperties(properties);
      }

      return ability;
    },

    can: function can(abilityString, resource, properties) {
      var names = this.parse(abilityString);
      var ability = this.build(abilityString, resource, properties);
      return ability.get(names.propertyName);
    },

    cannot: function cannot(abilityString, resource, properties) {
      return !this.can(abilityString, resource, properties);
    }
  });
});