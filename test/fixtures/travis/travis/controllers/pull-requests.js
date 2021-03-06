define('travis/controllers/pull-requests', ['exports', 'travis/mixins/builds/load-more', 'ember-decorators/controller', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _loadMore, _controller, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5;

  var sort = Ember.computed.sort;
  var Controller = Ember.Controller;


  var mixins = [_loadMore.default];

  exports.default = Controller.extend.apply(Controller, mixins.concat([(_dec = (0, _controller.controller)('repo'), _dec2 = (0, _computed.alias)('repoController.repo'), _dec3 = (0, _computed.alias)('repoController.tab'), _dec4 = (0, _computed.alias)('model.isLoaded'), _dec5 = (0, _computed.alias)('model.isLoading'), _dec6 = (0, _object.computed)('tab', 'builds.lastObject.number'), (_obj = { repoController: null,

    buildsSorting: ['number:desc'],
    builds: sort('model', 'buildsSorting'),

    repo: null,
    tab: null,
    isLoaded: null,
    isLoading: null,

    displayShowMoreButton: function displayShowMoreButton(tab, lastBuildNumber) {
      return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
    }
  }, (_applyDecoratedDescriptor(_obj, 'repoController', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'repoController'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repo', [_dec2], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'repo'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec3], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isLoaded', [_dec4], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'isLoaded'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isLoading', [_dec5], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'isLoading'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'displayShowMoreButton', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'displayShowMoreButton'), _obj)), _obj))]));
});