define('ember-link-action/initializers/allow-link-action', ['exports', 'ember-link-action/mixins/link-action'], function (exports, _linkAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var LinkComponent = Ember.LinkComponent;
  function initialize() {
    LinkComponent.reopen(_linkAction.default);
  }

  exports.default = {
    name: 'allow-link-action',
    initialize: initialize
  };
});