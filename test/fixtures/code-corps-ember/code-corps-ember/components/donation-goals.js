define('code-corps-ember/components/donation-goals', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var sort = Ember.computed.sort;
  var setDiff = Ember.computed.setDiff;
  var notEmpty = Ember.computed.notEmpty;
  var not = Ember.computed.not;
  var filterBy = Ember.computed.filterBy;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['donation-goals'],
    sorting: ['amount:desc'],

    donationGoals: alias('project.donationGoals'),
    sortedDonationGoals: sort('donationGoals', 'sorting'),

    /**
     * Indicates if the user can add a new donation goal.
     *
     * This is possible if no other donation goal
     * is currently being added or edited.
     *
     * @property canAdd
     * @type {Boolean}
     */
    canAdd: not('_currentlyEditingDonationGoals'),

    /**
     * Indicates if the user can cancel adding or editing a donation goal.
     *
     * This is possible if there is already a saved donation goal present.
     *
     * @property canCancel
     * @type {Boolean}
     */
    canCancel: alias('hasExistingDonationGoals'),

    /**
     * Indicates if the user can start editing a donation goal.
     *
     * This is possible if no other donation goal
     * is currently being added or edited.
     *
     * @property canEdit
     * @type {Boolean}
     */
    canEdit: not('_currentlyEditingDonationGoals'),

    /**
     * Indicates if there are existing donations goals for this project.
     *
     * @property hasExistingDonationGoals
     * @type {Boolean}
     */
    hasExistingDonationGoals: notEmpty('_existingDonationGoals'),

    _currentlyEditingDonationGoals: notEmpty('_editedDonationGoals'),
    _editedDonationGoals: filterBy('project.donationGoals', 'isEditing'),
    _existingDonationGoals: setDiff('project.donationGoals', '_newDonationGoals'),
    _newDonationGoals: filterBy('project.donationGoals', 'isNew')
  });
});