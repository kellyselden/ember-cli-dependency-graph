define('code-corps-ember/controllers/project/checkout', ['exports', 'code-corps-ember/utils/friendly-error', 'code-corps-ember/utils/error-utils'], function (exports, _friendlyError, _errorUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var Controller = Ember.Controller;
  var not = Ember.computed.not;
  var bool = Ember.computed.bool;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var RSVP = Ember.RSVP;


  var CUSTOMER_CREATION_ERROR = 'There was a problem in connecting your account with our payment processor. Please try again.';
  var CARD_CREATION_ERROR = 'There was a problem in using your payment information. Please try again.';
  var SUBSCRIPTION_CREATION_ERROR = 'There was a problem in setting up your monthly donation. Please try again.';
  var SUBSCRIPTION_VALIDATION_ERROR = "The amount you've set for your monthly donation is invalid.";

  exports.default = Controller.extend({
    amount: 10,
    queryParams: ['amount'],

    currentUser: service(),
    store: service(),
    stripev3: service(),

    project: alias('model'),
    user: alias('currentUser.user'),

    stripeCustomerCreated: bool('user.stripePlatformCustomer.id'),
    shouldCreateCustomer: not('stripeCustomerCreated'),

    actions: {
      // If the card does not exist yet
      saveAndDonate: function saveAndDonate(amount, stripeElement) {
        var _this = this;

        this._clearErrors();
        this._updateisProcessing(true);

        return this._createStripeToken(stripeElement).then(function (token) {
          return _this._createCardForPlatformCustomer(token);
        }).then(function (stripeCard) {
          return _this._createSubscription(amount, stripeCard);
        }).then(function () {
          return _this._transitionToThankYou();
        }).catch(function (response) {
          return _this._handleError(response);
        }).finally(function () {
          return _this._updateisProcessing(false);
        });
      },


      // If the card exists already
      donate: function donate(amount, stripeCard) {
        var _this2 = this;

        this._clearErrors();
        this._updateisProcessing(true);

        return this._createSubscription(amount, stripeCard).then(function () {
          return _this2._transitionToThankYou();
        }).finally(function () {
          return _this2._updateisProcessing(false);
        });
      }
    },

    // Stripe token

    _createStripeToken: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stripeElement) {
        var _this3 = this;

        var stripe;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                stripe = get(this, 'stripev3');
                _context.next = 3;
                return stripe.createToken(stripeElement).then(function (_ref2) {
                  var error = _ref2.error,
                      token = _ref2.token;

                  if (error) {
                    return _this3._handleCreditCardTokenError(error);
                  } else if (token) {
                    return RSVP.resolve(token);
                  }
                });

              case 3:
                return _context.abrupt('return', _context.sent);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _createStripeToken(_x) {
        return _ref.apply(this, arguments);
      }

      return _createStripeToken;
    }(),
    _handleCreditCardTokenError: function _handleCreditCardTokenError(response) {
      return RSVP.reject(response);
    },


    // card and customer logic

    _createCardForPlatformCustomer: function _createCardForPlatformCustomer(_ref3) {
      var _this4 = this;

      var id = _ref3.id;

      return this._ensureStripePlatformCustomer().then(function () {
        return _this4._createStripePlatformCard(id);
      });
    },
    _ensureStripePlatformCustomer: function _ensureStripePlatformCustomer() {
      if (get(this, 'shouldCreateCustomer')) {
        return this._createStripePlatformCustomer();
      } else {
        return RSVP.resolve();
      }
    },


    // platform customer

    _createStripePlatformCustomer: function _createStripePlatformCustomer() {
      var _this5 = this;

      var _getProperties = this.getProperties('user', 'store'),
          user = _getProperties.user,
          store = _getProperties.store;

      var email = get(user, 'email');

      return store.createRecord('stripe-platform-customer', { email: email, user: user }).save().then(function (record) {
        return RSVP.resolve(record);
      }).catch(function (response) {
        return _this5._handleCustomerCreationError(response);
      });
    },
    _handleCustomerCreationError: function _handleCustomerCreationError() {
      var friendlyError = new _friendlyError.default(CUSTOMER_CREATION_ERROR);
      return RSVP.reject(friendlyError);
    },


    // platform card

    _createStripePlatformCard: function _createStripePlatformCard(stripeToken) {
      var _this6 = this;

      var store = get(this, 'store');
      var user = get(this, 'user');
      var card = store.createRecord('stripe-platform-card', { stripeToken: stripeToken, user: user });
      return card.save().then(function (record) {
        return RSVP.resolve(record);
      }).catch(function (response) {
        return _this6._handleCardCreationError(response);
      });
    },
    _handleCardCreationError: function _handleCardCreationError() {
      var friendlyError = new _friendlyError.default(CARD_CREATION_ERROR);
      return RSVP.reject(friendlyError);
    },


    // subscription

    _createSubscription: function _createSubscription(quantity) {
      var _this7 = this;

      var _getProperties2 = getProperties(this, 'project', 'store', 'user'),
          project = _getProperties2.project,
          store = _getProperties2.store,
          user = _getProperties2.user;

      return store.createRecord('stripe-connect-subscription', { project: project, quantity: quantity, user: user }).save().then(function (record) {
        return RSVP.resolve(record);
      }).catch(function (response) {
        return _this7._handleSubscriptionCreationError(response);
      });
    },
    _handleSubscriptionCreationError: function _handleSubscriptionCreationError(response) {
      var message = (0, _errorUtils.isValidationError)(response) ? SUBSCRIPTION_VALIDATION_ERROR : SUBSCRIPTION_CREATION_ERROR;
      var friendlyError = new _friendlyError.default(message);

      return RSVP.reject(friendlyError);
    },


    // transitioning

    _transitionToThankYou: function _transitionToThankYou() {
      var project = get(this, 'project');
      return this.transitionToRoute('project.thank-you', project);
    },


    // setting error property

    _handleError: function _handleError(error) {
      this.set('error', error);
    },


    // helpers

    _updateisProcessing: function _updateisProcessing(value) {
      set(this, 'isProcessing', value);
    },
    _clearErrors: function _clearErrors() {
      this.set('error', null);
    }
  });
});