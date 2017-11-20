define('ghost-admin/components/modal-new-subscriber', ['exports', 'ghost-admin/components/modal-base', 'ember-ajax/errors', 'ember-concurrency'], function (exports, _modalBase, _errors, _emberConcurrency) {
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

    var emberA = Ember.A;
    exports.default = _modalBase.default.extend({

        addSubscriber: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var _error$payload$errors, firstError, message;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return this.get('confirm')();

                        case 3:
                            this.send('closeModal');
                            _context.next = 17;
                            break;

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context['catch'](0);

                            if (!(_context.t0 && (0, _errors.isInvalidError)(_context.t0))) {
                                _context.next = 15;
                                break;
                            }

                            _error$payload$errors = _slicedToArray(_context.t0.payload.errors, 1), firstError = _error$payload$errors[0];
                            message = firstError.message;

                            if (!(message && message.match(/email/i))) {
                                _context.next = 15;
                                break;
                            }

                            this.get('model.errors').add('email', message);
                            this.get('model.hasValidated').pushObject('email');
                            return _context.abrupt('return');

                        case 15:
                            if (!_context.t0) {
                                _context.next = 17;
                                break;
                            }

                            throw _context.t0;

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 6]]);
        })).drop(),

        actions: {
            updateEmail: function updateEmail(newEmail) {
                this.set('model.email', newEmail);
                this.set('model.hasValidated', emberA());
                this.get('model.errors').clear();
            },
            confirm: function confirm() {
                this.get('addSubscriber').perform();
            }
        }
    });
});