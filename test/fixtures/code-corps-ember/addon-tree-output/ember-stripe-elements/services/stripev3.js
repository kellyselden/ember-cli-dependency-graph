define('ember-stripe-elements/services/stripev3', ['exports', 'ember-stripe-elements/utils/load-script'], function (exports, _loadScript) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var setProperties = Ember.setProperties;
  var readOnly = Ember.computed.readOnly;
  var resolve = Ember.RSVP.resolve;
  exports.default = Service.extend({
    config: null,
    didConfigure: false,
    didLoad: false,

    lazyLoad: readOnly('config.lazyLoad'),
    mock: readOnly('config.mock'),
    publishableKey: readOnly('config.publishableKey'),

    init: function init() {
      this._super.apply(this, arguments);

      var lazyLoad = this.get('lazyLoad');
      var mock = this.get('mock');

      if (!lazyLoad || mock) {
        this.configure();
      }
    },
    load: function load() {
      var _this = this;

      var lazyLoad = this.get('lazyLoad');
      var mock = this.get('mock');
      var shouldLoad = lazyLoad && !mock;

      var doLoad = shouldLoad ? (0, _loadScript.default)("https://js.stripe.com/v3/") : resolve();

      return doLoad.then(function () {
        _this.configure();
        _this.set('didLoad', true);
      });
    },
    configure: function configure() {
      var didConfigure = this.get('didConfigure');

      if (!didConfigure) {
        var publishableKey = this.get('publishableKey');

        var _ref = new Stripe(publishableKey),
            elements = _ref.elements,
            createToken = _ref.createToken,
            createSource = _ref.createSource,
            retrieveSource = _ref.retrieveSource,
            paymentRequest = _ref.paymentRequest;

        setProperties(this, { elements: elements, createToken: createToken, createSource: createSource, retrieveSource: retrieveSource, paymentRequest: paymentRequest });

        this.set('didConfigure', true);
      }
    }
  });
});