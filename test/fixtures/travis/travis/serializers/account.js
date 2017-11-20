define('travis/serializers/account', ['exports', 'travis/serializers/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    primaryKey: 'login'
  });
});