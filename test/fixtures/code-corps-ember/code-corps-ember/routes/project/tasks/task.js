define('code-corps-ember/routes/project/tasks/task', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Route = Ember.Route;
  var setProperties = Ember.setProperties;
  var get = Ember.get;
  exports.default = Route.extend({
    currentUser: service(),
    store: service(),
    taskSkillsList: service(),

    model: function model(params) {
      var projectId = this.modelFor('project').id;
      var number = params.number;

      var store = get(this, 'store');

      return store.queryRecord('task', { projectId: projectId, number: number });
    },
    afterModel: function afterModel(task) {
      get(this, 'taskSkillsList').setTask(task);
      return task;
    },
    setupController: function setupController(controller, task) {
      var store = get(this, 'store');
      var user = get(this, 'currentUser.user');
      var newComment = store.createRecord('comment', { task: task, user: user });

      return setProperties(controller, { newComment: newComment, task: task });
    }
  });
});