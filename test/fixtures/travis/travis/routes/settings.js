define('travis/routes/settings', ['exports', 'travis/routes/basic', 'travis/config/environment', 'ember-decorators/service'], function (exports, _basic, _environment, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _desc, _value, _obj, _init;

  var hash = Ember.RSVP.hash;
  var $ = Ember.$;
  var EmberObject = Ember.Object;
  exports.default = _basic.default.extend((_obj = { ajax: null,

    needsAuth: true,

    setupController: function setupController(controller, model) {
      this._super.apply(this, arguments);
      controller.set('repo', this.modelFor('repo'));
      this.controllerFor('repo').activate('settings');
      return controller.set('concurrentBuildsLimit', !!model.settings.maximum_number_of_builds);
    },

    fetchEnvVars: function fetchEnvVars() {
      var repo = this.modelFor('repo');
      return repo.get('envVars.promise');
    },
    fetchCronJobs: function fetchCronJobs() {
      var repo = this.modelFor('repo');
      var canCreateCron = repo.get('permissions.create_cron');

      if (canCreateCron) {
        return EmberObject.create({
          enabled: true,
          jobs: repo.get('cronJobs')
        });
      } else {
        return EmberObject.create({
          enabled: false,
          jobs: []
        });
      }
    },
    fetchBranches: function fetchBranches() {
      var repo = this.modelFor('repo');
      return repo.get('branches.promise');
    },
    fetchCustomSshKey: function fetchCustomSshKey() {
      if (_environment.default.endpoints.sshKey) {
        var repo = this.modelFor('repo');
        return this.store.find('ssh_key', repo.get('id')).then(function (result) {
          if (!result.get('isNew')) {
            return result;
          }
        }, function (xhr) {
          if (xhr.status === 404) {
            return false;
          }
        });
      }
    },
    fetchSshKey: function fetchSshKey() {
      if (_environment.default.endpoints.sshKey) {
        var repo = this.modelFor('repo');
        var url = '/repos/' + repo.get('id') + '/key';
        return this.get('ajax').get(url, function (data) {
          var fingerprint = EmberObject.create({
            fingerprint: data.fingerprint
          });
          return fingerprint;
        });
      }
    },
    fetchRepositoryActiveFlag: function fetchRepositoryActiveFlag() {
      var repoId = this.modelFor('repo').get('id');
      var url = _environment.default.apiEndpoint + '/repo/' + repoId;
      return $.ajax(url, {
        headers: {
          Authorization: 'token ' + this.auth.token(),
          'Travis-API-Version': '3'
        }
      }).then(function (response) {
        return response.active;
      });
    },
    hasPushAccess: function hasPushAccess() {
      var repoId = parseInt(this.modelFor('repo').get('id'));
      return this.auth.get('currentUser').get('pushPermissionsPromise').then(function (permissions) {
        var hasPushAccess = permissions.filter(function (p) {
          return p === repoId;
        });
        return hasPushAccess;
      });
    },
    model: function model() {
      return hash({
        settings: this.modelFor('repo').fetchSettings(),
        envVars: this.fetchEnvVars(),
        cronJobs: this.fetchCronJobs(),
        branches: this.fetchBranches(),
        sshKey: this.fetchSshKey(),
        customSshKey: this.fetchCustomSshKey(),
        hasPushAccess: this.hasPushAccess(),
        repositoryActive: this.fetchRepositoryActiveFlag()
      });
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});