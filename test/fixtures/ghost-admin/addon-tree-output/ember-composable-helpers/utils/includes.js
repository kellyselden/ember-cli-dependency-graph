define("ember-composable-helpers/utils/includes", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = includes;
  function includes(haystack) {
    var finder = haystack.includes || haystack.contains;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return finder.apply(haystack, args);
  }
});