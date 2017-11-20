define('travis/components/add-ssh-key', ['exports', 'ember-decorators/service', 'ember-concurrency'], function (exports, _service, _emberConcurrency) {
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

  var observer = Ember.observer;
  var isBlank = Ember.isBlank;
  var Component = Ember.Component;
  exports.default = Component.extend((_obj = { store: null,

    classNames: ['form--sshkey'],
    classNameBindings: ['valueError:form-error'],
    isSaving: false,

    didInsertElement: function didInsertElement() {
      var id = this.get('repo.id');
      var store = this.get('store');
      var model = store.peekRecord('ssh_key', id) || store.createRecord('ssh_key', { id: id });

      return this.set('model', model);
    },
    isValid: function isValid() {
      if (isBlank(this.get('value'))) {
        this.set('valueError', 'Value can\'t be blank.');
        return false;
      } else {
        return true;
      }
    },
    reset: function reset() {
      return this.setProperties({
        description: null,
        value: null
      });
    },


    valueChanged: observer('value', function () {
      return this.set('valueError', false);
    }),

    addErrorsFromResponse: function addErrorsFromResponse(errArr) {
      if (errArr !== undefined && errArr.length) {
        var error = errArr[0].detail;

        if (error.code === 'not_a_private_key') {
          return this.set('valueError', 'This key is not a private key.');
        } else if (error.code === 'key_with_a_passphrase') {
          return this.set('valueError', 'The key can\'t have a passphrase.');
        }
      }
    },


    save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var sshKey, errors;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.set('valueError', false);

              if (!this.isValid()) {
                _context.next = 15;
                break;
              }

              sshKey = this.get('model');

              sshKey.setProperties({
                description: this.get('description'),
                value: this.get('value')
              });

              _context.prev = 4;
              _context.next = 7;
              return sshKey.save();

            case 7:
              this.reset();
              return _context.abrupt('return', this.sendAction('sshKeyAdded', sshKey));

            case 11:
              _context.prev = 11;
              _context.t0 = _context['catch'](4);
              errors = _context.t0.errors;
              return _context.abrupt('return', this.addErrorsFromResponse(errors));

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 11]]);
    })).drop()
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});