define("ember-composable-helpers/utils/comparison", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.lte = lte;
  exports.lt = lt;
  exports.gte = gte;
  exports.gt = gt;
  function lte(a, b) {
    return a <= b;
  }

  function lt(a, b) {
    return a < b;
  }

  function gte(a, b) {
    return a >= b;
  }

  function gt(a, b) {
    return a > b;
  }
});