define("percy-web/lib/formatting", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    formatNumber: function formatNumber(value, options) {
      options = options || { precision: 0 };
      return window.accounting.formatNumber(value, options.precision);
    },
    formatCurrency: function formatCurrency(value, options) {
      options = options || { precision: 2 };
      return window.accounting.formatMoney(value, null, options.precision);
    }
  };
});