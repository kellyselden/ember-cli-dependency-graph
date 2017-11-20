define('code-corps-ember/components/payments/create-account', ['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  var empty = Ember.computed.empty;
  exports.default = Component.extend({
    classNameBindings: ['highlightClass'],
    classNames: ['create-account', 'panel'],

    required: empty('stripeConnectAccount.id'),

    status: computed('required', function () {
      var required = get(this, 'required');
      return required ? 'required' : 'verified';
    }),

    highlightClass: computed('required', function () {
      var required = get(this, 'required');
      return required ? 'panel--highlighted' : 'panel--highlighted-green';
    }),

    actions: {
      submit: function submit() {
        var country = get(this, 'country');
        var tosAcceptanceDate = parseInt(_moment.default.utc().format('X'));

        var onSubmit = get(this, 'onCreateStripeConnectAccount');
        onSubmit({ country: country, tosAcceptanceDate: tosAcceptanceDate });
      }
    }
  });
});