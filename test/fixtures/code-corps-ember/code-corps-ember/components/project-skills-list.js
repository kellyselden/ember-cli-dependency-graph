define('code-corps-ember/components/project-skills-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var mapBy = Ember.computed.mapBy;
  var Component = Ember.Component;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['project-skills-list'],

    /**
     * Component will render the assigned header if property is set to true
     * @property showHeader
     */
    showHeader: false,

    /**
     * Header the component will render if `showHeader` is set to true
     *
     * @property header
     */
    header: '',

    /**
     * The project to render the skills for
     *
     * @property project
     */
    project: null,

    /**
     * Skills not to render on the list
     *
     * @property excludedSkills
     */
    excludedSkills: [],

    /**
     * Computed property
     * Skill records tied to the project via the projectSkills relationship
     * @property projectSkills
     */
    projectSkills: mapBy('project.projectSkills', 'skill'),

    /**
     * Computed property
     * Skills which will be rendered in the list.
     * The project's skills, minus any skills set not to be rendered via
     * the `excludedSkills` property
     *
     * @property skills
     */
    skills: computed('projectSkills.@each', 'excludedSkills.@each', function () {
      // NOTE: In a perfect case, we would use `Ember.computed.setDiff`
      // However, project.projectSkills.@each.skill is fetched
      // asynchronously, so each item in `projectSkills` is a
      // `DS.PromiseObject` instead of a `DS.Model`, so we have to
      // compare by id instead.
      var _getProperties = getProperties(this, 'projectSkills', 'excludedSkills'),
          projectSkills = _getProperties.projectSkills,
          excludedSkills = _getProperties.excludedSkills;

      return projectSkills.filter(function (skill) {
        return !excludedSkills || !excludedSkills.isAny('id', get(skill, 'id'));
      });
    })
  });
});