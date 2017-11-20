define('travis/controllers/settings', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _object.computed)('unsortedEnvVars'), _dec2 = (0, _computed.filterBy)('model.envVars', 'isNew', false), _dec3 = (0, _computed.alias)('model.cronJobs.jobs.[]'), _dec4 = (0, _object.computed)('cronJobs', 'model.branches.@each.exists_on_github'), _dec5 = (0, _computed.sort)('branchesWithoutCron', function (a, b) {
    if (a.get('defaultBranch')) {
      return -1;
    } else if (b.get('defaultBranch')) {
      return 1;
    } else {
      return a.get('name') > b.get('name');
    }
  }), _dec6 = (0, _object.computed)('model.settings'), (_obj = {
    envVars: function envVars(_envVars) {
      return _envVars.sortBy('name');
    },

    unsortedEnvVars: null,

    cronJobs: null,

    branchesWithoutCron: function branchesWithoutCron(cronJobs, branches) {
      return branches.filter(function (branch) {
        return branch.get('exists_on_github');
      }).filter(function (branch) {
        var branchName = branch.get('name');
        return !cronJobs.any(function (cron) {
          return branchName === cron.get('branch.name');
        });
      });
    },

    sortedBranchesWithoutCron: null,

    showAutoCancellationSwitches: function showAutoCancellationSwitches(settings) {
      return settings.hasOwnProperty('auto_cancel_pushes') || settings.hasOwnProperty('auto_cancel_pull_requests');
    },


    actions: {
      sshKeyAdded: function sshKeyAdded(sshKey) {
        return this.set('model.customSshKey', sshKey);
      },
      sshKeyDeleted: function sshKeyDeleted() {
        return this.set('model.customSshKey', null);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'envVars', [_dec], Object.getOwnPropertyDescriptor(_obj, 'envVars'), _obj), _applyDecoratedDescriptor(_obj, 'unsortedEnvVars', [_dec2], (_init = Object.getOwnPropertyDescriptor(_obj, 'unsortedEnvVars'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'cronJobs', [_dec3], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'cronJobs'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'branchesWithoutCron', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'branchesWithoutCron'), _obj), _applyDecoratedDescriptor(_obj, 'sortedBranchesWithoutCron', [_dec5], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'sortedBranchesWithoutCron'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'showAutoCancellationSwitches', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'showAutoCancellationSwitches'), _obj)), _obj)));
});