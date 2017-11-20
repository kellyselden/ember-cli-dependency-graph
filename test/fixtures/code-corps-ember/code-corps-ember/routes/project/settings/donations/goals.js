define('code-corps-ember/routes/project/settings/donations/goals', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    /**
     * An Ember.Route hook
     *
     * Returns a promise, meaning hooks that follow the model hook will wait until
     * it resolves
     *
     * @return {RSVP.Promise} A promise for reloading the project route model
     */
    model: function model() {
      return this.modelFor('project').reload();
    },


    /**
     * An Ember.Route hook
     *
     * Assingns the project property as model
     *
     * If the project has no donation goals, initializes a new record.
     *
     * @method setupController
     * @param  {Ember.Controller} controller
     * @param  {DS.Model} project The currently loaded project
     */
    setupController: function setupController(controller, project) {
      if (project.get('donationGoals.length') == 0) {
        controller.send('addDonationGoal', project);
      }

      controller.setProperties({ project: project });
    }
  });
});