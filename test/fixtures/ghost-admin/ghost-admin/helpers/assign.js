define('ghost-admin/helpers/assign', ['exports', 'ember-assign-helper/helpers/assign'], function (exports, _assign) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _assign.default;
    }
  });
  Object.defineProperty(exports, 'assign', {
    enumerable: true,
    get: function () {
      return _assign.assign;
    }
  });
});