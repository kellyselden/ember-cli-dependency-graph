define('code-corps-ember/routes/project/tasks/new', ['exports', 'ember-can', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _emberCan, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Route = Ember.Route;
  var RSVP = Ember.RSVP;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    currentUser: service(),

    ability: _emberCan.default.computed.ability('organization', 'membership'),

    /**
     * model - Route lifecycle hook
     *
     * @return {RSVP.hash}  promise hash containing the project,
     * the task type for the new task and the current user
     */
    model: function model() {
      var project = this.modelFor('project').reload();
      var user = get(this, 'currentUser.user');

      return RSVP.hash({ project: project, user: user });
    },


    /**
     * setupController - Route lifecycle hook
     *
     * Takes the project, task type and user and initializes a new, unsaved task instance.
     * Sets the controller property for `task
     *
     * @param  {Ember.Controller} controller The associated controller instance
     * @param  {DS.Model} project            The currently loaded project
     * @param  {DS.Model} user               The currently authenticated user
     */
    setupController: function setupController(controller, _ref) {
      var project = _ref.project,
          user = _ref.user;

      var store = get(this, 'store');
      var task = store.createRecord('task', { project: project, user: user });

      set(controller, 'task', task);
      set(controller, 'selectedRepo', null);
      set(controller, 'unsavedTaskSkills', []);
    },


    actions: {
      /**
       * willTransition - Action.
       *
       * Triggers on transitioning away from this route.
       * Prompts the user to confirm navigating away.
       *
       * If the user confirms, the currently initiated task is destroyed.
       * If the user cancels out, the transition is aborted.
       *
       * @param  {Ember.Transition} transition The initiated transition.
       */
      willTransition: function willTransition(transition) {
        var task = get(this, 'controller.task');

        // prompt to confirm if the user did not save
        if (get(task, 'isNew')) {
          var confirmed = window.confirm('You will lose any unsaved information if you leave this page. Are you sure?');
          if (confirmed) {
            task.destroyRecord();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});