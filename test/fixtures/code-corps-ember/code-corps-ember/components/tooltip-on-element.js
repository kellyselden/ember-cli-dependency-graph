define('code-corps-ember/components/tooltip-on-element', ['exports', 'code-corps-ember/config/environment', 'ember-tooltips/components/tooltip-on-element'], function (exports, _environment, _tooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var _didUpdateTimeoutLength = _environment.default.environment === 'test' ? 0 : 1000;

  exports.default = _tooltipOnElement.default.extend({ _didUpdateTimeoutLength: _didUpdateTimeoutLength });
});