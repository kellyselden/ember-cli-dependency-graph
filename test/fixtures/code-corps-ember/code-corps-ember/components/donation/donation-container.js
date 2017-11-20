define('code-corps-ember/components/donation/donation-container', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var or = Ember.computed.or;
  var empty = Ember.computed.empty;
  var and = Ember.computed.and;
  exports.default = Component.extend({
    classNames: ['donation-container'],

    cardOptions: {
      hidePostalCode: true,

      // Other styles are in `app/styles/addons/ember-stripe-elements`
      style: {
        base: {
          color: '#333',
          fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '14px',
          '::placeholder': {
            color: '#666'
          },
          lineHeight: '24px'
        },
        invalid: {
          color: '#C0392B',
          iconColor: '#C0392B'
        }
      }
    },

    donationAmount: 0,
    projectTitle: null,
    wasNewCard: true,

    /**
     * If there is no card for the user, this might be an ObjectProxy
     * that has `null` content. This `card.id` approach was the least
     * hacky way we could think to deal with this late one night.
     *
     * TODO: Find a better approach!
     */
    isNewCard: empty('card.id'),
    shouldShowNewForm: or('isNewCard', 'subscribingWithNewCard'),
    subscribingWithNewCard: and('isProcessing', 'wasNewCard'),

    init: function init() {
      this._super.apply(this, arguments);
      this.set('wasNewCard', this.get('isNewCard'));
    }
  });
});