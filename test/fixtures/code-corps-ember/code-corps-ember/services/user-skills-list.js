define('code-corps-ember/services/user-skills-list', ['exports', 'code-corps-ember/utils/records-list'], function (exports, _recordsList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var empty = Ember.computed.empty;
  var alias = Ember.computed.alias;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),
    store: service(),

    isEmpty: empty('userSkills'),
    user: alias('currentUser.user'),
    userSkills: alias('user.userSkills'),

    add: function add(skill) {
      var _getProperties = getProperties(this, 'store', 'user'),
          store = _getProperties.store,
          user = _getProperties.user;

      return store.createRecord('user-skill', { user: user, skill: skill }).save();
    },
    includes: function includes(skill) {
      var userSkills = get(this, 'userSkills');
      return _recordsList.default.includes(userSkills, skill);
    },
    find: function find(skill) {
      var _getProperties2 = getProperties(this, 'userSkills', 'user'),
          userSkills = _getProperties2.userSkills,
          user = _getProperties2.user;

      return _recordsList.default.find(userSkills, skill, user);
    },
    remove: function remove(skill) {
      var userSkill = this.find(skill);
      return userSkill.destroyRecord();
    },
    toggle: function toggle(skill) {
      var userSkills = get(this, 'userSkills');
      if (_recordsList.default.includes(userSkills, skill)) {
        return this.remove(skill);
      } else {
        return this.add(skill);
      }
    }
  });
});