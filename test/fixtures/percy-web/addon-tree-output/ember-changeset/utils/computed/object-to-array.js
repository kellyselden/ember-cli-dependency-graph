define('ember-changeset/utils/computed/object-to-array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = objectToArray;
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var typeOf = _ember['default'].typeOf;
  var keys = Object.keys;

  var assign = _ember['default'].assign || _ember['default'].merge;

  function objectToArray(objKey, flattenObjects) {
    return computed(objKey, function () {
      var obj = get(this, objKey);

      return keys(obj).map(function (key) {
        var value = obj[key];

        if (flattenObjects && typeOf(value) === 'object') {
          return assign({ key: key }, value);
        }

        return { key: key, value: value };
      });
    }).readOnly();
  }
});