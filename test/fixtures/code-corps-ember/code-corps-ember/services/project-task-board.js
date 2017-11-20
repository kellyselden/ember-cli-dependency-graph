define('code-corps-ember/services/project-task-board', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  var $ = Ember.$;
  exports.default = Service.extend({
    isViewing: false,

    className: computed('isViewing', function () {
      var isViewing = get(this, 'isViewing');
      if (isViewing) {
        return 'for-project-tasks';
      }
    }),

    activate: function activate() {
      set(this, 'isViewing', true);
      $('body').addClass('task-board-body');
    },
    deactivate: function deactivate() {
      set(this, 'isViewing', false);
      $('body').removeClass('task-board-body');
    }
  });
});