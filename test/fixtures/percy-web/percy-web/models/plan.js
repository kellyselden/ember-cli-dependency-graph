define('percy-web/models/plan', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = _emberData.default.Model.extend({
    subscriptionData: service(),

    name: _emberData.default.attr(),
    interval: _emberData.default.attr(),
    intervalCount: _emberData.default.attr('number'),
    workerLimit: _emberData.default.attr('number'),
    usageIncluded: _emberData.default.attr('number'),
    historyLimitDays: _emberData.default.attr('number'),
    allowOverages: _emberData.default.attr('boolean'),
    overageUnitCost: _emberData.default.attr('number'),
    isTrial: _emberData.default.attr('boolean'),
    isFree: _emberData.default.attr('boolean'),

    isCustom: computed('id', function () {
      return this.get('subscriptionData.PLAN_IDS').indexOf(this.get('id')) === -1;
    })
  });
});