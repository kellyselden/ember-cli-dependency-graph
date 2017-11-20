define('code-corps-ember/components/task-status-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var equal = Ember.computed.equal;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['task-status-button'],
    tagName: 'span',

    /**
      Computed property that checks if the task is open.
       @property isOpen
      @type Boolean
     */
    isOpen: equal('task.status', 'open'),

    actions: {

      /**
        Action that sets the tasks status to `closed` and saves the task.
         @method closeTask
       */
      closeTask: function closeTask() {
        var task = get(this, 'task');
        set(task, 'status', 'closed');
        return task.save();
      },


      /**
        Action that sets the tasks status to `open` and saves the task.
         @method reopenTask
       */
      reopenTask: function reopenTask() {
        var task = get(this, 'task');
        set(task, 'status', 'open');
        return task.save();
      }
    }
  });
});