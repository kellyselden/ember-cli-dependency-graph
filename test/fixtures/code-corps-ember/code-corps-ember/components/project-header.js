define('code-corps-ember/components/project-header', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var mapBy = Ember.computed.mapBy;
  var alias = Ember.computed.alias;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['project__header'],
    classNameBindings: ['expanded'],
    expanded: false,
    tagName: 'header',

    /**
     * @property store
     * @type Ember.Service
     */
    store: service(),

    /**
      @property session
      @type Ember.Service
     */
    session: service(),

    /**
      @property currentUser
      @type Ember.Service
     */
    currentUser: service(),

    /**
     * @property user
     * @type DS.Model
     */
    user: alias('currentUser.user'),

    // TODO: Similar code is defined in
    // - `abilities/project.js`
    // - `abilities/task.js`
    currentProjectMembership: computed('project.projectUsers', 'currentUser.user.id', function () {
      var projectUsers = get(this, 'project.projectUsers');
      var currentUserId = get(this, 'currentUser.user.id');

      return projectUsers.find(function (item) {
        return get(item, 'user.id') === currentUserId;
      });
    }),

    projectSkills: mapBy('project.projectSkills', 'skill'),

    actions: {
      // TODO: This should go outside the component, but with the way the
      // project, project.index, project.settings and project.tasks templates are
      // set up, it's difficult to move this into a route/controller action
      joinProject: function joinProject(project) {
        var _getProperties = getProperties(this, 'store', 'user'),
            store = _getProperties.store,
            user = _getProperties.user;

        return store.createRecord('project-user', { user: user, project: project, role: 'pending' }).save();
      }
    }
  });
});