define('ember-modal-dialog/components/liquid-dialog', ['exports', 'ember-modal-dialog/components/basic-dialog', 'ember-modal-dialog/templates/components/liquid-dialog'], function (exports, _basicDialog, _liquidDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basicDialog.default.extend({
    layout: _liquidDialog.default,
    hasOverlay: true,
    containerClassNames: ['liquid-dialog'],
    variantWrapperClass: 'emd-animatable'
  });
});