define('percy-web/models/subscription', ['exports', 'ember-data', 'moment'], function (exports, _emberData, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var or = Ember.computed.or;
  var not = Ember.computed.not;
  var computed = Ember.computed;
  exports.default = _emberData.default.Model.extend({
    organization: _emberData.default.belongsTo('organization', { async: false }),
    plan: _emberData.default.belongsTo('plan', { async: false }),
    billingEmail: _emberData.default.attr(),
    currentUsageStats: _emberData.default.belongsTo('usage-stat', { async: false }),
    status: _emberData.default.attr(),
    currentPeriodStart: _emberData.default.attr('date'),
    currentPeriodEnd: _emberData.default.attr('date'),
    currentPeriodEndDisplayed: computed('currentPeriodEnd', function () {
      return (0, _moment.default)(this.get('currentPeriodEnd')).subtract(1, 'day').toDate();
    }),
    trialStart: _emberData.default.attr('date'),
    trialEnd: _emberData.default.attr('date'),
    isTrialOrFree: or('plan.isTrial', 'plan.isFree'),
    isCustomer: not('isTrialOrFree'),

    // This is only here so that ember-data will send the token on create, it will never be populated
    // in API responses.
    token: _emberData.default.attr(),

    subscriptionData: service(),
    trialDaysRemaining: computed('trialEnd', function () {
      return Math.round((0, _moment.default)(this.get('trialEnd')).diff((0, _moment.default)(), 'days', true));
    })
  });
});