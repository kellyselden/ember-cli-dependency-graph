define('code-corps-ember/routes/github', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'code-corps-ember/utils/error-utils'], function (exports, _authenticatedRouteMixin, _errorUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var Route = Ember.Route;


  var STATE_INVALID = 'Something went wrong while connecting to GitHub. Please try again.';

  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    queryParams: {
      // changing any of these query params needs to trigger the model hook to
      // start the connect process
      code: { refreshModel: true },
      state: { refreshModel: true }
    },

    ajax: service(),
    currentUser: service(),
    githubState: service(),
    flashMessages: service(),
    store: service(),

    model: function model(_ref) {
      var code = _ref.code,
          state = _ref.state;

      var stateValidator = get(this, 'githubState');

      if (stateValidator.validate(state)) {
        return this._sendRequest(code, state);
      } else {
        get(this, 'flashMessages').clearMessages().danger(STATE_INVALID);
        return this.transitionTo('settings.integrations');
      }
    },
    afterModel: function afterModel(currentUserData) {
      get(this, 'store').pushPayload(currentUserData);
      return this.transitionTo('settings.integrations');
    },


    actions: {
      error: function error(_error) {
        var message = (0, _errorUtils.formatError)(_error);
        get(this, 'flashMessages').clearMessages().danger(message);
        this.replaceWith('settings.integrations');
        return false;
      }
    },

    _sendRequest: function _sendRequest(code, state) {
      return get(this, 'ajax').request('/oauth/github', {
        method: 'POST',
        data: { code: code, state: state }
      });
    }
  });
});