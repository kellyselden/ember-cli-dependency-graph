define('ember-composable-helpers/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle', 'ember-composable-helpers/-private/closure-action'], function (exports, _toggle, _closureAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;


  var closureToggle = _toggle.toggle;
  if (_closureAction.default) {
    closureToggle[_closureAction.default] = true;
  }

  exports.default = helper(closureToggle);
});