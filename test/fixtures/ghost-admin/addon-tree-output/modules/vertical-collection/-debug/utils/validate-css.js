define('vertical-collection/-debug/utils/validate-css', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasCSSRule = hasCSSRule;
  function hasCSSRule(rules, prop, value) {
    var styleStr = prop + ':\\s*' + value;
    var expr = new RegExp(styleStr, ['i']);

    for (var i = 0; i < rules.length; i++) {
      if (expr.test(rules[i].cssText)) {
        return true;
      }
    }

    return false;
  }
});