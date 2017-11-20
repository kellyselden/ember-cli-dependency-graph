define('ember-composable-helpers/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe', 'ember-composable-helpers/-private/closure-action'], function (exports, _pipe, _closureAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;


  var closurePipe = _pipe.pipe;
  if (_closureAction.default) {
    closurePipe[_closureAction.default] = true;
  }

  exports.default = helper(closurePipe);
});