define('percy-web/components/forms/billing-edit', ['exports', 'percy-web/components/forms/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  exports.default = _base.default.extend({
    subscription: null,
    classes: null,

    classNames: ['FormsBillingEdit', 'Form'],
    classNameBindings: ['classes'],

    model: alias('subscription'),
    validator: null
  });
});