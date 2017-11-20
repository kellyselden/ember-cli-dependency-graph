define('code-corps-ember/components/loading-bar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNameBindings: ['isLoading'],
    classNames: ['loading-bar'],

    loadingBar: service(),

    isLoading: alias('loadingBar.isLoading')
  });
});