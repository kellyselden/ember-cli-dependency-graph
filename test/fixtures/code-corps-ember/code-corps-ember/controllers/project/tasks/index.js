define('code-corps-ember/controllers/project/tasks/index', ['exports'], function (exports) {
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

  var Controller = Ember.Controller;
  var get = Ember.get;
  var setProperties = Ember.setProperties;
  var sort = Ember.computed.sort;
  var service = Ember.inject.service;
  var RSVP = Ember.RSVP;
  exports.default = Controller.extend({
    taskListsSorting: ['order:asc'],

    metrics: service(),
    store: service(),

    dragulaconfig: {
      options: {
        moves: function moves(el) {
          return el.dataset.canReposition == 'true';
        },

        copy: false,
        revertOnSpill: false,
        removeOnSpill: false
        // Other options from the dragula source page.
      },
      enabledEvents: ['drag', 'drop']
    },

    orderedTaskLists: sort('project.taskLists', 'taskListsSorting'),

    actions: {
      onDrop: function onDrop(droppedTaskEl, listDropTargetEl, source, siblingTaskEl) {
        // Get the necessary attributes from the dropped card and drop target
        var listId = listDropTargetEl.dataset.modelId;
        var position = $(droppedTaskEl).index();
        var taskId = droppedTaskEl.dataset.modelId;

        var store = get(this, 'store');
        var taskList = store.findRecord('taskList', listId);
        var task = store.findRecord('task', taskId);

        if (siblingTaskEl) {
          var siblingTaskId = siblingTaskEl.dataset.modelId;
          this._moveTaskAboveTask(taskList, task, siblingTaskId, position, droppedTaskEl);
        } else {
          this._moveTaskMaybeBelowTask(taskList, task, position, droppedTaskEl);
        }
      },
      trackClickNewTask: function trackClickNewTask(project) {
        var organizationId = get(project, 'organization.id');
        var organizationName = get(project, 'organization.name');
        var projectId = get(project, 'id');
        var projectTitle = get(project, 'title');
        get(this, 'metrics').trackEvent({
          event: 'Clicked New Task',
          organization: organizationName,
          organization_id: organizationId,
          project: projectTitle,
          project_id: projectId
        });
      }
    },

    _isFloat: function _isFloat(n) {
      return Number(n) === n && n % 1 !== 0;
    },
    _moveTaskAboveTask: function _moveTaskAboveTask(taskList, task, siblingTaskId, position, droppedTaskEl) {
      var _this = this;

      var store = get(this, 'store');
      var siblingTask = store.findRecord('task', siblingTaskId);

      RSVP.hash({
        siblingTask: siblingTask,
        task: task,
        taskList: taskList
      }).then(function (_ref) {
        var siblingTask = _ref.siblingTask,
            task = _ref.task,
            taskList = _ref.taskList;

        var originalListId = get(task, 'taskList.id');
        var newListId = get(taskList, 'id');
        if (originalListId !== newListId) {
          droppedTaskEl.remove();
        }
        var siblingOrder = get(siblingTask, 'order');
        var order = _this._newOrder(siblingOrder, -1);
        _this._saveTask(task, order, position, taskList);
      });
    },
    _moveTaskMaybeBelowTask: function _moveTaskMaybeBelowTask(taskList, task, position, droppedTaskEl) {
      var _this2 = this;

      RSVP.hash({
        task: task,
        taskList: taskList
      }).then(function (_ref2) {
        var task = _ref2.task,
            taskList = _ref2.taskList;

        var originalListId = get(task, 'taskList.id');
        var newListId = get(taskList, 'id');
        var tempOrder = 0;
        var lastTask = get(taskList, 'orderedTasks.lastObject');
        if (lastTask) {
          tempOrder = get(lastTask, 'order');
        }
        var order = _this2._newOrder(tempOrder, 1);
        if (originalListId !== newListId) {
          droppedTaskEl.remove();
        }
        _this2._saveTask(task, order, position, taskList);
      });
    },
    _newOrder: function _newOrder(number, sign) {
      var decimal = this._isFloat(number) ? this._toFraction(number) : 0.5;
      if (sign === -1) {
        return number - decimal;
      } else if (sign === 1) {
        return number + decimal;
      }
    },
    _saveTask: function _saveTask(task, order, position, taskList) {
      var tasks = get(taskList, 'tasks');
      setProperties(task, { order: order, position: position });

      // We do pushObject because sorting does not work correctly unless
      // the task is pushed onto the task list array.
      tasks.pushObject(task);
      task.save();
      // TODO: If save() fails then we have a task pushed onto a task
      // list that is not actually in that task list
      // We should consider error handling here
    },
    _toFraction: function _toFraction(number) {
      var numberString = number.toString();

      var _numberString$split = numberString.split('.'),
          _numberString$split2 = _slicedToArray(_numberString$split, 2),
          decimalPortion = _numberString$split2[1];

      return Number(decimalPortion);
    }
  });
});