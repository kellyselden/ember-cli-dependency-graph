define('percy-web/adapters/application', ['exports', 'ember-data', 'percy-web/lib/utils', 'ember-simple-auth/mixins/data-adapter-mixin'], function (exports, _emberData, _utils, _dataAdapterMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = _emberData.default.JSONAPIAdapter.extend(_dataAdapterMixin.default, {
    namespace: 'api/v1',
    authorizer: 'authorizer:jwt',
    adminMode: service(),

    headers: computed(function () {
      var headers = {};

      var percyMode = this.get('adminMode').get();
      if (percyMode) {
        headers['X-Percy-Mode'] = percyMode;
      }
      return headers;
    }),

    isInvalid: function isInvalid(status) {
      // NOTE: right now, the Percy API uses HTTP 400 when it should use HTTP 422 in many cases.
      // For that reason, we need to add 400 to the isInvalid check so that model.errors is populated
      // correctly.
      // TODO: when the API is changed to be more correct, we should drop this method.
      return status === 422 || status === 400;
    },
    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      // NOTE: for certain objects we don't expose a top-level API object and only operate on the
      // nested route. Because of that, some requests have to be transformed here.

      // Singular /user API that returns the current user (different from the /users API).
      if (requestType === 'queryRecord' && modelName === 'user' && id === null) {
        return _utils.default.buildApiUrl('user');
      }
      // Use organization nested, singular /organizations/:org_id/github-integration-request route.
      if (modelName === 'github-integration-request') {
        // TODO: use adapterOptions for this.
        var organizationSlug = snapshot.record.get('_orgForAdapter.slug');
        return _utils.default.buildApiUrl('githubIntegrationRequest', organizationSlug);
      }
      if (requestType === 'createRecord' && modelName === 'project') {
        return _utils.default.buildApiUrl('projectsCollection', snapshot.record.get('organization.slug'));
      }
      // Use the nested /organizations/:org_id/invites collection route when creating invites.
      if (requestType === 'createRecord' && modelName === 'invite') {
        return _utils.default.buildApiUrl('invites', snapshot.record.get('organization.slug'));
      }
      // Use the nested /organizations/:org_id/organization-users collection route.
      if (requestType === 'query' && modelName === 'organization-user') {
        var organization = query.organization;
        delete query.organization;
        // Query params are handled elsewhere in Ember, we just need the base URL here.
        return _utils.default.buildApiUrl('organizationUsers', organization.get('slug'));
      }
      // Use the nested /projects/:org_id/:project_id/builds collection route.
      if (requestType === 'query' && modelName === 'build') {
        var project = query.project;
        delete query.project;
        return _utils.default.buildApiUrl('projectBuilds', project.get('fullSlug'));
      }
      // Use the nested, singular /organizations/:org_id/subscription route for the org subscription.
      if (modelName === 'subscription') {
        return _utils.default.buildApiUrl('subscription', snapshot.record.get('organization.slug'));
      }

      // Customize buildURL for models where we want to use the slug as the ID in the API URL, but
      // keep the internal ID stable. TODO: remove this when Ember Data fully supports JSON-API
      // self links.
      if (id && modelName === 'organization') {
        var changedAttributes = snapshot.changedAttributes();
        var changedSlug = changedAttributes.slug && changedAttributes.slug[0];
        var originalSlug = snapshot.record.get('slug');

        // Handle: 1) slug changed, 2) slug has not changed, 3) slug does not exist.
        id = changedSlug || originalSlug || id;
      }
      if (id && modelName === 'project') {
        var _changedAttributes = snapshot.changedAttributes();
        var _changedSlug = _changedAttributes.slug && _changedAttributes.slug[0];
        var _originalSlug = snapshot.record.get('slug');

        // Handle: 1) slug changed, 2) slug has not changed, 3) slug does not exist.
        id = _changedSlug || _originalSlug || id;

        // Two cases need to be handled:
        // 1) On initial load, the project route contructs full slug id (org/project) based on the
        // URL. No organization relationship is present at that point, so we do nothing here.
        // 2) When the model is actually loaded, the full slug id now needs to be constructed for each
        // API call, so we add the organization slug here which completes the full slug.
        if (id.indexOf('/') === -1) {
          var _organizationSlug = snapshot.record.get('organization.slug');
          id = _organizationSlug + '/' + id;
        }
      }

      return this._super(modelName, id, snapshot, requestType, query);
    }
  });
});