define('percy-web/services/subscription-data', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    PLAN_IDS: ['free', 'v2-small', 'v2-medium', 'v2-large', 'v2-enterprise'],
    PLANS: [{
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      numDiffs: 500,
      numTeamMembersTitle: '1 team member',
      numWorkersTitle: '2 concurrent renderers',
      numUsersTitle: 'Unlimited users',
      historyLimitTitle: '7 day history'
    }, {
      id: 'v2-small',
      name: 'Starter',
      monthlyPrice: 149,
      numDiffs: 10000,
      extraDiffPrice: 0.01,
      numTeamMembersTitle: '5 team members',
      numWorkersTitle: '8 concurrent renderers',
      historyLimitTitle: '30 day history'
    }, {
      id: 'v2-medium',
      name: 'Growth',
      monthlyPrice: 399,
      numDiffs: 50000,
      extraDiffPrice: 0.008,
      numTeamMembersTitle: '14 team members',
      numWorkersTitle: '16 concurrent renderers',
      historyLimitTitle: '90 day history'
    }, {
      id: 'v2-large',
      name: 'Business',
      monthlyPrice: 849,
      numDiffs: 200000,
      extraDiffPrice: 0.006,
      numTeamMembersTitle: '30 team members',
      numWorkersTitle: '40 concurrent renderers',
      historyLimitTitle: '1 year history'
    }]
  });
});