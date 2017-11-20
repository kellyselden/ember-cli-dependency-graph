define("code-corps-ember/utils/array-utils", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.range = range;
  function range(start, end) {
    var range = [];
    for (var i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
});