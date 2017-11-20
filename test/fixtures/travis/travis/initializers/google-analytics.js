define('travis/initializers/google-analytics', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var ga = void 0,
        s = void 0;
    if (_environment.default.gaCode) {
      window._gaq = [];
      _gaq.push(['_setAccount', _environment.default.gaCode]);
      ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      s = document.getElementsByTagName('script')[0];
      return s.parentNode.insertBefore(ga, s);
    }
  } /* global _gaq */
  exports.default = {
    name: 'google-analytics',
    initialize: initialize
  };
});