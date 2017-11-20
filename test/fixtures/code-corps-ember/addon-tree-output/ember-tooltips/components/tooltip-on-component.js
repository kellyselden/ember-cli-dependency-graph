define('ember-tooltips/components/tooltip-on-component', ['exports', 'ember-tooltips/components/tooltip-on-element'], function (exports, _tooltipOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _tooltipOnElement.default.extend({
    tetherComponentName: 'tether-tooltip-on-component',

    _shouldTargetGrandparentView: true
  });
});