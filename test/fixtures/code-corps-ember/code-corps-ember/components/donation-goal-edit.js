define('code-corps-ember/components/donation-goal-edit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var setProperties = Ember.setProperties;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['donation-goal-edit'],

    /**
     * Indicates if "cancel" button should render.
     *
     * Cancel button should only render if one of two cases
     * - the record is already persisted and we are simply editing it
     * - the record is new, but there are other persisted records, so cancelling this one
     *   does not mean there will be no persisted records at all
     *
     * @property canCancel
     * @type {Boolean}
     */
    canCancel: false,

    init: function init() {
      this._super.apply(this, arguments);
      var donationGoal = get(this, 'donationGoal');

      var _getProperties = getProperties(donationGoal, 'amount', 'description'),
          amount = _getProperties.amount,
          description = _getProperties.description;

      setProperties(this, { amount: amount, description: description });
    }
  });
});