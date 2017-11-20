define('code-corps-ember/components/donations/donation-progress', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['donation-progress'],

    /**
     * The amount donated towards this donation goal
     * @property {Number} amountDonated
     */
    amountDonated: 0,

    /**
     * The total amount needed to donate towards the current donation goal.
     * Aliased from the donation goal assigned in the template.
     *
     * @property {Number} amountNeeded
     */
    amountNeeded: alias('donationGoal.amount'),

    /**
     * The description this donation goal
     * @property {String} description
     */
    description: alias('donationGoal.description'),

    /**
     * A computed field. Uses fields `amountDonated` and `amountNeeded` to
     * compute a percentage.
     *
     * @return {String} The computed percentage, rounded to two decimals.
     */
    percentage: computed('amountDonated', 'amountNeeded', function () {
      var _getProperties = this.getProperties('amountDonated', 'amountNeeded'),
          amountDonated = _getProperties.amountDonated,
          amountNeeded = _getProperties.amountNeeded;

      var percentage = amountDonated / amountNeeded * 100;
      return percentage.toFixed(2);
    })
  });
});