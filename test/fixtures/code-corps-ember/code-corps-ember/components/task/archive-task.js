define('code-corps-ember/components/task/archive-task', ['exports', 'ember-can'], function (exports, _emberCan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['archive-task'],

    // auto-assigns 'task' property from component as ability 'model'
    ability: _emberCan.default.computed.ability('task'),
    canArchive: alias('ability.canArchive')
  });
});