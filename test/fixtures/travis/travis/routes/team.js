define('travis/routes/team', ['exports', 'travis/routes/basic', 'travis/config/environment'], function (exports, _basic, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    redirect: function redirect() {
      window.location.replace(_environment.default.urls.about);
    }
  });
});