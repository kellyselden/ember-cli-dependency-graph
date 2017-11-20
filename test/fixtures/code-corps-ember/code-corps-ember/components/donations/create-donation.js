define('code-corps-ember/components/donations/create-donation', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var isEmpty = Ember.isEmpty;
  var set = Ember.set;
  var observer = Ember.observer;
  var getProperties = Ember.getProperties;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['create-donation'],

    amount: 25,
    fallbackAmount: 25,
    customAmount: null,
    presetAmounts: [10, 15, 25, 50],

    init: function init() {
      this._super.apply(this, arguments);

      var _getProperties = getProperties(this, 'amount', 'presetAmounts'),
          amount = _getProperties.amount,
          presetAmounts = _getProperties.presetAmounts;

      if (!presetAmounts.includes(amount)) {
        set(this, 'customAmount', amount);
      }
    },


    selectedAmount: computed('amount', 'customAmount', function () {
      var _getProperties2 = getProperties(this, 'amount', 'customAmount'),
          amount = _getProperties2.amount,
          customAmount = _getProperties2.customAmount;

      return isEmpty(customAmount) ? amount : customAmount;
    }),

    amountChanged: observer('customAmount', function () {
      var _getProperties3 = getProperties(this, 'amount', 'customAmount', 'fallbackAmount', 'onAmountChanged', 'presetAmounts'),
          amount = _getProperties3.amount,
          customAmount = _getProperties3.customAmount,
          fallbackAmount = _getProperties3.fallbackAmount,
          onAmountChanged = _getProperties3.onAmountChanged,
          presetAmounts = _getProperties3.presetAmounts;

      if (isEmpty(customAmount)) {
        if (!presetAmounts.includes(amount)) {
          onAmountChanged(fallbackAmount);
        }
      } else {
        onAmountChanged(customAmount);
      }
    }),

    actions: {
      selectPresetAmount: function selectPresetAmount(presetAmount) {
        set(this, 'amount', presetAmount);
        set(this, 'customAmount', null);
      }
    }
  });
});