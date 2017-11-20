define('travis/components/branch-row', ['exports', 'travis/config/environment', 'ember-decorators/object', 'ember-decorators/service'], function (exports, _environment, _object, _service) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2, _init3;

  var run = Ember.run;
  var EmberObject = Ember.Object;
  var $ = Ember.$;
  var ArrayProxy = Ember.ArrayProxy;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('branch.repository.slug', 'branch.last_build.commit.sha'), _dec2 = (0, _object.computed)(), (_obj = { router: null,
    permissions: null,
    externalLinks: null,

    tagName: 'li',
    classNameBindings: ['branch.last_build.state'],
    classNames: ['branch-row', 'row-li'],
    isLoading: false,
    isTriggering: false,
    hasTriggered: false,

    urlGithubCommit: function urlGithubCommit(slug, sha) {
      return this.get('externalLinks').githubCommit(slug, sha);
    },
    getLast5Builds: function getLast5Builds() {
      var apiEndpoint = void 0,
          branchName = void 0,
          lastBuilds = void 0,
          options = void 0,
          repoId = void 0;
      lastBuilds = ArrayProxy.create({
        content: [{}, {}, {}, {}, {}],
        isLoading: true,
        count: 0
      });
      if (!this.get('branch.last_build')) {
        lastBuilds.set('isLoading', false);
      } else {
        apiEndpoint = _environment.default.apiEndpoint;
        repoId = this.get('branch.repository.id');
        branchName = this.get('branch.name');
        options = {
          headers: {
            'Travis-API-Version': '3'
          }
        };
        if (this.get('auth.signedIn')) {
          options.headers.Authorization = 'token ' + this.auth.token();
        }
        var path = apiEndpoint + '/repo/' + repoId + '/builds';
        var params = '?branch.name=' + branchName + '&limit=5&build.event_type=push,api,cron';
        var url = '' + path + params;

        $.ajax(url, options).then(function (response) {
          var array = void 0,
              i = void 0,
              ref = void 0;
          array = response.builds.map(function (build) {
            return EmberObject.create(build);
          });
          // TODO: Clean this up, all we want to do is have 5 elements no matter
          // what. This code doesn't express that very well.
          if (array.length < 5) {
            for (i = 1, ref = 5 - array.length; i <= ref; i += 1) {
              array.push({});
            }
          }

          run(function () {
            lastBuilds.set('count', response['@pagination'].count);
            lastBuilds.set('content', array);
            lastBuilds.set('isLoading', false);
          });
        });
      }
      return lastBuilds;
    },


    actions: {
      viewAllBuilds: function viewAllBuilds() {
        return this.get('router').transitionTo('builds');
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'router', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'router'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'permissions', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'permissions'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'urlGithubCommit', [_dec], Object.getOwnPropertyDescriptor(_obj, 'urlGithubCommit'), _obj), _applyDecoratedDescriptor(_obj, 'getLast5Builds', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'getLast5Builds'), _obj)), _obj)));
});