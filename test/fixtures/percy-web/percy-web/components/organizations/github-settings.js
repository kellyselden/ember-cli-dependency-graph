define('percy-web/components/organizations/github-settings', ['exports', 'ember-changeset', 'ember-changeset-validations'], function (exports, _emberChangeset, _emberChangesetValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    classes: null,

    store: service(),
    session: service(),
    currentUser: alias('session.currentUser'),

    changeset: computed('organization', function () {
      var validator = this.get('validator') || {};
      return new _emberChangeset.default(this.get('organization'), (0, _emberChangesetValidations.default)(validator), validator);
    }),
    disableSave: computed('changeset.githubAuthMechanism', 'changeset.isPristine', 'changeset.isInvalid', 'changeset.githubBotUser', 'organization.githubIntegration', function () {
      var mechanism = this.get('changeset.githubAuthMechanism');

      // Special case: disable save if on "Bot user" but no bot user assigned.
      if (mechanism === 'github-bot-user' && !this.get('changeset.githubBotUser')) {
        return true;
      }
      // Special case: disable save if on "Official GitHub Integration" is selected at all.
      if (mechanism === 'github-integration') {
        return true;
      }

      return this.get('changeset.isPristine') || this.get('changeset.isInvalid');
    }),

    isSaveSuccessful: null,
    isSaving: null,

    classNames: ['OrganizationsGithubSettings'],
    classNameBindings: ['classes'],
    actions: {
      showSupport: function showSupport() {
        this.sendAction('showSupport');
      },
      changeSelection: function changeSelection() {
        var newSelection = this.$('input[name="github-integration-setting"]:checked').val();
        this.get('changeset').rollback();

        // If selecting the same as the currently active auth mechanism, don't dirty the changeset.
        if (newSelection === this.get('organization.githubAuthMechanism')) {
          return;
        }

        this.get('changeset').set('githubAuthMechanism', newSelection);
      },
      assignBotUser: function assignBotUser() {
        var changeset = this.get('changeset');
        changeset.set('githubBotUser', this.get('currentUser'));
      },
      saveSelection: function saveSelection() {
        var _this = this;

        var organization = this.get('organization');
        var currentSelection = this.get('changeset.githubAuthMechanism');
        var changeset = this.get('changeset');

        if (currentSelection !== 'github-bot-user') {
          changeset.set('githubBotUser', null);
        }

        // Some custom validations, these require state outside of the attributes themselves so
        // we don't use a standard validations object.
        var currentIntegration = organization.get('githubIntegration');
        if (currentSelection !== 'github-integration' && currentIntegration) {
          changeset.addError('base', ['The official Percy GitHub Integration must be uninstalled in GitHub ' + 'before you can switch to a different integration type.']);
        } else if (currentSelection === 'github-bot-user' && !changeset.get('githubBotUser')) {
          changeset.addError('base', ['GitHub bot user cannot be blank']);
        }

        changeset.validate().then(function () {
          if (changeset.get('isInvalid')) {
            return;
          }
          _this.set('isSaveSuccessful', null);
          _this.set('isSaving', true);
          changeset.save().then(function () {
            _this.set('isSaving', false);
            _this.set('isSaveSuccessful', true);
          }, function () {
            _this.set('isSaving', false);
            _this.set('isSaveSuccessful', false);
          });
        });
      }
    }
  });
});