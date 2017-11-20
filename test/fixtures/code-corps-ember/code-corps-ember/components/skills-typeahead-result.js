define('code-corps-ember/components/skills-typeahead-result', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNameBindings: ['hasSkill', 'selected:selected'],
    classNames: ['skill-dropdown-item'],
    tagName: ['li'],

    currentUser: service(),

    hasSkill: computed('skill', function () {
      var _getProperties = getProperties(this, 'skill', 'skillsList'),
          skill = _getProperties.skill,
          skillsList = _getProperties.skillsList;

      return skillsList.includes(skill);
    }),
    selected: alias('skill.selected'),

    mouseDown: function mouseDown() {
      var skill = get(this, 'skill');
      this.sendAction('selectSkill', skill);
    },
    mouseEnter: function mouseEnter() {
      var skill = get(this, 'skill');
      this.sendAction('hover', skill);
    }
  });
});