define('ember-can/computed', ['exports', 'ember'], function (exports, _ember) {
  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var getOwner = _ember['default'].getOwner;
  exports['default'] = {
    ability: function ability(type, resourceName) {
      if (arguments.length === 1) {
        resourceName = type;
      }

      return _ember['default'].computed(resourceName, function () {
        var ability = getOwner(this).lookup('ability:' + type);

        _ember['default'].assert('No ability class found for ' + type, ability);

        var resource = get(this, resourceName);
        set(ability, 'model', resource);
        return ability;
      });
    }
  };
});