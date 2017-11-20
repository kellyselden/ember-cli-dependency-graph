define('code-corps-ember/components/task-list-cards', ['exports', 'ember-dragula/components/ember-dragula-container'], function (exports, _emberDragulaContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  exports.default = _emberDragulaContainer.default.extend({
    attributeBindings: ['data-model-id', 'data-model-type'],
    classNames: ['task-list-cards'],

    orderedTasks: alias('taskList.orderedTasks'),

    'data-model-id': alias('taskList.id'),
    'data-model-type': 'task-list'
  });
});