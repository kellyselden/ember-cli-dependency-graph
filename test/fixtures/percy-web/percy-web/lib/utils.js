define('percy-web/lib/utils', ['exports', 'percy-web/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var $ = Ember.$;
  exports.default = {
    redirectToLogin: function redirectToLogin(options) {
      options = options || {};
      var params = {
        redirect_to: options.redirectTo || window.location.href
      };
      if (options.extendedPermissions) {
        params['extended_permissions'] = options.extendedPermissions;
      }
      var urlName = options.extendedPermissions ? 'loginExtended' : 'login';
      window.location = this.buildApiUrl(urlName, { params: params });
    },
    buildApiUrl: function buildApiUrl() {
      var key = arguments[0];
      var otherArgs = Array.prototype.slice.call(arguments, 1);

      // Options, if given, must be the last arg and must be a hash.
      var options = otherArgs.slice(-1)[0];
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        otherArgs = otherArgs.slice(0, -1);
      } else {
        options = {};
      }
      var params = options.params;
      var queryParams = params ? '?' + $.param(params) : '';

      var path = _environment.default.APP.apiUrls[key];
      if (!path) {
        Ember.Logger.error('API path not found for key: ' + key);
        return;
      }

      // If the path requires formatting, make sure the right number of args have been given.
      var numFormatsRequired = (path.match(/%@/g) || []).length;
      if (numFormatsRequired !== otherArgs.length) {
        Ember.Logger.error('Mismatched number of formatting args for: ' + path + '\nGot: ' + otherArgs);
        return;
      } else {
        otherArgs.forEach(function (arg) {
          path = path.replace('%@', arg);
        });
      }
      return window.location.origin + path + queryParams;
    },
    getQueryParam: function getQueryParam(param) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === param) {
          return pair[1];
        }
      }
      return false;
    }
  };
});