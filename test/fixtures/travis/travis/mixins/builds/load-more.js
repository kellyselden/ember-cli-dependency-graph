define('travis/mixins/builds/load-more', ['exports', 'ember-decorators/service'], function (exports, _service) {
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

  var Mixin = Ember.Mixin;
  exports.default = Mixin.create((_obj = { tabStates: null,

    showMore: function showMore() {
      var id = this.get('repo.id'),
          buildsLength = this.get('builds.length');
      var number = this.get('builds.lastObject.number');

      var defaultBranchLastBuildNumber = this.get('repo.defaultBranch.lastBuild.number');

      /**
        * This is a hackish fix for a bug involving a gap in the build history list.
        * The repos endpoint includes the last build on the default build, and
        * if there hasn’t been a build on it in a while, the build history query will
        * only show the 20 most recent builds, so there will be a gap before the default
        * branch build. Without this workaround, clicking the Show More button will
        * not load the builds within the gap.
        */
      if (number === defaultBranchLastBuildNumber) {
        var builds = this.get('builds');

        if (builds.length > 2) {
          number = builds[builds.length - 2].get('number');
        }
      }

      var tabName = this.get('tabStates.mainTab');
      var singularTab = tabName.substr(0, tabName.length - 1);
      var type = tabName === 'builds' ? 'push' : singularTab;
      this.loadMoreBuilds(id, buildsLength, type);
    },
    loadMoreBuilds: function loadMoreBuilds(id, buildsLength, type) {
      var options = {
        repository_id: id,
        offset: buildsLength
      };
      if (type != null) {
        options.event_type = type.replace(/s$/, '');
        if (options.event_type === 'push') {
          options.event_type = ['push', 'api', 'cron'];
        }
      }
      return this.store.query('build', options);
    },


    actions: {
      showMoreBuilds: function showMoreBuilds() {
        return this.showMore();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});