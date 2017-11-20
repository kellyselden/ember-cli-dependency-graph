define('code-corps-ember/helpers/gte', ['exports', 'ember-truth-helpers/helpers/gte'], function (exports, _gte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gte.gteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gte.gteHelper);
  }

  exports.default = forExport;
});