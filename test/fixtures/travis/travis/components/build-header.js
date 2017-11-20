define('travis/components/build-header', ['exports', 'ember-decorators/object', 'travis/utils/duration-from', 'ember-decorators/service'], function (exports, _object, _durationFrom, _service) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _desc, _value, _obj, _init;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('item.{build,id,jobs}'), _dec2 = (0, _object.computed)('item.build'), _dec3 = (0, _object.computed)('isJob'), _dec4 = (0, _object.computed)('item.eventType'), _dec5 = (0, _object.computed)('repo.slug', 'commit.sha'), _dec6 = (0, _object.computed)('item.startedAt', 'item.finishedAt'), _dec7 = (0, _object.computed)('item.repo.slug', 'build.branchName'), _dec8 = (0, _object.computed)('item.repo.slug', 'build.tag.name'), _dec9 = (0, _object.computed)('item.jobs.firstObject.state', 'item.state', 'item.isMatrix'), (_obj = { externalLinks: null,

    tagName: 'section',
    classNames: ['build-header'],
    classNameBindings: ['item.state'],
    attributeBindings: ['jobId:data-job-id'],

    jobId: function jobId(build, id, jobs) {
      if (build) {
        return id;
      } else {
        var ids = [];
        jobs = jobs || [];
        jobs.forEach(function (item) {
          ids.push(item.id);
        });
        return ids.join(' ');
      }
    },
    isJob: function isJob(build) {
      if (build) {
        return true;
      }
      return false;
    },
    build: function build(isJob) {
      if (isJob) {
        return this.get('item.build');
      } else {
        return this.get('item');
      }
    },
    displayCompare: function displayCompare(eventType) {
      return !['api', 'cron'].includes(eventType);
    },
    urlGithubCommit: function urlGithubCommit(slug, sha) {
      return this.get('externalLinks').githubCommit(slug, sha);
    },
    elapsedTime: function elapsedTime(startedAt, finishedAt) {
      return (0, _durationFrom.default)(startedAt, finishedAt);
    },
    urlGitHubBranch: function urlGitHubBranch(slug, branchName) {
      return this.get('externalLinks').githubBranch(slug, branchName);
    },
    urlGitHubTag: function urlGitHubTag(slug, tag) {
      return this.get('externalLinks').githubTag(slug, tag);
    },
    buildState: function buildState(jobState, _buildState, isMatrix) {
      if (isMatrix) {
        return _buildState;
      } else {
        return jobState || _buildState;
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'jobId', [_dec], Object.getOwnPropertyDescriptor(_obj, 'jobId'), _obj), _applyDecoratedDescriptor(_obj, 'isJob', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'isJob'), _obj), _applyDecoratedDescriptor(_obj, 'build', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'build'), _obj), _applyDecoratedDescriptor(_obj, 'displayCompare', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'displayCompare'), _obj), _applyDecoratedDescriptor(_obj, 'urlGithubCommit', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'urlGithubCommit'), _obj), _applyDecoratedDescriptor(_obj, 'elapsedTime', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'elapsedTime'), _obj), _applyDecoratedDescriptor(_obj, 'urlGitHubBranch', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'urlGitHubBranch'), _obj), _applyDecoratedDescriptor(_obj, 'urlGitHubTag', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'urlGitHubTag'), _obj), _applyDecoratedDescriptor(_obj, 'buildState', [_dec9], Object.getOwnPropertyDescriptor(_obj, 'buildState'), _obj)), _obj)));
});