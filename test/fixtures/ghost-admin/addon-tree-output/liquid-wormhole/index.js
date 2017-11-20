define('liquid-wormhole/index', ['exports', 'liquid-fire/constraint'], function (exports, _constraint) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.target = target;
  exports.onOpenWormhole = onOpenWormhole;
  exports.onCloseWormhole = onCloseWormhole;
  function target(name) {
    return new _constraint.default('parentElementClass', '' + name);
  }

  function onOpenWormhole() {
    return new _constraint.default('newValue', function (value) {
      return value !== null;
    });
  }

  function onCloseWormhole() {
    return new _constraint.default('newValue', function (value) {
      return value === null;
    });
  }
});