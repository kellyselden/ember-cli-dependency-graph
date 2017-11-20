define('percy-web/mirage/factories/plan', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    id: 'free',
    name: 'Free plan',
    interval: 'month',
    intervalCount: 1,
    workerLimit: 2,
    usageIncluded: 500,
    historyLimitDays: 7,
    isTrial: false,
    isFree: true,

    trial: (0, _emberCliMirage.trait)({
      id: 'trial',
      name: 'Test plan (trial)',
      workerLimit: 8,
      usageIncluded: 12000,
      historyLimitDays: 90,
      allowOverages: true,
      overageUnitCost: 0.01,
      isTrial: true,
      isFree: false
    })
  });
});