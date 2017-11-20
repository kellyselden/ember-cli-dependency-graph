define('travis/components/running-jobs-item', ['exports', 'travis/mixins/polling'], function (exports, _polling) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend(_polling.default, {
    pollModels: 'job'
  });
});