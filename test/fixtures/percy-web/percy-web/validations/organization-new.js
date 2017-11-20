define('percy-web/validations/organization-new', ['exports', 'ember-changeset-validations/validators'], function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: [(0, _validators.validatePresence)(true)]
  };
});