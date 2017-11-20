define('travis/routes/repo', ['exports', 'travis/routes/basic', 'travis/models/repo', 'travis/mixins/scroll-reset', 'ember-decorators/service'], function (exports, _basic, _repo, _scrollReset, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var _desc, _value, _obj, _init, _init2, _init3;

  var getWithDefault = Ember.getWithDefault;
  exports.default = _basic.default.extend(_scrollReset.default, (_obj = { store: null,
    tabStates: null,
    repositories: null,

    activate: function activate() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._super(args);

      if (this.get('auth.signedIn')) {
        if (this.get('features.proVersion') && this.get('tabStates.sidebarTab') === 'running') {
          return;
        }
        if (!this.get('tabStates.sidebarTab', 'search')) {
          this.get('tabStates').set('sidebarTab', 'owned');
        }
        this.set('tabStates.mainTab', null);
      }
    },
    titleToken: function titleToken(model) {
      return model.get('slug');
    },
    setupController: function setupController(controller, model) {
      if (model && !model.get) {
        model = this.get('store').find('repo', model.id);
      }
      return controller.set('repo', model);
    },
    serialize: function serialize(repo) {
      // slugs are sometimes unknown ???
      var slug = getWithDefault(repo, 'slug', 'unknown/unknown');

      var _slug$split = slug.split('/'),
          _slug$split2 = _slicedToArray(_slug$split, 2),
          owner = _slug$split2[0],
          name = _slug$split2[1];

      return {
        owner: owner,
        name: name
      };
    },
    model: function model(params) {
      var name = params.name,
          owner = params.owner;

      var slug = owner + '/' + name;
      return _repo.default.fetchBySlug(this.get('store'), slug);
    }
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repositories', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'repositories'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj)), _obj));
});