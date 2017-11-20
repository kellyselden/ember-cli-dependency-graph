define('liquid-fire/transitions/flex-grow', ['exports', 'liquid-fire'], function (exports, _liquidFire) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = flexGrow;
  function flexGrow(opts) {
    (0, _liquidFire.stop)(this.oldElement);
    return _liquidFire.Promise.all([(0, _liquidFire.animate)(this.oldElement, { 'flex-grow': 0 }, opts), (0, _liquidFire.animate)(this.newElement, { 'flex-grow': [1, 0] }, opts)]);
  }
});