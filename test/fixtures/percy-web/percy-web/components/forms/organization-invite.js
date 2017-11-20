define('percy-web/components/forms/organization-invite', ['exports', 'percy-web/components/forms/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  exports.default = _base.default.extend({
    organization: null,
    classes: null,

    classNames: ['FormsOrganizationInvite', 'Form'],
    classNameBindings: ['classes'],

    // Due to how invites work, we need to reset the model manually after each submission so
    // that we don't get stuck trying to update an old model (which is just a dumb response wrapper).
    newModel: function newModel() {
      return this.get('store').createRecord('invite', {
        emails: '',
        role: null,
        organization: this.get('organization')
      });
    },

    model: computed('organization', 'store', function () {
      return this.newModel();
    }),
    validator: null,
    actions: {
      saving: function saving(promise) {
        var _this = this;

        this._super.apply(this, arguments);

        this.set('errorMessage', null);
        promise.then(function () {
          // Fully reset the model + changeset if saved successfully.
          _this.set('model', _this.newModel());
        }, function (errors) {
          _this.set('errorMessage', errors.errors[0].detail);
        });
      }
    }
  });
});