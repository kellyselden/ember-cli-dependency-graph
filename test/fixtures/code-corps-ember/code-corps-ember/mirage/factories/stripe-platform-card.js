define('code-corps-ember/mirage/factories/stripe-platform-card', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    brand: _emberCliMirage.faker.list.cycle('American Express', 'Diners Club', 'Discover', 'JCB', 'MasterCard', 'Visa'),
    expMonth: '01',
    expYear: '2022',
    last4: _emberCliMirage.faker.list.cycle('0005', '5904', '1117', '0000', '4444', '4242')
  });
});