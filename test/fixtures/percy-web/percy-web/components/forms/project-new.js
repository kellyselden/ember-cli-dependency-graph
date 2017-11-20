define('percy-web/components/forms/project-new', ['exports', 'percy-web/components/forms/base', 'percy-web/validations/project-new'], function (exports, _base, _projectNew) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  exports.default = _base.default.extend({
    organization: null,
    classes: null,

    classNames: ['FormsProjectNew', 'Form'],
    classNameBindings: ['classes'],

    model: computed(function () {
      return this.get('store').createRecord('project', {
        organization: this.get('organization')
      });
    }),
    validator: _projectNew.default
  });
});