define('code-corps-ember/controllers/project/tasks/task', ['exports', 'code-corps-ember/utils/error-utils', 'ember-concurrency'], function (exports, _errorUtils, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var filterBy = Ember.computed.filterBy;
  var alias = Ember.computed.alias;
  var Controller = Ember.Controller;
  var service = Ember.inject.service;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  exports.default = Controller.extend({
    currentUser: service(),
    store: service(),
    taskSkillsList: service(),

    comments: filterBy('task.comments', 'isNew', false),
    user: alias('currentUser.user'),

    archiveTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var task;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              task = get(this, 'task');

              set(task, 'archived', true);
              _context.next = 4;
              return task.save();

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    actions: {
      saveTask: function saveTask(task) {
        var _this = this;

        return task.save().catch(function (payload) {
          return _this._onError(payload);
        });
      },
      saveComment: function saveComment(markdown) {
        var _this2 = this;

        var comment = get(this, 'newComment');
        set(comment, 'markdown', markdown);
        return comment.save().then(function (comment) {
          return _this2._initComment(comment);
        }).catch(function (payload) {
          return _this2._onError(payload);
        });
      },
      onSaveError: function onSaveError(payload) {
        this._onError(payload);
      },
      removeTaskSkill: function removeTaskSkill(taskSkill) {
        return taskSkill.destroyRecord();
      },
      toggleSkill: function toggleSkill(skill) {
        var list = get(this, 'taskSkillsList');
        return list.toggle(skill);
      }
    },

    _onError: function _onError(payload) {
      if ((0, _errorUtils.isNonValidationError)(payload)) {
        set(this, 'error', payload);
      }
    },
    _initComment: function _initComment() {
      var _getProperties = getProperties(this, 'store', 'task', 'user'),
          store = _getProperties.store,
          task = _getProperties.task,
          user = _getProperties.user;

      var newComment = store.createRecord('comment', { task: task, user: user });

      set(this, 'newComment', newComment);
    }
  });
});