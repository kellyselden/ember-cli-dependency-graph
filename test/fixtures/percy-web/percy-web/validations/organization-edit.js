define('percy-web/validations/organization-edit', ['exports', 'ember-changeset-validations/validators'], function (exports, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: [(0, _validators.validatePresence)(true)],
    slug: [(0, _validators.validatePresence)(true)]
  };
});