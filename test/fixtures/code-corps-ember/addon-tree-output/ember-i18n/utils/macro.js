define('ember-i18n/utils/macro', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = createTranslatedComputedProperty;

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  var keys = Object.keys;
  var get = _ember['default'].get;

  // @public

  function createTranslatedComputedProperty(key) {
    var interpolations = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var dependencies = ['i18n.locale'].concat(values(interpolations));

    return _ember['default'].computed.apply(_ember['default'], _toConsumableArray(dependencies).concat([function () {
      var i18n = get(this, 'i18n');
      _ember['default'].assert('Cannot translate ' + key + '. ' + this + ' does not have an i18n.', i18n);
      return i18n.t(key, mapPropertiesByHash(this, interpolations));
    }]));
  }

  function values(object) {
    return keys(object).map(function (key) {
      return object[key];
    });
  }

  function mapPropertiesByHash(object, hash) {
    var result = {};

    keys(hash).forEach(function (key) {
      result[key] = get(object, hash[key]);
    });

    return result;
  }
});