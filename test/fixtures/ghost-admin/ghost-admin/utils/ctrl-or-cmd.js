define('ghost-admin/utils/ctrl-or-cmd', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = navigator.userAgent.indexOf('Mac') !== -1 ? 'command' : 'ctrl';
});