define('ember-stripe-service/services/stripe', ['exports', 'ember', 'ember-stripe-service/utils/load-script'], function (exports, _ember, _emberStripeServiceUtilsLoadScript) {
  exports['default'] = _ember['default'].Service.extend({
    didConfigure: false,
    config: null,

    lazyLoad: _ember['default'].computed.readOnly('config.lazyLoad'),
    mock: _ember['default'].computed.readOnly('config.mock'),
    publishableKey: _ember['default'].computed.readOnly('config.publishableKey'),
    debuggingEnabled: _ember['default'].computed.readOnly('config.debug'),

    runCount: 0,

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);

      var lazyLoad = this.get('lazyLoad');
      var mock = this.get('mock');

      if (_ember['default'].testing) {
        this._waiter = function () {
          return _this.get('runCount') === 0;
        };
        _ember['default'].Test.registerWaiter(this._waiter);
      }

      if (!lazyLoad || mock) {
        this.configure();
      }
    },

    load: function load() {
      var _this2 = this;

      var lazyLoad = this.get('lazyLoad');
      var mock = this.get('mock');

      var loadJs = lazyLoad && !mock ? (0, _emberStripeServiceUtilsLoadScript['default'])("https://js.stripe.com/v2/") : _ember['default'].RSVP.resolve();

      return loadJs.then(function () {
        _this2.configure();
      });
    },

    configure: function configure() {
      var didConfigure = this.get('didConfigure');

      if (!didConfigure) {
        var publishableKey = this.get('publishableKey');
        Stripe.setPublishableKey(publishableKey);

        this.card = {
          createToken: this._createCardToken.bind(this)
        };

        this.bankAccount = {
          createToken: this._createBankAccountToken.bind(this)
        };

        this.piiData = {
          createToken: this._createPiiDataToken.bind(this)
        };

        this._checkForAndAddCardFn('cardType', Stripe.card.cardType);
        this._checkForAndAddCardFn('validateCardNumber', Stripe.card.validateCardNumber);
        this._checkForAndAddCardFn('validateCVC', Stripe.card.validateCVC);
        this._checkForAndAddCardFn('validateExpiry', Stripe.card.validateExpiry);

        this.set('didConfigure', true);
      }
    },

    stripePromise: function stripePromise(callback) {
      return this.load().then(function () {
        return new _ember['default'].RSVP.Promise(function (resolve, reject) {
          callback(resolve, reject);
        });
      });
    },

    /**
    * Creates a creditCard token using Stripe.js API, exposed as `card.createToken`
    * @param  {ojbect} card  CreditCard
    * @return {promise}      Returns a promise that holds response, see stripe.js docs for details
    *                        status is not being returned at the moment but it can be logged
    */
    _createCardToken: function _createCardToken(card) {
      var _this3 = this;

      this.debug('card.createToken:', card);
      this.incrementProperty('runCount');

      return this.stripePromise(function (resolve, reject) {
        Stripe.card.createToken(card, function (status, response) {
          _this3.debug('card.createToken handler - status %s, response:', status, response);

          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }

          _this3.decrementProperty('runCount');
        });
      });
    },

    /**
    * Creates a BankAccout token using Stripe.js API, exposed as `bankAccount.createToken`
    * @param  {ojbect} bankAccount
    * @return {promise}      Returns a promise that holds response, see stripe.js docs for details
    *                        Status is not being returned at the moment but it can be logged
    *
    */
    _createBankAccountToken: function _createBankAccountToken(bankAccount) {
      var _this4 = this;

      this.debug('bankAccount.createToken:', bankAccount);
      this.incrementProperty('runCount');

      return this.stripePromise(function (resolve, reject) {
        Stripe.bankAccount.createToken(bankAccount, function (status, response) {

          _this4.debug('bankAccount.createToken handler - status %s, response:', status, response);

          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }

          _this4.decrementProperty('runCount');
        });
      });
    },

    /**
     * Creates a piiData token using Stripe.js API, exposed as `piiData.createToken`
     * @param  {object} piiData  PiiData
     * @return {promise}         Returns a promise that holds response, see stripe.js docs for details
     *                           status is not being returned at the moment but it can be logged
     */
    _createPiiDataToken: function _createPiiDataToken(piiData) {
      var _this5 = this;

      this.debug('piiData.createToken:', piiData);
      this.incrementProperty('runCount');

      return this.stripePromise(function (resolve, reject) {
        Stripe.piiData.createToken(piiData, function (status, response) {

          _this5.debug('piiData.createToken handler - status %s, response:', status, response);

          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }

          _this5.decrementProperty('runCount');
        });
      });
    },

    /**
     * Uses Ember.Logger.info to output service information if debugging is
     * set
     *
     * notes:
     * - proxies all arguments to Ember.Logger.info
     * - pre-pends StripeService to all messages
     */
    debug: function debug() {
      var debuggingEnabled = this.get('debuggingEnabled');

      if (debuggingEnabled) {
        var args = Array.prototype.slice.call(arguments);
        args[0] = 'StripeService: ' + args[0];
        _ember['default'].Logger.info.apply(null, args);
      }
    },

    _checkForAndAddCardFn: function _checkForAndAddCardFn(name, fn) {
      if (_ember['default'].isEqual(_ember['default'].typeOf(Stripe.card[name]), 'function')) {
        this.card[name] = fn;
      } else {
        this.card[name] = function () {};
        _ember['default'].Logger.error('ember-cli-stripe: ' + name + ' on Stripe.card is no longer available');
      }
    }
  });
});
/* global Stripe */