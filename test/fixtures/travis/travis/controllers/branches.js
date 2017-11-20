define('travis/controllers/branches', ['exports', 'ember-decorators/controller', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _controller, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _obj, _init, _init2, _init3, _init4;

  var isNone = Ember.isNone;
  var get = Ember.get;
  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _controller.controller)('repo'), _dec2 = (0, _computed.alias)('repoController.tab'), _dec3 = (0, _object.computed)('model'), _dec4 = (0, _computed.notEmpty)('model'), _dec5 = (0, _computed.filter)('model', function (branch) {
    return !branch.default_branch;
  }), _dec6 = (0, _object.computed)('nonDefaultBranches'), _dec7 = (0, _object.computed)('nonDefaultBranches'), (_obj = { repoController: null,

    tab: null,

    defaultBranch: function defaultBranch(model) {
      return model.filterBy('default_branch')[0];
    },
    branchesExist: null,

    nonDefaultBranches: null,

    activeBranches: function activeBranches(nonDefaultBranches) {
      var activeBranches = nonDefaultBranches.filterBy('exists_on_github');
      return this._sortBranchesByFinished(activeBranches);
    },
    inactiveBranches: function inactiveBranches(nonDefaultBranches) {
      var inactiveBranches = nonDefaultBranches.filterBy('exists_on_github', false);
      return this._sortBranchesByFinished(inactiveBranches);
    },
    _sortBranchesByFinished: function _sortBranchesByFinished(branches) {
      var unfinished = branches.filter(function (branch) {
        var finishedAt = get(branch, 'last_build.finished_at');
        return isNone(finishedAt);
      });

      var sortedFinished = branches.filterBy('last_build.finished_at').sortBy('last_build.finished_at').reverse();

      return unfinished.concat(sortedFinished);
    }
  }, (_applyDecoratedDescriptor(_obj, 'repoController', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'repoController'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec2], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'defaultBranch', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'defaultBranch'), _obj), _applyDecoratedDescriptor(_obj, 'branchesExist', [_dec4], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'branchesExist'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'nonDefaultBranches', [_dec5], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'nonDefaultBranches'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'activeBranches', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'activeBranches'), _obj), _applyDecoratedDescriptor(_obj, 'inactiveBranches', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'inactiveBranches'), _obj)), _obj)));
});