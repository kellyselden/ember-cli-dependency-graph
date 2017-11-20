define('package-hint-historic-resolver/components/dependency-component', ['exports', 'ember-computed-decorators', 'ember-awesome-macros'], function (exports, _emberComputedDecorators, _emberAwesomeMacros) {
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

  var _dec, _desc, _value, _obj;

  var Component = Ember.Component;
  var service = Ember.inject.service;
  var get = Ember.get;
  var readOnly = Ember.computed.readOnly;
  exports.default = Component.extend((_dec = (0, _emberComputedDecorators.default)((0, _emberAwesomeMacros.hash)('firstJson', 'secondJson', 'repoWorkingDate', 'repoBrokenDate')), (_obj = {
    treeBuilder: service(),

    isRepoUrlInvalid: (0, _emberAwesomeMacros.and)('repoUrl', (0, _emberAwesomeMacros.not)('repo')),

    dependencyGroups: function dependencyGroups(hash) {
      return get(this, 'treeBuilder').getDependencyGroups(hash);
    },


    // to reuse the crawling logic
    dependencies: readOnly('dependencyGroups'),

    shouldShowTables: (0, _emberAwesomeMacros.and)('repo', (0, _emberAwesomeMacros.not)('repoWorkingDateError'), (0, _emberAwesomeMacros.not)('repoBrokenDateError'), (0, _emberAwesomeMacros.not)('firstCommitError'), (0, _emberAwesomeMacros.not)('secondCommitError'), (0, _emberAwesomeMacros.not)('areDatesOutOfOrder')),

    didInsertElement: function didInsertElement() {
      get(this, 'treeBuilder').setupComputeds(this, false);
    },
    willDestroyElement: function willDestroyElement() {
      get(this, 'treeBuilder').cancelAll();
    },


    actions: {
      changeRepoUrl: function changeRepoUrl(url) {
        this.sendAction('repoUrlUpdated', url);
      },
      changeRepoWorkingDate: function changeRepoWorkingDate(date) {
        this.sendAction('repoWorkingDateUpdated', date);
      },
      changeRepoBrokenDate: function changeRepoBrokenDate(date) {
        this.sendAction('repoBrokenDateUpdated', date);
      },
      toggleCrawling: function toggleCrawling() {
        var treeBuilder = get(this, 'treeBuilder');
        var stopCrawling = this.toggleProperty('stopCrawling');
        if (stopCrawling) {
          treeBuilder.cancelAll();
        } else {
          var repoWorkingDate = get(this, 'repoWorkingDate');
          var repoBrokenDate = get(this, 'repoBrokenDate');
          treeBuilder.restartAll(this, repoWorkingDate, repoBrokenDate);
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'dependencyGroups', [_dec], Object.getOwnPropertyDescriptor(_obj, 'dependencyGroups'), _obj)), _obj)));
});