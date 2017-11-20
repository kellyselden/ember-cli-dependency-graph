define('code-corps-ember/controllers/project/settings/donations/goals', ['exports', 'code-corps-ember/utils/friendly-error', 'code-corps-ember/utils/error-utils'], function (exports, _friendlyError, _errorUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;


  var PROBLEM_SAVING_DONATION_GOAL = 'There was a problem saving your donation goal. Please try again.';

  exports.default = Controller.extend({
    store: service(),

    actions: {
      /**
       * Activates donations for a project by creating an associated stripe plan record
       *
       * @method addDonationGoal
       * @param  {DS.Model} project A project record to activate donations for.
       */
      activateDonations: function activateDonations(project) {
        var _this = this;

        get(this, 'store').createRecord('stripe-connect-plan', { project: project }).save().then(function () {
          return _this._reloadProject();
        });
      },


      /**
       * Action which calls to initialize a new donation goal record
       * for the current project.
       *
       * Triggered when user clicks a button to add a new donation goal
       *
       * @method addDonationGoal
       * @param  {DS.Model} project A project record to initialize a new donation goal for.
       */
      addDonationGoal: function addDonationGoal(project) {
        var donationGoal = get(project, 'donationGoals').createRecord();
        this.send('editDonationGoal', donationGoal);
      },


      /**
       * Action which switches a donation goal from edit to view mode
       * If the donation goal is a new, unsaved record, it will be destroyed.
       *
       * Triggered when user clicks the cancel button,
       * when editing or adding a donation goal.
       *
       * @method cancelDonationGoal
       * @param  {DS.Model} donationGoal A donation goal record
       */
      cancelDonationGoal: function cancelDonationGoal(donationGoal) {
        set(donationGoal, 'isEditing', false);

        if (get(donationGoal, 'isNew')) {
          donationGoal.destroyRecord();
        }
      },


      /**
       * Action which switches a donation goal from view to edit mode.
       *
       * Trigged when user clicks the donation goal or its edit link.
       *
       * @method editDonationGoal
       * @param  {DS.Model} donationGoal A donation goal record
       * @param  {Boolean} canEdit Whether you can edit
       */
      editDonationGoal: function editDonationGoal(donationGoal) {
        var canEdit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (canEdit) {
          set(donationGoal, 'isEditing', true);
        }
      },


      /**
       * Action which commits changes to a donation goal.
       *
       * Triggers when user clicks the save button while editing or
       * adding a new donation goal.
       *
       * @method saveDonationGoal
       * @param  {DS.Model} donationGoal An unmodified or new donation goal record
       * @param  {Object}   properties   A hash consisting of donation goal properties to update and save
       */
      saveDonationGoal: function saveDonationGoal(donationGoal, properties) {
        var _this2 = this;

        donationGoal.setProperties(properties);
        donationGoal.save().then(function (donationGoal) {
          return _this2._onDoneSaving(donationGoal);
        }).catch(function (response) {
          return _this2._onFailedSaving(response);
        });
      }
    },

    _onDoneSaving: function _onDoneSaving(donationGoal) {
      this._reloadProject();
      set(donationGoal, 'isEditing', false);
    },
    _onFailedSaving: function _onFailedSaving(response) {
      if (!(0, _errorUtils.isValidationError)(response)) {
        set(this, 'error', new _friendlyError.default(PROBLEM_SAVING_DONATION_GOAL));
      }
    },
    _reloadProject: function _reloadProject() {
      get(this, 'project').reload();
    }
  });
});