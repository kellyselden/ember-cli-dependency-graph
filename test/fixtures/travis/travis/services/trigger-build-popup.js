define('travis/services/trigger-build-popup', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    auth: service(),
    isShowingTriggerBuildModal: false,

    toggleTriggerBuildModal: function toggleTriggerBuildModal() {
      this.toggleProperty('isShowingTriggerBuildModal');
    }
  });
});