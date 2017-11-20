define("ember-changeset/utils/object-without", ["exports"], function (exports) {
  exports["default"] = objectWithout;
  var keys = Object.keys;

  /**
   * Merges all sources together, excluding keys in excludedKeys.
   *
   * @param  {Array[String]}    excludedKeys
   * @param  {...Object}        sources
   *
   * @return {Object}
   */

  function objectWithout(excludedKeys) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return sources.reduce(function (acc, source) {
      keys(source).filter(function (key) {
        return excludedKeys.indexOf(key) === -1 || !source.hasOwnProperty(key);
      }).forEach(function (key) {
        return acc[key] = source[key];
      });
      return acc;
    }, {});
  }
});