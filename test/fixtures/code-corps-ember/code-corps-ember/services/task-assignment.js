define('code-corps-ember/services/task-assignment', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var Service = Ember.Service;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Service.extend({
    store: service(),

    /**
      Assign a task to a user.
       If there's already a user task for the task passed in, it updates the
      existing record. Otherwise, it createes a new record.
       @method assign
      @param {DS.Model} task
      @param {DS.Model} user
      @return {DS.Model} userTask
    */
    assign: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(task, user) {
        var userTask;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return get(task, 'userTask');

              case 2:
                userTask = _context.sent;
                return _context.abrupt('return', userTask ? this._update(userTask, user) : this._create(user, task));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function assign(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return assign;
    }(),


    /**
      Check if a task is assigned to a user.
       @method isAssignedTo
      @param {DS.Model} task
      @param {DS.Model} user
      @return {Boolean}
    */
    isAssignedTo: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(task, user) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return get(task, 'userTask.user.id');

              case 2:
                _context2.t0 = _context2.sent;
                _context2.t1 = get(user, 'id');
                return _context2.abrupt('return', _context2.t0 === _context2.t1);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function isAssignedTo(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return isAssignedTo;
    }(),


    /**
      Unassign a task.
       For the given task, unassign it from whomever it's assigned to. This simply
      destroys the userTask record for that task.
       @method assign
      @param {DS.Model} task
      @return {DS.Model} userTask
    */
    unassign: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(task) {
        var userTask;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return get(task, 'userTask');

              case 2:
                userTask = _context3.sent;

                if (!userTask) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt('return', userTask.destroyRecord());

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function unassign(_x5) {
        return _ref3.apply(this, arguments);
      }

      return unassign;
    }(),
    _create: function _create(user, task) {
      var store = get(this, 'store');
      var userTask = store.createRecord('user-task', { user: user, task: task });
      return userTask.save().catch(function () {
        userTask.unloadRecord();
      });
    },
    _update: function _update(userTask, user) {
      // rollbackAttributes does not roll back relationships,
      // so we need to reset if it fails
      var oldUser = get(userTask, 'user');
      set(userTask, 'user', user);
      return userTask.save().catch(function () {
        set(userTask, 'user', oldUser);
        // so it's not dirty anymore
        userTask.rollbackAttributes();
      });
    }
  });
});