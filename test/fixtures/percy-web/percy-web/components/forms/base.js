define('percy-web/components/forms/base', ['exports', 'ember-changeset', 'ember-changeset-validations'], function (exports, _emberChangeset, _emberChangesetValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var computed = Ember.computed;
  var get = Ember.get;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    // To be defined by superclass:
    model: null,
    validator: null,

    isSaving: false,
    isSaveSuccessful: null,
    errorMessage: null,

    store: service(),
    changeset: computed('model', 'validator', function () {
      var model = this.get('model');
      var validator = this.get('validator') || {};

      if (model.content) {
        // TODO: re-evaluate this when ember-changeset promise support lands.
        // https://github.com/DockYard/ember-changeset/pull/130
        // https://github.com/percy/percy-web/pull/48
        (true && !(false) && Ember.assert('Promises are not supported in forms!'));
      }

      return new _emberChangeset.default(model, (0, _emberChangesetValidations.default)(validator), validator);
    }),
    focusOnInsert: on('didInsertElement', function () {
      // We can't only use autofocus=true because it apparently only works on first load.
      this.$('[autofocus]').focus();
    }),

    actions: {
      saving: function saving(promise) {
        var _this = this;

        this.set('isSaveSuccessful', null);
        this.set('isSaving', true);
        this.set('errorMessage', null);
        promise.then(function () {
          _this.set('isSaving', false);
          _this.set('isSaveSuccessful', true);
        }, function (errors) {
          _this.set('isSaving', false);
          _this.set('isSaveSuccessful', false);
          if (errors && errors.errors && errors.errors[0].detail) {
            _this.set('errorMessage', errors.errors[0].detail);
          } else {
            _this.set('errorMessage', 'An unhandled error occured');
          }
        });
      },
      validateProperty: function validateProperty(changeset, property) {
        return changeset.validate(property);
      },
      save: function save() {
        var _this2 = this;

        var model = this.get('model');
        var changeset = this.get('changeset');

        changeset.validate();

        if (get(changeset, 'isValid')) {
          var savingPromise = changeset.save();
          this.send('saving', savingPromise);

          savingPromise.then(function (model) {
            // Bubble the successfully saved model upward, so the route can react to it.
            _this2.sendAction('saveSuccess', model);
            changeset.rollback();
          }).catch(function () {
            // TODO: clean this up when this issue is addressed:
            // https://github.com/DockYard/ember-changeset/issues/100
            var errorData = {};
            _this2.get('model.errors').forEach(function (_ref) {
              var attribute = _ref.attribute,
                  message = _ref.message;

              if (!errorData[attribute]) {
                errorData[attribute] = [];
              }
              errorData[attribute].push(message);
            });
            Object.keys(errorData).forEach(function (key) {
              changeset.addError(key, errorData[key]);
            });
            // Make sure the model dirty attrs are rolled back (not for new, unsaved records).
            // TODO: this causes flashing when page state is bound to a model attribute that is
            // dirtied by the changeset save(), but it's better than leaving the model dirty
            // and having page state be out of date. Better way to handle this?
            if (!model.get('isNew')) {
              model.rollbackAttributes();
            }
          });
        }
      },
      delete: function _delete() {
        this.get('model').destroyRecord();
      }
    }
  });
});