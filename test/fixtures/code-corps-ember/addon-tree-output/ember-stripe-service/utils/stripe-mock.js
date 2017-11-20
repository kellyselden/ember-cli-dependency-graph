define('ember-stripe-service/utils/stripe-mock', ['exports'], function (exports) {
  exports['default'] = {
    setPublishableKey: function setPublishableKey() {},
    card: {
      cardType: function cardType() {},
      validateCardNumber: function validateCardNumber() {},
      validateCVC: function validateCVC() {},
      validateExpiry: function validateExpiry() {},
      createToken: function createToken(card, cb) {
        cb('ok', { id: 'mocked' });
      }
    },
    bankAccount: {
      createToken: function createToken(backAccount, cb) {
        cb('ok', { id: 'mocked' });
      }
    },
    piiData: {
      createToken: function createToken(piiData, cb) {
        cb('ok', { id: 'mocked' });
      }
    }
  };
});