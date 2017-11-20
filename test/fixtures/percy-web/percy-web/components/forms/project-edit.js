define('percy-web/components/forms/project-edit', ['exports', 'percy-web/components/forms/base', 'percy-web/validations/project-edit'], function (exports, _base, _projectEdit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  exports.default = _base.default.extend({
    project: null,
    classes: null,

    classNames: ['FormsProjectEdit', 'Form'],
    classNameBindings: ['classes'],

    model: alias('project'),
    validator: _projectEdit.default
  });
});