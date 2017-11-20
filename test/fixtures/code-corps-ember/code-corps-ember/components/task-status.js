define('code-corps-ember/components/task-status', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['task-status-badge'],

    status: alias('task.status')
  });
});