define('ember-changeset/utils/includes', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = includes;
  var emberArray = _ember['default'].A;
  var assert = _ember['default'].assert;
  var typeOf = _ember['default'].typeOf;

  function includes(arr) {
    assert('must be array', typeOf(arr) === 'array');
    var wrapped = emberArray(arr);
    var inclusionFn = wrapped.includes || wrapped.contains;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return inclusionFn.apply(arr, args);
  }
});