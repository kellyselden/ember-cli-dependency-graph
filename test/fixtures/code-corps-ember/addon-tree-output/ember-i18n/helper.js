define('ember-i18n/helper', ['exports', 'ember'], function (exports, _ember) {
  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  var get = _ember['default'].get;
  var inject = _ember['default'].inject;
  var Helper = _ember['default'].Helper;
  var EmberObject = _ember['default'].Object;
  var observer = _ember['default'].observer;

  function mergedContext(objectContext, hashContext) {
    return EmberObject.extend({
      unknownProperty: function unknownProperty(key) {
        var fromHash = get(hashContext, key);
        return fromHash === undefined ? get(objectContext, key) : fromHash;
      }
    }).create();
  }

  exports['default'] = Helper.extend({
    i18n: inject.service(),

    compute: function compute(_ref, interpolations) {
      var _ref2 = _toArray(_ref);

      var key = _ref2[0];
      var _ref2$1 = _ref2[1];
      var contextObject = _ref2$1 === undefined ? {} : _ref2$1;

      var rest = _ref2.slice(2);

      var mergedInterpolations = mergedContext(contextObject, interpolations);

      var i18n = get(this, 'i18n');
      return i18n.t(key, mergedInterpolations);
    },

    _recomputeOnLocaleChange: observer('i18n.locale', function () {
      this.recompute();
    })
  });
});