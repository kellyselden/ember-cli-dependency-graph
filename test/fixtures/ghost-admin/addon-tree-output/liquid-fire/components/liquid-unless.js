define('liquid-fire/components/liquid-unless', ['exports', 'liquid-fire/components/liquid-if'], function (exports, _liquidIf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _liquidIf.default.extend({
    helperName: 'liquid-unless',
    inverted: true
  });
});