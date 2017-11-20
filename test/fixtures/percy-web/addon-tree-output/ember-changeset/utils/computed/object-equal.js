define('ember-changeset/utils/computed/object-equal', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = objectEqual;
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var keys = Object.keys;

  /**
   * Shallow object comparison computed property. Checks all key/value pairs on
   * the first object and compares against the second object. Essentially, this
   * means that the second object must have the same key/values as the first, but
   * not vice versa.
   *
   * @public
   * @param  {String} sourceKey dependent key for first object
   * @param  {String} compareKey dependent key for second object
   * @return {Boolean}
   */

  function objectEqual(sourceKey, compareKey) {
    return computed(sourceKey, compareKey, function () {
      var source = get(this, sourceKey);
      var compare = get(this, compareKey);

      return keys(source).reduce(function (acc, key) {
        return acc && get(source, key) === get(compare, key);
      }, true);
    }).readOnly();
  }
});