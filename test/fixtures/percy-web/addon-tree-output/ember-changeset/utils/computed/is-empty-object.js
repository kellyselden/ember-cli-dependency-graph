define('ember-changeset/utils/computed/is-empty-object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = isEmptyObject;
  var assert = _ember['default'].assert;
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var isPresent = _ember['default'].isPresent;
  var keys = Object.keys;

  function isEmptyObject(dependentKey) {
    assert('`dependentKey` must be defined', isPresent(dependentKey));

    return computed(dependentKey, function () {
      return keys(get(this, dependentKey)).length === 0;
    }).readOnly();
  }
});