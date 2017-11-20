define('ember-changeset/utils/is-object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = isObject;
  var typeOf = _ember['default'].typeOf;

  function isObject(val) {
    return typeOf(val) === 'object' || typeOf(val) === 'instance';
  }
});