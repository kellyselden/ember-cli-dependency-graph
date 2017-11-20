define('code-corps-ember/services/task-skills-list', ['exports', 'code-corps-ember/utils/records-list'], function (exports, _recordsList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  exports.default = Service.extend({
    store: service(),

    taskSkills: alias('task.taskSkills'),

    add: function add(skill) {
      var _getProperties = getProperties(this, 'store', 'task'),
          store = _getProperties.store,
          task = _getProperties.task;

      return store.createRecord('task-skill', { task: task, skill: skill }).save();
    },
    includes: function includes(skill) {
      var taskSkills = get(this, 'taskSkills');
      return _recordsList.default.includes(taskSkills, skill);
    },
    find: function find(skill) {
      var _getProperties2 = getProperties(this, 'taskSkills', 'task'),
          taskSkills = _getProperties2.taskSkills,
          task = _getProperties2.task;

      return _recordsList.default.find(taskSkills, skill, task);
    },
    remove: function remove(skill) {
      var taskSkill = this.find(skill);
      return taskSkill.destroyRecord();
    },
    setTask: function setTask(task) {
      set(this, 'task', task);
      return this._refresh();
    },
    toggle: function toggle(skill) {
      var taskSkills = get(this, 'taskSkills');
      if (_recordsList.default.includes(taskSkills, skill)) {
        return this.remove(skill);
      } else {
        return this.add(skill);
      }
    },
    _refresh: function _refresh() {
      return get(this, 'taskSkills').reload();
    }
  });
});