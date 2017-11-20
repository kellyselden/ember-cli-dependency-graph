define('percy-web/components/forms/organization-edit', ['exports', 'percy-web/components/forms/base', 'percy-web/validations/organization-edit'], function (exports, _base, _organizationEdit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  exports.default = _base.default.extend({
    organization: null,
    classes: null,

    classNames: ['FormsOrganizationEdit', 'Form'],
    classNameBindings: ['classes'],

    model: alias('organization'),
    validator: _organizationEdit.default
  });
});