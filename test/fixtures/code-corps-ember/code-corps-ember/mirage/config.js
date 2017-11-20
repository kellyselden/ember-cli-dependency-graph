define('code-corps-ember/mirage/config', ['exports', 'ember-cli-mirage', 'code-corps-ember/mirage/utils/pagination'], function (exports, _emberCliMirage, _pagination) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    this.passthrough('https://api.stripe.com/**');
    this.passthrough('https://uploads.stripe.com/**');
    this.post('https://api.cloudinary.com/**', function () {
      return new _emberCliMirage.default.Response(201, {}, {
        public_id: 'abc123'
      });
    });

    /**
    * Categories
    */

    this.get('/categories', { coalesce: true });
    this.post('/categories');
    this.get('/categories/:id');
    this.patch('/categories/:id');

    /**
    * Comment user mentions
    */

    // GET /comment-user-mentions
    this.get('/comment-user-mentions', function (schema, request) {
      var commentId = request.queryParams.comment_id;
      var comment = schema.comments.find(commentId);

      generateCommentMentions(schema, comment);

      return schema.commentUserMentions.where({ commentId: commentId });
    });

    /**
    * Comments
    */

    this.get('/comments', { coalesce: true });

    this.post('/comments', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      // the API takes takes markdown and renders body
      attrs.body = '<p>' + attrs.markdown + '</p>';
      return schema.create('comment', attrs);
    });

    this.get('/comments/:id');

    this.patch('/comments/:id', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var comment = schema.comments.find(attrs.id);

      // the API takes takes markdown and renders body
      attrs.body = '<p>' + attrs.markdown + '</p>';

      comment.commentUserMentions.models.forEach(function (mention) {
        return mention.destroy();
      });
      return comment.update(attrs);
    });

    /**
     * Donation goals
     */

    this.get('/donation-goals', { coalesce: true });
    this.get('/donation-goals/:id');
    this.patch('/donation-goals/:id');
    this.post('/donation-goals');

    /**
    * Github App Installations
    */

    this.get('/github-app-installations', { coalesce: true });
    this.post('/github-app-installations');
    this.get('/github-app-installations/:id');

    /**
    * Github Events
    */

    this.get('/github-events', function (schema, request) {
      var items = schema.githubEvents.all();
      return (0, _pagination.paginate)(items, '/github-events', request.queryParams);
    });
    this.get('/github-events/:id');
    this.patch('/github-events/:id', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var retry = attrs.retry;

      var githubEvent = schema.githubEvents.find(attrs.id);
      if (retry) {
        // Simulate API retrying the event
        return githubEvent.update({ status: 'reprocessing' });
      } else {
        // Simulate API failing to retry the event
        return new _emberCliMirage.default.Response(422, {}, {
          errors: [{
            detail: 'Retry must be accepted',
            source: {
              pointer: '/data/attributes/retry'
            },
            status: '422',
            title: 'retry must be accepted'
          }],
          jsonapi: {
            version: '1.0'
          }
        });
      }
    });

    /**
    * Github Issues
    */

    this.get('/github-issues', { coalesce: true });
    this.get('/github-issues/:id');

    /**
    * Github Pull Requests
    */

    this.get('/github-pull-requests', { coalesce: true });
    this.get('/github-pull-requests/:id');

    /**
    * Github Repos
    */

    this.get('/github-repos', { coalesce: true });
    this.get('/github-repos/:id');
    this.patch('/github-repos/:id', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var projectId = attrs.projectId;

      var githubRepo = schema.githubRepos.find(attrs.id);
      if (projectId) {
        // Simulate API syncing the repo
        var project = schema.projects.find(projectId);
        return githubRepo.update({ project: project, syncState: 'synced' });
      } else {
        // Simulate API disconnecting the repo and unsetting the state
        return githubRepo.update({ project: null, syncState: 'unsynced' });
      }
    });

    /**
    * Organizations
    */

    this.get('/organizations', { coalesce: true });
    this.post('/organizations');
    this.get('/organizations/:id');
    this.patch('/organizations/:id');

    /**
    * Organization Github App Installations
    */

    this.get('/organization-github-app-installations', { coalesce: true });
    this.post('/organization-github-app-installations');
    this.get('/organization-github-app-installations/:id');
    this.delete('/organization-github-app-installations/:id');

    /**
    * Password
    */

    this.post('/password/forgot', function () {

      // just return something?
      return new _emberCliMirage.default.Response(201, {}, {
        email: 'test@test.com'
      });
    });

    this.post('/password/reset', function (schema) {
      var _normalizedRequestAtt = this.normalizedRequestAttrs(),
          password = _normalizedRequestAtt.password,
          passwordConfirmation = _normalizedRequestAtt['password-confirmation'],
          token = _normalizedRequestAtt.token;

      var _schema$users$where$m3 = _slicedToArray(schema.users.where({ token: token }).models, 1),
          matchedUser = _schema$users$where$m3[0];

      if (password === passwordConfirmation) {
        return new _emberCliMirage.default.Response(201, {}, {
          email: matchedUser.email,
          token: token,
          user_id: matchedUser.id
        });
      } else {
        return new _emberCliMirage.default.Response(422, {}, {
          errors: [{
            detail: 'Password confirmation passwords do not match',
            source: {
              pointer: '/data/attributes/password-confirmation'
            },
            status: '422',
            title: 'passwords do not match'
          }],
          jsonapi: {
            version: '1.0'
          }
        });
      }
    });

    /**
    * Previews
    */

    this.post('/previews', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      // the API takes takes markdown and renders body
      attrs.body = '<p>' + attrs.markdown + '</p>';
      return schema.create('preview', attrs);
    });

    /**
    * Preview user mentions
    */

    this.get('/preview-user-mentions', function (schema, request) {
      var previewId = request.queryParams.preview_id;
      var preview = schema.previews.find(previewId);

      generatePreviewMentions(schema, preview);

      return schema.previewUserMentions.where({ previewId: previewId });
    });

    /**
    * Project categories
    */

    this.get('/project-categories', { coalesce: true });
    this.post('/project-categories');
    this.get('/project-categories/:id');
    this.delete('/project-categories/:id');

    /**
    * Project skills
    */

    this.get('/project-skills', { coalesce: true });
    this.post('/project-skills');
    this.get('/project-skills/:id');
    this.delete('/project-skills/:id');

    /**
    * Project users
    */

    this.get('/project-users', { coalesce: true });
    this.post('/project-users');
    this.get('/project-users/:id');
    this.patch('/project-users/:id');
    this.delete('/project-users/:id');

    /**
    * Projects
    */

    this.get('/projects', { coalesce: true });
    this.post('/projects');
    this.get('/projects/:id');

    this.get('/projects/:projectId/tasks', function (schema, request) {
      var projectId = request.params.projectId;

      var taskStatus = request.queryParams.status;

      var pageNumber = parseInt(request.queryParams['page[page]']);
      var pageSize = request.queryParams['page[page-size]'] || 10;

      var project = schema.projects.find(projectId);

      var tasks = project.tasks;


      if (taskStatus) {
        tasks = tasks.filter(function (p) {
          return p.status === taskStatus;
        });
      }

      var tasksPage = tasks.filter(function (p, index) {
        var pageNumberNotSpecified = !pageNumber;
        var indexIsOnSpecifiedPage = index >= (pageNumber - 1) * pageSize && index < pageNumber * pageSize;
        return pageNumberNotSpecified || indexIsOnSpecifiedPage;
      });

      // hacky, but the only way I could find to pass in a mocked meta object
      // for our pagination tests
      tasksPage.meta = {
        'total_records': tasks.models.length,
        'total_pages': Math.ceil(tasks.models.length / pageSize),
        'page_size': pageSize,
        'current_page': pageNumber || 1
      };

      return tasksPage;
    });

    this.get('/projects/:projectId/tasks/:number', function (schema, request) {
      var projectId = parseInt(request.params.projectId);
      var number = parseInt(request.params.number);

      var project = schema.projects.find(projectId);

      var _project$tasks$filter = _slicedToArray(project.tasks.filter(function (p) {
        return p.number === number;
      }).models, 1),
          task = _project$tasks$filter[0];

      task.comments.models.forEach(function (comment) {
        generateCommentMentions(schema, comment);
      });

      return task;
    });

    this.patch('/projects/:id', function (schema) {
      // the API takes takes markdown and renders body
      var attrs = this.normalizedRequestAttrs();
      var project = schema.projects.find(attrs.id);
      attrs.longDescriptionBody = '<p>' + attrs.longDescriptionMarkdown + '</p>';
      return project.update(attrs);
    });

    /**
    * Roles
    */

    this.get('/roles', { coalesce: true });
    this.post('/roles');
    this.get('/roles/:id');

    /**
    * Role Skills
    */

    this.get('/role-skills', { coalesce: true });
    this.post('/role-skills');
    this.get('/role-skills/:id');
    this.delete('/role-skills/:id');

    /**
    * Slugs and slugged routes
    */

    // GET /:slug
    this.get('/:slug', function (schema, request) {
      if (routes.includes(request.params.slug)) {
        console.error('API route being caught in /:slug in mirage/config.js', request.params.slug);
      }
      return schema.sluggedRoutes.where({ 'slug': request.params.slug }).models[0];
    });

    // GET /:slug/projects
    this.get('/:slug/projects', function (schema, request) {
      var slug = request.params.slug;

      var _schema$organizations = _slicedToArray(schema.organizations.where({ slug: slug }).models, 1),
          organization = _schema$organizations[0];

      return organization.projects;
    });

    // GET /:slug/:project_slug
    this.get('/:sluggedRouteSlug/:projectSlug', function (schema, request) {
      var _request$params = request.params,
          sluggedRouteSlug = _request$params.sluggedRouteSlug,
          projectSlug = _request$params.projectSlug;

      var _schema$sluggedRoutes = _slicedToArray(schema.sluggedRoutes.where({ 'slug': sluggedRouteSlug }).models, 1),
          sluggedRoute = _schema$sluggedRoutes[0];

      if (!sluggedRoute) {
        // If there's no slugged route, we likely added a new route and didn't
        // `routes` array above.
        console.error('Did you add a new route under /' + sluggedRouteSlug + ' (/' + projectSlug + ') without adding it to mirage/config.js?');
      }

      return sluggedRoute.organization.projects.filter(function (p) {
        return p.slug === projectSlug;
      }).models[0];
    });

    /**
    * Skills
    */

    this.get('/skills', { coalesce: true });
    this.post('/skills');
    this.get('/skills/:id');

    /**
     * Stripe connect accounts
     */

    this.post('/stripe-connect-accounts', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      attrs.recipientStatus = 'required';
      return schema.create('stripeConnectAccount', attrs);
    });

    this.get('/stripe-connect-accounts/:id');

    this.patch('/stripe-connect-accounts/:id', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var stripeConnectAccount = schema.stripeConnectAccounts.find(attrs.id);

      if (!isEmpty(attrs.legalEntityAddressCity)) {
        attrs.recipientStatus = 'verifying';
        attrs.personalIdNumberStatus = 'required';
      }

      if (!isEmpty(attrs.legalEntityPersonalIdNumber)) {
        attrs.personalIdNumberStatus = 'verified';
        attrs.verificationDocumentStatus = 'required';
      }

      if (!isEmpty(attrs.legalEntityVerificationDocument)) {
        attrs.recipientStatus = 'verified';
        attrs.verificationDocumentStatus = 'verified';
        attrs.bankAccountStatus = 'required';
      }

      if (!isEmpty(attrs.externalAccount)) {
        attrs.bankAccountStatus = 'verified';
      }

      return stripeConnectAccount.update(attrs);
    });

    /**
     * Stripe plans
     */

    this.post('/stripe-connect-plans');
    this.get('/stripe-connect-plans/:id');

    /**
     * Stripe platform cards
     */

    this.post('/stripe-platform-cards');
    this.get('/stripe-platform-cards/:id');

    /**
     * Stripe customers
     */

    this.post('/stripe-platform-customers');
    this.get('/stripe-platform-customers/:id');

    /**
     * Stripe subscriptions
     */

    this.post('/stripe-connect-subscriptions');
    this.get('/stripe-connect-subscriptions/:id');

    /**
    * Task lists
    */

    this.get('/task-lists', { coalesce: true });
    this.get('/task-lists/:id');

    /**
    * Task user mentions
    */

    // GET /task-user-mentions
    this.get('/task-user-mentions', function (schema, request) {
      var taskId = request.queryParams.task_id;
      var task = schema.tasks.find(taskId);

      generateTaskMentions(schema, task);

      return schema.taskUserMentions.where({ taskId: taskId });
    });

    /**
    * Tasks
    */

    // GET /tasks
    this.get('/tasks', { coalesce: true });

    // POST /tasks
    this.post('/tasks', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var project = schema.projects.find(attrs.projectId);

      // the API takes takes markdown and renders body
      attrs.body = '<p>' + attrs.markdown + '</p>';

      // the API sets task number as an auto-incrementing value, scoped
      // to project, so we need to simulate that here
      attrs.number = project.tasks.models.length + 1;

      return schema.create('task', attrs);
    });

    // GET /tasks/:id
    this.get('/tasks/:id');

    // PATCH /tasks/:id
    this.patch('/tasks/:id', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var task = schema.tasks.find(attrs.id);

      // the API takes takes markdown and renders body
      attrs.body = '<p>' + attrs.markdown + '</p>';

      task.taskUserMentions.models.forEach(function (mention) {
        return mention.destroy();
      });
      task.order = (task.position || 0) * 100;
      return task.update(attrs);
    });

    /**
    * Task skills
    */

    this.get('/task-skills', { coalesce: true });
    this.post('/task-skills');
    this.get('/task-skills/:id');
    this.delete('/task-skills/:id');

    /**
    * Token
    */

    // POST /token
    this.post('/token', function (schema, request) {
      var json = JSON.parse(request.requestBody);

      var _schema$users$where3 = schema.users.where({ email: json.username, password: json.password }),
          models = _schema$users$where3.models;

      if (models.length > 0) {
        return {
          // token encoded at https://jwt.io/
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJvd25lckBjb2RlY29ycHMub3JnIiwidXNlcl9pZCI6MSwiZXhwIjo3MjAwMDAwMH0.LxkkKMcQoccAA0pphgRfXPSLdyaCawlK1gB3yPCht2s',
          user_id: models[0].id
        };
      } else {
        var errorDetail = 'Your password doesn\'t match the email ' + json.username + '.';
        return new _emberCliMirage.default.Response(401, {}, {
          errors: [{
            id: 'UNAUTHORIZED',
            title: '401 Unauthorized',
            detail: errorDetail,
            status: 401
          }]
        });
      }
    });

    /**
    * Users
    */

    this.get('/users', { coalesce: true });

    this.post('/users', function (schema) {
      var _normalizedRequestAtt2 = this.normalizedRequestAttrs(),
          email = _normalizedRequestAtt2.email,
          password = _normalizedRequestAtt2.password,
          username = _normalizedRequestAtt2.username,
          _normalizedRequestAtt3 = _normalizedRequestAtt2.state,
          state = _normalizedRequestAtt3 === undefined ? 'signed_up' : _normalizedRequestAtt3,
          signUpContext = _normalizedRequestAtt2.signUpContext;

      var user = schema.create('user', { email: email, password: password, state: state, username: username, signUpContext: signUpContext });
      schema.create('sluggedRoute', { slug: user.username, user: user });
      return user;
    });

    this.get('/users/:id');

    // PATCH /users/:id
    this.patch('/users/:id', function (schema) {
      var attrs = this.normalizedRequestAttrs();
      var userId = attrs.id;
      var user = schema.users.find(userId);

      // Mock out state machine
      if (!isEmpty(attrs.stateTransition)) {
        switch (attrs.stateTransition) {
          case 'edit_profile':
            attrs.state = 'edited_profile';
            break;
          case 'select_categories':
            attrs.state = 'selected_categories';
            break;
          case 'select_roles':
            attrs.state = 'selected_roles';
            break;
          case 'select_skills':
            attrs.state = 'selected_skills';
            break;
          default:
            console.error('You added a transition without changing the state machine in Mirage.');
            break;
        }
      }

      return user.update(attrs);
    });

    // GET /users/email_available
    this.get('/users/email_available', function (schema, request) {
      var email = request.queryParams.email;

      var _schema$users$where4 = schema.users.where({ email: email }),
          models = _schema$users$where4.models;

      var available = models.length === 0;
      return { available: available, valid: true };
    });

    // GET /users/username_available
    this.get('/users/username_available', function (schema, request) {
      var username = request.queryParams.username;

      var _schema$users$where5 = schema.users.where({ username: username }),
          models = _schema$users$where5.models;

      var available = models.length === 0;
      return { available: available, valid: true };
    });

    /**
    * User categories
    */

    // GET /user-categories
    this.get('/user-categories', { coalesce: true });

    // POST /user-categories
    this.post('/user-categories');

    // GET /user-categories/:id
    this.get('/user-categories/:id');

    // DELETE /user-categories/:id
    this.delete('/user-categories/:id');

    /**
    * User roles
    */

    this.get('/user-roles', { coalesce: true });
    this.post('/user-roles');
    this.get('/user-roles/:id');
    this.delete('/user-roles/:id');

    /**
    * User skills
    */

    this.get('/user-skills', { coalesce: true });
    this.post('/user-skills');
    this.get('/user-skills/:id');
    this.delete('/user-skills/:id');

    /**
    * User tasks
    */

    this.get('/user-tasks', { coalesce: true });
    this.patch('/user-tasks/:id');
    this.post('/user-tasks');
    this.get('/user-tasks/:id');
    this.delete('/user-tasks/:id');

    // Create a passthrough for ember-cli-code-coverage
    // https://github.com/kategengler/ember-cli-code-coverage
    this.passthrough('/write-coverage');
  };

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var isEmpty = Ember.isEmpty;


  function generateCommentMentions(schema, comment) {
    var body = comment.body || '';
    var matches = body.match(/@\w+/g) || [];

    matches.forEach(function (match) {
      var username = match.substr(1);

      var _schema$users$where$m = _slicedToArray(schema.users.where({ username: username }).models, 1),
          matchedUser = _schema$users$where$m[0];

      if (matchedUser) {
        var startIndex = body.indexOf(match);
        var endIndex = startIndex + match.length - 1;
        schema.create('commentUserMention', {
          username: username,
          indices: [startIndex, endIndex],
          userId: matchedUser.id,
          commentId: comment.id,
          taskId: comment.taskId
        });
      }
    });
  }

  function generateTaskMentions(schema, task) {
    var body = task.body || '';
    var matches = body.match(/@\w+/g) || [];

    matches.forEach(function (match) {
      var username = match.substr(1);

      var _schema$users$where$m2 = _slicedToArray(schema.users.where({ username: username }).models, 1),
          matchedUser = _schema$users$where$m2[0];

      if (matchedUser) {
        var startIndex = body.indexOf(match);
        var endIndex = startIndex + match.length - 1;
        schema.taskUserMentions.create({
          username: username,
          indices: [startIndex, endIndex],
          userId: matchedUser.id,
          taskId: task.id
        });
      }
    });
  }

  function generatePreviewMentions(schema, preview) {
    var body = preview.body || '';
    var matches = body.match(/@\w+/g) || [];

    matches.forEach(function (match) {
      var username = match.substr(1);

      var _schema$users$where = schema.users.where({ username: username }),
          _schema$users$where2 = _slicedToArray(_schema$users$where, 1),
          matchedUser = _schema$users$where2[0];

      if (matchedUser) {
        var startIndex = body.indexOf(match);
        var endIndex = startIndex + match.length - 1;
        schema.previewUserMentions.create({
          username: username,
          indices: [startIndex, endIndex],
          userId: matchedUser.id,
          previewId: preview.id
        });
      }
    });
  }

  // The set of routes we have defined; needs updated when adding new routes
  var routes = ['categories', 'comment-user-mentions', 'comments', 'donation-goals', 'github-events', 'organizations', 'task-lists', 'task-skills', 'task-user-mentions', 'tasks', 'previews', 'projects', 'project-categories', 'slugged-routes', 'stripe-connect-accounts', 'stripe-connect-subscriptions', 'stripe-connect-plans', 'stripe-platform-cards', 'stripe-platform-customers', 'user-categories', 'users'];
});