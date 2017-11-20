define('travis/components/repository-status-toggle', ['exports', 'travis/config/environment', 'ember-concurrency', 'ember-decorators/object'], function (exports, _environment, _emberConcurrency, _object) {
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
  exports.default = Component.extend((_dec = (0, _object.computed)('repository.permissions'), (_obj = {
    tagName: 'li',
    classNames: ['row'],
    classNameBindings: ['repository.active:active'],
    githubOrgsOauthAccessSettingsUrl: _environment.default.githubOrgsOauthAccessSettingsUrl,

    actions: {
      handleToggleError: function handleToggleError() {
        return this.set('showError', true);
      },
      close: function close() {
        return this.send('resetErrors');
      },
      resetErrors: function resetErrors() {
        return this.set('showError', false);
      }
    },

    admin: function admin(permissions) {
      return permissions.admin;
    },


    toggleRepositoryTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this = this;

      var repository, pusher, repoId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.get('disabled')) {
                _context.next = 6;
                break;
              }

              this.sendAction('onToggle');

              repository = this.get('repository');
              pusher = this.get('pusher'), repoId = repository.get('id');
              _context.next = 6;
              return repository.toggle().then(function () {
                pusher.subscribe('repo-' + repoId);
                _this.toggleProperty('repository.active');
              }, function () {
                _this.sendAction('onToggleError', repository);
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }))
  }, (_applyDecoratedDescriptor(_obj, 'admin', [_dec], Object.getOwnPropertyDescriptor(_obj, 'admin'), _obj)), _obj)));
});