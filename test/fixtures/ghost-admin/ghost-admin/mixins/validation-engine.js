define('ghost-admin/mixins/validation-engine', ['exports', 'ember-data', 'ghost-admin/validators/invite-user', 'ember-data/model', 'ghost-admin/validators/nav-item', 'ghost-admin/validators/post', 'ghost-admin/validators/reset', 'ghost-admin/validators/setting', 'ghost-admin/validators/setup', 'ghost-admin/validators/signin', 'ghost-admin/validators/signup', 'ghost-admin/validators/slack-integration', 'ghost-admin/validators/subscriber', 'ghost-admin/validators/tag-settings', 'ghost-admin/validators/user', 'ghost-admin/utils/validator-extensions'], function (exports, _emberData, _inviteUser, _model, _navItem, _post, _reset, _setting, _setup, _signin, _signup, _slackIntegration, _subscriber, _tagSettings, _user, _validatorExtensions) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var RSVP = Ember.RSVP;
    var emberA = Ember.A;
    var isEmberArray = Ember.isArray;
    var Errors = _emberData.default.Errors;


    // our extensions to the validator library
    _validatorExtensions.default.init();

    /**
    * The class that gets this mixin will receive these properties and functions.
    * It will be able to validate any properties on itself (or the model it passes to validate())
    * with the use of a declared validator.
    */
    exports.default = Mixin.create({
        // these validators can be passed a model to validate when the class that
        // mixes in the ValidationEngine declares a validationType equal to a key on this object.
        // the model is either passed in via `this.validate({ model: object })`
        // or by calling `this.validate()` without the model property.
        // in that case the model will be the class that the ValidationEngine
        // was mixed into, i.e. the controller or Ember Data model.
        validators: {
            inviteUser: _inviteUser.default,
            navItem: _navItem.default,
            post: _post.default,
            reset: _reset.default,
            setting: _setting.default,
            setup: _setup.default,
            signin: _signin.default,
            signup: _signup.default,
            slackIntegration: _slackIntegration.default,
            subscriber: _subscriber.default,
            tag: _tagSettings.default,
            user: _user.default
        },

        // This adds the Errors object to the validation engine, and shouldn't affect
        // ember-data models because they essentially use the same thing
        errors: null,

        // Store whether a property has been validated yet, so that we know whether or not
        // to show error / success validation for a field
        hasValidated: null,

        init: function init() {
            this._super.apply(this, arguments);
            this.set('errors', Errors.create());
            this.set('hasValidated', emberA());
        },


        /**
        * Passes the model to the validator specified by validationType.
        * Returns a promise that will resolve if validation succeeds, and reject if not.
        * Some options can be specified:
        *
        * `model: Object` - you can specify the model to be validated, rather than pass the default value of `this`,
        *                   the class that mixes in this mixin.
        *
        * `property: String` - you can specify a specific property to validate. If
        * 					   no property is specified, the entire model will be
        * 					   validated
        */
        validate: function validate(opts) {
            var model = this;
            var hasValidated = void 0,
                type = void 0,
                validator = void 0;

            opts = opts || {};

            if (opts.model) {
                model = opts.model;
            } else if (this instanceof _model.default) {
                model = this;
            } else if (this.get('model')) {
                model = this.get('model');
            }

            type = this.get('validationType') || model.get('validationType');
            validator = this.get('validators.' + type) || model.get('validators.' + type);
            hasValidated = this.get('hasValidated');

            opts.validationType = type;

            return new RSVP.Promise(function (resolve, reject) {
                var passed = void 0;

                if (!type || !validator) {
                    return reject(['The validator specified, "' + type + '", did not exist!']);
                }

                if (opts.property) {
                    // If property isn't in `hasValidated`, add it to mark that this field can show a validation result
                    hasValidated.addObject(opts.property);
                    model.get('errors').remove(opts.property);
                } else {
                    model.get('errors').clear();
                }

                passed = validator.check(model, opts.property);

                return passed ? resolve() : reject();
            });
        },


        /**
        * The primary goal of this method is to override the `save` method on Ember Data models.
        * This allows us to run validation before actually trying to save the model to the server.
        * You can supply options to be passed into the `validate` method, since the ED `save` method takes no options.
        */
        save: function save(options) {
            var _this = this;

            var _super = this._super;


            options = options || {};
            options.wasSave = true;

            // model.destroyRecord() calls model.save() behind the scenes.
            // in that case, we don't need validation checks or error propagation,
            // because the model itself is being destroyed.
            if (this.get('isDeleted')) {
                return this._super.apply(this, arguments);
            }

            // If validation fails, reject with validation errors.
            // If save to the server fails, reject with server response.
            return this.validate(options).then(function () {
                if (typeof _this.beforeSave === 'function') {
                    _this.beforeSave();
                }
                return _super.call(_this, options);
            }).catch(function (result) {
                // server save failed or validator type doesn't exist
                if (result && !isEmberArray(result)) {
                    throw result;
                }

                return RSVP.reject(result);
            });
        },


        actions: {
            validate: function validate(property) {
                this.validate({ property: property });
            }
        }
    });
});