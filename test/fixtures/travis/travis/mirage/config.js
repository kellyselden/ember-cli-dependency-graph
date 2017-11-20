define('travis/mirage/config', ['exports', 'ember-cli-mirage', 'travis/config/environment'], function (exports, _emberCliMirage, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    this.get('https://pnpcptp8xh9k.statuspage.io/api/v2/status.json', function () {
      return {
        'page': {
          'id': 'pnpcptp8xh9k',
          'name': 'Travis CI',
          'url': 'https://www.traviscistatus.com',
          'updated_at': '2017-06-06T09:49:24.032Z'
        },
        'status': {
          'indicator': 'none',
          'description': 'AllSystems Operational'
        }
      };
    });

    this.urlPrefix = apiEndpoint;
    this.namespace = '';

    this.get('/users/:id');
    this.get('/accounts', function (schema /* , request*/) {
      var users = schema.users.all().models.map(function (user) {
        return Ember.merge(user.attrs, { type: 'user' });
      });
      var accounts = schema.accounts.all().models.map(function (account) {
        return account.attrs;
      });

      return { accounts: users.concat(accounts) };
    });

    this.get('/users/:id', function (_ref, request) {
      var users = _ref.users;

      if (request.requestHeaders.Authorization === 'token testUserToken') {
        return this.serialize(users.find(request.params.id), 'v2');
      } else {
        return new _emberCliMirage.default.Response(403, {}, {});
      }
    });

    this.get('/users/permissions', function (schema, request) {
      var token = request.requestHeaders.Authorization.split(' ')[1];
      var user = schema.users.where({ token: token }).models[0];

      if (user) {
        var permissions = schema.permissions.where({ userId: user.id });

        return permissions.models.reduce(function (combinedPermissions, permissions) {
          ['admin', 'push', 'pull', 'permissions'].forEach(function (property) {
            if (permissions.attrs[property]) {
              combinedPermissions[property].push(parseInt(permissions.repositoryId));
            }
          });

          return combinedPermissions;
        }, {
          admin: [],
          push: [],
          pull: [],
          permissions: []
        });
      } else {
        return {};
      }
    });

    this.get('/broadcasts', function (schema) {
      return schema.broadcasts.all();
    });

    this.get('/repos', function (schema, request) {
      // search apparently still uses v2, so different response necessary
      var query = request.queryParams.search;
      if (query) {
        var allRepositories = schema.repositories.all();
        var filtered = allRepositories.models.filter(function (repo) {
          return repo.attrs.slug.includes(query);
        });
        return {
          repos: filtered
        };
      }

      var repos = schema.repositories.all();

      var starred = request.queryParams['starred'];
      if (starred) {
        repos = repos.filter(function (repo) {
          return repo.starred;
        });
      }

      // standard v3 response returning all repositories
      return repos;
    });

    this.get('/repo/:slug_or_id', function (schema, request) {
      if (request.params.slug_or_id.match(/^\d+$/)) {
        return schema.repositories.find(request.params.slug_or_id);
      } else {
        var slug = request.params.slug_or_id;
        var repos = schema.repositories.where({ slug: decodeURIComponent(slug) });

        return repos.models[0];
      }
    });

    this.get('/repo/:repositoryId/crons', function (schema, request) {
      var repositoryId = request.params.repositoryId;

      return this.serialize(schema.crons.where({ repositoryId: repositoryId }), 'cron');
    });

    this.post('/repo/:repositoryId/activate', function (schema, request) {
      var repositoryId = request.params.repositoryId;

      var repository = schema.repositories.find(repositoryId);

      if (repository) {
        repository.update('active', true);
      }

      return this.serialize(repository);
    });

    this.post('/repo/:repositoryId/deactivate', function (schema, request) {
      var repositoryId = request.params.repositoryId;

      var repository = schema.repositories.find(repositoryId);

      if (repository) {
        repository.update('active', false);
      }

      return this.serialize(repository);
    });

    this.get('/cron/:id');

    this.get('/repo/:id/settings', function (schema, request) {
      var settings = schema.settings.where({ repositoryId: request.params.id });
      var formattedSettings = settings.models.map(function (setting) {
        return {
          name: setting.attrs.name,
          value: setting.attrs.value
        };
      });

      return {
        // This simulates a possible API bug: https://github.com/travis-pro/team-teal/issues/2023
        settings: formattedSettings.concat(null)
      };
    });

    this.get('/repos/:id/caches', function (schema, request) {
      var caches = schema.caches.where({ repositoryId: request.params.id });
      return this.serialize(caches, 'v2');
    });

    this.patch('/settings/ssh_key/:repository_id', function (schema, request) {
      var sshKeys = schema.sshKeys.where({ repositoryId: request.queryParams.repository_id });

      var _sshKeys$models = _slicedToArray(sshKeys.models, 1),
          sshKey = _sshKeys$models[0];

      if (sshKey) {
        return {
          ssh_key: {
            id: sshKey.id,
            description: sshKey.description,
            value: sshKey.value
          }
        };
      } else {
        var created = server.create('ssh_key', request.params);
        return {
          ssh_key: {
            id: created.id,
            description: created.description,
            value: created.value
          }
        };
      }
    });

    this.post('/settings/env_vars', function (schema, request) {
      var envVar = server.create('env_var', request.params);
      return {
        env_var: {
          id: envVar.id,
          name: envVar.name,
          public: envVar.public,
          repository_id: request.params.repository_id
        }
      };
    });

    this.get('/settings/env_vars', function (schema, request) {
      var envVars = schema.envVars.where({ repositoryId: request.queryParams.repository_id });

      return {
        env_vars: envVars.models.map(function (envVar) {
          envVar.attrs.repository_id = envVar.repositoryId;
          return envVar;
        })
      };
    });

    this.get('/repo/:repository_id/branches', function (schema) {
      return schema.branches.all();
    });

    this.get('/repo/:repository_id/branch/:branch', function (schema, request) {
      var id = '/v3/repo/' + request.params.repository_id + '/branch/' + request.params.branch;
      return this.serialize(schema.branches.find(id));
    });

    this.get('/settings/ssh_key/:repo_id', function (schema, request) {
      var sshKeys = schema.sshKeys.where({
        repositoryId: request.params.repo_id,
        type: 'custom'
      }).models[0];
      return this.serialize(sshKeys, 'v2');
    });

    this.get('/owner/:login', function (schema, request) {
      var owner = schema.users.where({ login: request.params.login }).models[0];
      if (owner) {
        return this.serialize(owner, 'owner');
      } else {
        return new _emberCliMirage.default.Response(404, {}, {});
      }
    });

    this.get('/owner/:login/repos', function (schema, request) {
      var login = request.params.login;

      var repositories = schema.repositories.all().filter(function (repo) {
        return repo.owner.login === login;
      });
      var queryParams = request.queryParams;

      if (queryParams && queryParams.sort_by) {
        repositories.models = repositories.models.sortBy(queryParams.sort_by);
      }
      return this.serialize(repositories);
    });

    this.delete('/settings/ssh_key/:repo_id', function (schema, request) {
      schema.sshKeys.where({ repositoryId: request.queryParams.repository_id }).models.map(function (sshKey) {
        return sshKey.destroyRecord();
      });

      return new _emberCliMirage.default.Response(204, {}, {});
    });

    this.get('/settings/ssh_key/:repo_id', function (schema, request) {
      var repo = schema.repositories.find(request.params.repo_id);
      var customSshKey = repo.customSshKey;

      return {
        ssh_key: {
          id: 1,
          description: customSshKey.description,
          fingerprint: customSshKey.fingerprint
        }
      };
    });

    this.get('/repos/:id/key', function (schema, request) {
      var repo = schema.repositories.find(request.params.id);
      var defaultSshKey = repo.defaultSshKey;

      return {
        fingerprint: defaultSshKey.fingerprint,
        key: '-----BEGIN PUBLIC KEY-----'
      };
    });

    this.get('/job/:id', function (schema, request) {
      var job = schema.jobs.find(request.params.id);
      return this.serialize(job, 'job');
    });

    this.get('/jobs/:id', function (schema, request) {
      var job = schema.jobs.find(request.params.id);
      return this.serialize(job, 'v2-job');
    });

    this.get('/jobs', function (schema, request) {
      if (request.requestHeaders['Travis-API-Version'] === '3') {
        var jobs = schema.jobs;
        if (request.queryParams.active) {
          jobs = jobs.where(function (j) {
            return ['created', 'queued', 'received', 'started'].includes(j.state);
          });
        }

        if (request.queryParams.state) {
          var states = request.queryParams.state.split(',');
          jobs = jobs.where(function (j) {
            return states.includes(j.state);
          });
        }

        return jobs.all ? jobs.all() : jobs;
      } else {
        var _jobs = schema.jobs;
        var ids = request.queryParams.ids;
        if (ids) {
          _jobs = _jobs.where(function (j) {
            return ids.includes(j.id.toString());
          });
        }
        _jobs = _jobs.all ? _jobs.all() : _jobs;
        return this.serialize(_jobs, 'v2-job');
      }
    });

    this.get('/build/:id/jobs', function (schema, request) {
      request.noPagination = true;
      return schema.jobs.where({ buildId: request.params.id });
    });

    this.get('/build/:id/stages', function (schema, request) {
      return schema.stages.where({ buildId: request.params.id });
    });

    this.get('/build/:id');

    this.post('/build/:id/restart', function (schema, request) {
      var build = schema.builds.find(request.params.id);
      if (build) {
        return {
          flash: [{ notice: 'The build was successfully restarted.' }],
          result: true
        };
      } else {
        return new _emberCliMirage.default.Response(404, {}, {});
      }
    });

    this.post('/build/:id/cancel', function (schema, request) {
      var build = schema.builds.find(request.params.id);
      if (build) {
        return new _emberCliMirage.default.Response(204, {}, {});
      } else {
        return new _emberCliMirage.default.Response(404, {}, {});
      }
    });

    this.post('/job/:id/restart', function (schema, request) {
      var job = schema.jobs.find(request.params.id);
      if (job) {
        return {
          flash: [{ notice: 'The job was successfully restarted.' }],
          result: true
        };
      } else {
        return new _emberCliMirage.default.Response(404, {}, {});
      }
    });

    this.post('/job/:id/cancel', function (schema, request) {
      var job = schema.jobs.find(request.params.id);
      if (job) {
        return new _emberCliMirage.default.Response(204, {}, {});
      } else {
        return new _emberCliMirage.default.Response(404, {}, {});
      }
    });

    this.get('/repo/:repo_id/builds', function (schema, request) {
      var builds = schema.builds.where({ repositoryId: request.params.repo_id });

      var branchName = request.queryParams['branch.name'];
      if (branchName) {
        builds = builds.filter(function (build) {
          return (build.branch && build.branch.attrs.name) === branchName;
        });
      }

      if (request.queryParams.event_type !== 'pull_request') {
        builds = builds.filter(function (build) {
          return build.attrs.event_type !== 'pull_request';
        });
      } else {
        builds = builds.filter(function (build) {
          return build.attrs.event_type === 'pull_request';
        });
      }

      if (!request.queryParams.sort_by) {
        builds = builds.sort(function (a, b) {
          return parseInt(a.number) > parseInt(b.number) ? -1 : 1;
        });
      } else if (request.queryParams.sort_by === 'finished_at:desc') {
        builds = builds.sort(function (a, b) {
          var aBuildNumber = parseInt(a.attrs.number);
          var bBuildNumber = parseInt(b.attrs.number);

          return aBuildNumber > bBuildNumber ? -1 : 1;
        });
      }

      /*
       * TODO remove this once the seializers/build is removed.
       * The modelName causes Mirage to know how to serialise it.
       */
      return this.serialize(builds, 'build');
    });

    this.post('/repo/:repo_id/requests', function (schema, request) {
      var requestBody = JSON.parse(request.requestBody);
      var fakeRequestId = 5678;
      var repository = schema.find('repository', request.params.repo_id);
      server.create('build', { number: '2', id: 9999, repository: repository, state: 'started' });

      return new _emberCliMirage.default.Response(200, {}, {
        request: {
          id: fakeRequestId,
          message: requestBody.request.message,
          branch: requestBody.request.branch,
          config: requestBody.request.config
        },
        resource_type: 'request'
      });
    });

    this.get('/repo/:repo_id/request/:request_id', function (schema, request) {
      var build = schema.builds.find(9999);

      return new _emberCliMirage.default.Response(200, {}, {
        id: request.params.request_id,
        result: 'approved',
        builds: [build]
      });
    });

    this.get('/jobs/:id/log', function (schema, request) {
      var log = schema.logs.find(request.params.id);
      if (log) {
        return { log: { parts: [{ id: log.attrs.id, number: 1, content: log.attrs.content }] } };
      } else {
        return new _emberCliMirage.default.Response(404, {}, {});
      }
    });

    this.get('/user/:user_id/beta_features', function (schema) {
      return this.serialize(schema.features.all());
    });

    this.put('/user/:user_id/beta_feature/:feature_id', function (schema, request) {
      var feature = schema.features.find(request.params.feature_id);
      var requestBody = JSON.parse(request.requestBody);
      feature.update('enabled', requestBody.enabled);
      return this.serialize(feature);
    });

    this.post('/repo/:repo_id/star', function (schema, request) {
      var repo = schema.repositories.find(request.params.repo_id);
      repo.update('starred', true);
    });

    this.post('/repo/:repo_id/unstar', function (schema, request) {
      var repo = schema.repositories.find(request.params.repo_id);
      repo.update('starred', false);
    });
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

  var apiEndpoint = _environment.default.apiEndpoint;
});