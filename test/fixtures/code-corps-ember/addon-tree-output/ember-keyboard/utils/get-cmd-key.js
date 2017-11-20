define('ember-keyboard/utils/get-cmd-key', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (platform) {
    if (typeof FastBoot === 'undefined') {
      if (platform === undefined) {
        platform = navigator.platform;
      }
      if (platform.indexOf('Mac') > -1) {
        return 'meta';
      } else {
        return 'ctrl';
      }
    }
  };
});