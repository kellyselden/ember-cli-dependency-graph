define('code-corps-ember/components/skill-list-items', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var union = Ember.computed.union;
  var sort = Ember.computed.sort;
  var setDiff = Ember.computed.setDiff;
  var filter = Ember.computed.filter;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNameBindings: ['overflowHidden:overflow-hidden'],
    classNames: ['skills'],
    tagName: 'ul',
    sortByTitle: ['title:asc'],

    isClickable: false,

    currentUser: service(),
    userSkillsList: service(),

    alphaSkills: sort('skills', 'sortByTitle'),
    skillsNotInCommon: setDiff('skillsToFilter', 'skillsInCommon'),
    sortedSkills: union('skillsInCommon', 'skillsNotInCommon'),
    user: alias('currentUser.user'),
    userSkills: alias('user.userSkills'),

    skillsInCommon: filter('skillsToFilter', function (skill) {
      return get(this, 'userSkillsList').find(skill);
    }),

    skillsToFilter: computed('alphaSkills', function () {
      return get(this, 'alphaSkills');
    }),

    actions: {
      skillItemHidden: function skillItemHidden() {
        this.sendAction('skillItemHidden');
      }
    }
  });
});