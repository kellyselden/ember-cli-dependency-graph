define('code-corps-ember/services/project-skills-list', ['exports', 'code-corps-ember/utils/records-list'], function (exports, _recordsList) {
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

    projectSkills: alias('project.projectSkills'),

    add: function add(skill) {
      var _getProperties = getProperties(this, 'store', 'project'),
          store = _getProperties.store,
          project = _getProperties.project;

      return store.createRecord('project-skill', { project: project, skill: skill }).save();
    },
    includes: function includes(skill) {
      var projectSkills = get(this, 'projectSkills');
      return _recordsList.default.includes(projectSkills, skill);
    },
    find: function find(skill) {
      var _getProperties2 = getProperties(this, 'projectSkills', 'project'),
          projectSkills = _getProperties2.projectSkills,
          project = _getProperties2.project;

      return _recordsList.default.find(projectSkills, skill, project);
    },
    remove: function remove(skill) {
      var projectSkill = this.find(skill);
      return projectSkill.destroyRecord();
    },
    setProject: function setProject(project) {
      set(this, 'project', project);
      return this._refresh();
    },
    toggle: function toggle(skill) {
      var projectSkills = get(this, 'projectSkills');
      if (_recordsList.default.includes(projectSkills, skill)) {
        return this.remove(skill);
      } else {
        return this.add(skill);
      }
    },
    _refresh: function _refresh() {
      return get(this, 'projectSkills').reload();
    }
  });
});