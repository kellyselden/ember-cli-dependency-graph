define('ghost-admin/services/liquid-wormhole', ['exports', 'liquid-wormhole/services/liquid-wormhole'], function (exports, _liquidWormhole) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _liquidWormhole.default;
    }
  });
});