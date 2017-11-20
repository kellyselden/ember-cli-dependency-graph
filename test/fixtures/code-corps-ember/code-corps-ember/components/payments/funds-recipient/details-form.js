define('code-corps-ember/components/payments/funds-recipient/details-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var equal = Ember.computed.equal;
  var isEmpty = Ember.isEmpty;
  var setProperties = Ember.setProperties;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['details-form'],
    tagName: 'section',

    isIndividual: equal('stripeConnectAccount.legalEntityType', 'individual'),

    init: function init() {
      this._super.apply(this, arguments);
      this._setDefaults();
    },


    actions: {
      submit: function submit() {
        var stripeConnectAccount = get(this, 'stripeConnectAccount');

        if (get(this, 'isIndividual')) {
          setProperties(stripeConnectAccount, {
            legalEntityBusinessName: null,
            legalEntityBusinessTaxId: null
          });
        }

        var onSubmit = get(this, 'onSubmit');
        onSubmit();
      }
    },

    _setDefaults: function _setDefaults() {
      var stripeConnectAccount = get(this, 'stripeConnectAccount');

      if (isEmpty(get(stripeConnectAccount, 'legalEntityType'))) {
        set(stripeConnectAccount, 'legalEntityType', 'individual');
      }

      if (isEmpty(get(stripeConnectAccount, 'legalEntityAddressState'))) {
        set(stripeConnectAccount, 'legalEntityAddressState', 'CA');
      }

      if (isEmpty(get(stripeConnectAccount, 'legalEntityAddressCountry'))) {
        set(stripeConnectAccount, 'legalEntityAddressCountry', 'US');
      }

      var legalEntityDobDay = get(stripeConnectAccount, 'legalEntityDobDay') || 1;
      var legalEntityDobMonth = get(stripeConnectAccount, 'legalEntityDobMonth') || 1;
      var legalEntityDobYear = get(stripeConnectAccount, 'legalEntityDobYear') || new Date().getUTCFullYear();

      setProperties(stripeConnectAccount, { legalEntityDobDay: legalEntityDobDay, legalEntityDobMonth: legalEntityDobMonth, legalEntityDobYear: legalEntityDobYear });
    }
  });
});