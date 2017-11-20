define('code-corps-ember/controllers/project/tasks/new', ['exports', 'code-corps-ember/utils/error-utils'], function (exports, _errorUtils) {
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

  var alias = Ember.computed.alias;
  var Controller = Ember.Controller;
  var RSVP = Ember.RSVP;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Controller.extend({
    unsavedTaskSkills: [],

    githubRepos: alias('task.project.githubRepos'),

    actions: {
      /**
       saveTask - action
        Triggered when user clicks 'save' on the new task form.
       Adds task to the correct task list, which is the inbox task list.
       Saves task and, on success, transitions to the task route.
       On failure, calls the save error handler.
        @param  {DS.Model} task The task to be saved.
      */
      saveTask: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(task) {
          var _this = this;

          var project, githubRepo, inboxTaskList;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  project = get(task, 'project');
                  githubRepo = get(this, 'selectedRepo');
                  _context.next = 4;
                  return this._getInboxTaskList(project);

                case 4:
                  inboxTaskList = _context.sent;


                  set(task, 'taskList', inboxTaskList);
                  set(task, 'githubRepo', githubRepo);

                  return _context.abrupt('return', task.save().then(function (task) {
                    return _this._saveSkills(task);
                  }).then(function (task) {
                    return _this.transitionToRoute('project.tasks.task', get(task, 'number'));
                  }).catch(function (payload) {
                    return _this._handleTaskSaveError(payload);
                  }));

                case 8:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function saveTask(_x) {
          return _ref.apply(this, arguments);
        }

        return saveTask;
      }(),
      deselectTaskSkill: function deselectTaskSkill(taskSkill) {
        var unsavedTaskSkills = get(this, 'unsavedTaskSkills');
        unsavedTaskSkills.removeObject(taskSkill);
      },
      toggleSkill: function toggleSkill(skill) {
        var unsavedTaskSkills = get(this, 'unsavedTaskSkills');
        var id = get(skill, 'id');

        var unsavedSkill = unsavedTaskSkills.findBy('id', id);
        if (unsavedSkill) {
          unsavedTaskSkills.removeObject(unsavedSkill);
        } else {
          unsavedTaskSkills.pushObject(skill);
        }
      }
    },

    _createTaskSkill: function _createTaskSkill(skill, task) {
      var store = get(this, 'store');
      return store.createRecord('task-skill', { skill: skill, task: task }).save();
    },


    /**
     _getInboxTaskList - Private function
      Returns a promise, which, when resolved, holds the task list for the
     specified project, which is marked as an inbox task list.
      @param  {DS.Model} project The currently loaded project.
     @return {DS.Model} The inbox task list for the specified project.
    */
    _getInboxTaskList: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(project) {
        var taskLists, inboxes;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return get(project, 'taskLists');

              case 2:
                taskLists = _context2.sent;
                inboxes = taskLists.filterBy('inbox', true);
                return _context2.abrupt('return', get(inboxes, 'firstObject'));

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _getInboxTaskList(_x2) {
        return _ref2.apply(this, arguments);
      }

      return _getInboxTaskList;
    }(),


    /**
     _handleTaskSaveError - Private function
      Sets the controller `error` property if the error payloed is anything
     other than a validation error
      @param  {DS.AdapterError} payload     The payload to check.
    */
    _handleTaskSaveError: function _handleTaskSaveError(payload) {
      if ((0, _errorUtils.isNonValidationError)(payload)) {
        set(this, 'error', payload);
      }
    },


    /**
     _saveSkills - Private function
      Saves any of the skills added during the creation of the task.
      @param  {DS.Model} task The task being created.
     @return {RSVP.Promise} promise that is fulfilled when all `promises`
     have been fulfilled, or rejected if any of them become rejected.
    */
    _saveSkills: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(task) {
        var _this2 = this;

        var unsavedTaskSkills, promises;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                unsavedTaskSkills = get(this, 'unsavedTaskSkills');
                promises = unsavedTaskSkills.map(function (skill) {
                  return _this2._createTaskSkill(skill, task);
                });
                return _context3.abrupt('return', RSVP.all(promises).then(function () {
                  return task;
                }));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _saveSkills(_x3) {
        return _ref3.apply(this, arguments);
      }

      return _saveSkills;
    }()
  });
});