define('percy-web/mirage/config', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    this.passthrough('http://api.amplitude.com');

    this.get('/api/auth/session', function () {
      return { state: 'foo' };
    });

    this.get('/api/auth/logout', function (schema /*, request */) {
      var user = schema.users.findBy({ _currentLoginInTest: true });
      if (user) {
        user.update({ _currentLoginInTest: false });
      }
      return new _emberCliMirage.default.Response(200, {}, { success: true });
    });

    this.namespace = '/api/v1';

    this.get('/user', function (schema /*, request*/) {
      var user = schema.users.findBy({ _currentLoginInTest: true });
      if (user) {
        return user;
      } else {
        return new _emberCliMirage.default.Response(401, {}, {
          errors: [{
            status: 'unauthorized',
            detail: 'Authentication required.'
          }]
        });
      }
    });
    this.get('/organizations/:slug', function (schema, request) {
      return schema.organizations.findBy({ slug: request.params.slug });
    });
    this.patch('/organizations/:slug', function (schema, request) {
      var attrs = this.normalizedRequestAttrs();
      if (!attrs.slug.match(/^[a-zA-Z][a-zA-Z_]*[a-zA-Z]$/)) {
        return new _emberCliMirage.default.Response(400, {}, {
          errors: [{
            status: 'bad_request'
          }, {
            source: {
              pointer: '/data/attributes/slug'
            },
            detail: 'Slug must only contain letters, numbers, dashes,' + ' and cannot begin or end with a dash.'
          }]
        });
      }
      var organization = schema.organizations.findBy({ slug: request.params.slug });
      organization.update(attrs);
      return organization;
    });
    this.post('/organizations', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var currentUser = schema.users.findBy({ _currentLoginInTest: true });
      attrs.slug = attrs.name.underscore();
      var result = schema.organizations.create(attrs);
      schema.organizationUsers.create({
        userId: currentUser.id,
        organizationId: result.id
      });
      return result;
    });
    this.post('/organizations/:id/projects', function (schema, request) {
      var attrs = this.normalizedRequestAttrs();
      schema.organizations.findBy({ slug: request.params.slug });
      var project = schema.projects.create(attrs);
      return project;
    });
    this.get('organizations/:slug/subscription', function (schema, request) {
      var organization = schema.organizations.findBy({ slug: request.params.slug });
      return organization.subscription;
    });
    this.patch('organizations/:slug/subscription', function (schema, request) {
      var attrs = this.normalizedRequestAttrs();
      var organization = schema.organizations.findBy({ slug: request.params.slug });
      var subscription = organization.subscription;

      // Mimic backend email validation.
      if (!attrs.billingEmail.match(/^[a-zA-Z0-9_]+@[a-zA-Z0-9_.]+$/)) {
        return new _emberCliMirage.default.Response(400, {}, {
          errors: [{
            status: 'bad_request'
          }, {
            source: {
              pointer: '/data/attributes/billing-email'
            },
            detail: 'Billing email is invalid'
          }]
        });
      }
      subscription.update(attrs);
      return subscription;
    });
    this.get('/users/:id/organizations', function (schema, request) {
      var user = schema.users.find(request.params.id);
      if (!user._currentLoginInTest) {
        return { errors: [{ status: '403', title: 'unauthorized' }] };
      }
      var organizationUsers = schema.organizationUsers.where({ userId: user.id });
      var organizationIds = organizationUsers.models.map(function (obj) {
        return obj.organizationId;
      });
      return schema.organizations.where({ id: organizationIds });
    });
    this.get('/organizations/:slug/organization-users', function (schema, request) {
      // TODO handle ?filter=current-user-only
      var organization = schema.organizations.findBy({ slug: request.params.slug });
      return schema.organizationUsers.where({ organizationId: organization.id });
    });
    this.get('/organizations/:slug/projects', function (schema, request) {
      var organization = schema.organizations.findBy({ slug: request.params.slug });
      return schema.projects.where({ organizationId: organization.id });
    });
    this.get('/projects/:full_slug/', function (schema, request) {
      var fullSlug = decodeURIComponent(request.params.full_slug);
      return schema.projects.findBy({ fullSlug: fullSlug });
    });
    this.get('/projects/:organization_slug/:project_slug/tokens', function (schema, request) {
      var fullSlug = request.params.organization_slug + '/' + request.params.project_slug;
      var project = schema.projects.findBy({ fullSlug: fullSlug });
      return schema.tokens.where({ projectId: project.id });
    });
    this.get('/projects/:organization_slug/:project_slug/builds', function (schema, request) {
      var fullSlug = request.params.organization_slug + '/' + request.params.project_slug;
      var project = schema.projects.findBy({ fullSlug: fullSlug });
      return schema.builds.where({ projectId: project.id });
    });
    this.get('/invites/:id');
    this.patch('/invites/:id', function (schema, request) {
      var invite = schema.invites.find(request.params.id);
      var attrs = this.normalizedRequestAttrs();
      invite.update(attrs);
      return invite;
    });
    this.get('/builds/:id');
    this.get('/builds/:build_id/snapshots');
    this.get('/builds/:build_id/comparisons');
  };
});