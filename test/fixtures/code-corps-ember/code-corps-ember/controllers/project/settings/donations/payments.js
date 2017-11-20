define('code-corps-ember/controllers/project/settings/donations/payments', ['exports', 'code-corps-ember/utils/friendly-error'], function (exports, _friendlyError) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Controller = Ember.Controller;
  var service = Ember.inject.service;
  var merge = Ember.merge;
  var RSVP = Ember.RSVP;
  var set = Ember.set;
  var get = Ember.get;


  var ACCOUNT_CREATION_ERROR = 'There was a problem with creating your account. Please check your input and try again.';
  var ACCOUNT_UPDATE_ERROR = 'There was a problem with your account information. Please check your input and try again.';
  var BANK_ACCOUNT_TOKEN_CREATION_ERROR = 'There was a problem in using your bank account information. Please check your input and try again.';
  var BANK_ACCOUNT_ADDING_ERROR = 'There was a problem submitting your bank account information.';
  var PERSONAL_ID_NUMBER_TOKEN_CREATION_ERROR = 'There was a problem in using your personal ID number. Please check your input and try again.';
  var VERIFICATION_DOCUMENT_ERROR = 'There was a problem with attaching your document. Please try again.';

  exports.default = Controller.extend({
    currentUser: service(),
    store: service(),
    stripe: service(),

    stripeConnectAccount: alias('project.organization.stripeConnectAccount'),

    actions: {
      onCreateStripeConnectAccount: function onCreateStripeConnectAccount(properties) {
        var _this = this;

        this._startAction();

        get(this, 'project.organization').then(function (organization) {
          return _this._createStripeAccount(organization, properties);
        }).catch(function (reason) {
          return _this._handleError(reason);
        }).finally(function () {
          return _this._endAction();
        });
      },
      onRecipientDetailsSubmitted: function onRecipientDetailsSubmitted() {
        var _this2 = this;

        this._startAction();

        get(this, 'stripeConnectAccount').then(function (stripeConnectAccount) {
          return _this2._updateRecipientDetails(stripeConnectAccount);
        }).catch(function (reason) {
          return _this2._handleError(reason);
        }).finally(function () {
          return _this2._endAction();
        });
      },
      onBankAccountInformationSubmitted: function onBankAccountInformationSubmitted(_ref) {
        var _this3 = this;

        var accountNumber = _ref.accountNumber,
            routingNumber = _ref.routingNumber;

        this._startAction();

        var promises = {
          tokenData: this._createAccountToken(accountNumber, routingNumber),
          stripeConnectAccount: get(this, 'stripeConnectAccount')
        };

        RSVP.hash(promises).then(function (_ref2) {
          var tokenData = _ref2.tokenData,
              stripeConnectAccount = _ref2.stripeConnectAccount;
          return _this3._addBankAccount(tokenData, stripeConnectAccount);
        }).catch(function (response) {
          return _this3._handleError(response);
        }).finally(function () {
          return _this3._endAction();
        });
      },
      onVerificationDocumentSubmitted: function onVerificationDocumentSubmitted(stripeFileUploadId) {
        var _this4 = this;

        this._startAction();

        get(this, 'stripeConnectAccount').then(function (account) {
          return _this4._assignIdentityVerificationDocument(account, stripeFileUploadId);
        }).catch(function (response) {
          return _this4._handleError(response);
        }).finally(function () {
          return _this4._endAction();
        });
      },
      onLegalEntityPersonalIdNumberSubmitted: function onLegalEntityPersonalIdNumberSubmitted(legalEntityPersonalIdNumber) {
        var _this5 = this;

        this._startAction();

        var promises = {
          tokenData: this._createPersonalIdNumberToken(legalEntityPersonalIdNumber),
          stripeConnectAccount: get(this, 'stripeConnectAccount')
        };

        RSVP.hash(promises).then(function (_ref3) {
          var tokenData = _ref3.tokenData,
              stripeConnectAccount = _ref3.stripeConnectAccount;
          return _this5._assignLegalEntityPersonalIdNumber(tokenData, stripeConnectAccount);
        }).catch(function (response) {
          return _this5._handleError(response);
        }).finally(function () {
          return _this5._endAction();
        });
      }
    },

    // creating account

    _createStripeAccount: function _createStripeAccount(organization, properties) {
      var _this6 = this;

      var accountProperties = merge(properties, { organization: organization });

      return get(this, 'store').createRecord('stripe-connect-account', accountProperties).save().then(RSVP.resolve).catch(function () {
        return _this6._wrapError(ACCOUNT_CREATION_ERROR);
      });
    },


    // udating recipient info

    _updateRecipientDetails: function _updateRecipientDetails(stripeConnectAccount) {
      var _this7 = this;

      return stripeConnectAccount.save().then(RSVP.resolve).catch(function () {
        return _this7._wrapError(ACCOUNT_UPDATE_ERROR);
      });
    },


    // uploading and assigning an id verification document

    _assignIdentityVerificationDocument: function _assignIdentityVerificationDocument(stripeConnectAccount, stripeFileUploadId) {
      var _this8 = this;

      set(stripeConnectAccount, 'legalEntityVerificationDocument', stripeFileUploadId);

      return stripeConnectAccount.save().then(RSVP.resolve).catch(function () {
        return _this8._wrapError(VERIFICATION_DOCUMENT_ERROR);
      });
    },


    // assigning a personal id number

    _assignLegalEntityPersonalIdNumber: function _assignLegalEntityPersonalIdNumber(tokenData, stripeConnectAccount) {
      var _this9 = this;

      set(stripeConnectAccount, 'legalEntityPersonalIdNumber', tokenData.id);

      return stripeConnectAccount.save().then(RSVP.resolve).catch(function () {
        return _this9._wrapError(ACCOUNT_UPDATE_ERROR);
      });
    },
    _createPersonalIdNumberToken: function _createPersonalIdNumberToken(personalIdNumber) {
      var _this10 = this;

      var stripe = get(this, 'stripe');

      return stripe.piiData.createToken({ personalIdNumber: personalIdNumber }).then(function (stripeResponse) {
        return RSVP.resolve(stripeResponse);
      }).catch(function () {
        return _this10._wrapError(PERSONAL_ID_NUMBER_TOKEN_CREATION_ERROR);
      });
    },


    // bank account - token step

    _createAccountToken: function _createAccountToken(accountNumber, routingNumber) {
      var _this11 = this;

      var stripe = get(this, 'stripe');
      var params = this._bankAccountTokenParams(accountNumber, routingNumber);

      return stripe.bankAccount.createToken(params).then(function (stripeResponse) {
        return RSVP.resolve(stripeResponse);
      }).catch(function () {
        return _this11._wrapError(BANK_ACCOUNT_TOKEN_CREATION_ERROR);
      });
    },
    _bankAccountTokenParams: function _bankAccountTokenParams(accountNumber, routingNumber) {
      return {
        account_number: accountNumber,
        country: 'US',
        currency: 'USD',
        object: 'bank_account',
        routing_number: routingNumber
      };
    },


    // bank account - updating connect account record step

    _addBankAccount: function _addBankAccount(tokenData, stripeConnectAccount) {
      var _this12 = this;

      set(stripeConnectAccount, 'externalAccount', tokenData.id);

      return stripeConnectAccount.save().then(RSVP.resolve).catch(function () {
        return _this12._wrapError(BANK_ACCOUNT_ADDING_ERROR);
      });
    },


    // friendly error wrapping

    _wrapError: function _wrapError(message) {
      var friendlyError = new _friendlyError.default(message);
      return RSVP.reject(friendlyError);
    },


    // general catch-all error handler

    _handleError: function _handleError(error) {
      set(this, 'error', error);
    },
    _startAction: function _startAction() {
      set(this, 'isBusy', true);
      set(this, 'error', null);
    },
    _endAction: function _endAction() {
      set(this, 'isBusy', false);
    }
  });
});