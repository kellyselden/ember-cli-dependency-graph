define('percy-web/initializers/csrf-protection', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var $ = Ember.$;
  function initialize() {
    $.ajaxPrefilter(function (options, originalOptions, xhr) {
      if (!options.crossDomain && !Ember.testing) {
        var cookieValue = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
        if (cookieValue && cookieValue.length > 1) {
          var token = decodeURIComponent(cookieValue[1]);
          if (token) {
            xhr.setRequestHeader('X-CSRF-Token', token);
          }
        }
      }
    });
  }

  exports.default = {
    name: 'csrf-protection',
    initialize: initialize
  };
});