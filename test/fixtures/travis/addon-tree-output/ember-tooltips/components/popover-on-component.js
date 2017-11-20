define('ember-tooltips/components/popover-on-component', ['exports', 'ember-tooltips/components/popover-on-element'], function (exports, _popoverOnElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _popoverOnElement.default.extend({
    tetherComponentName: 'tether-popover-on-component',

    _shouldTargetGrandparentView: true
  });
});