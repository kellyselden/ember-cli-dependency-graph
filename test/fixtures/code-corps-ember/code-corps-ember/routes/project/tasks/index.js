define('code-corps-ember/routes/project/tasks/index', ['exports'], function (exports) {
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

  var get = Ember.get;
  var Route = Ember.Route;
  var service = Ember.inject.service;
  var RSVP = Ember.RSVP;
  exports.default = Route.extend({
    metrics: service(),
    projectTaskBoard: service(),

    model: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var project, projectUsers, userPromises, taskLists;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                project = this.modelFor('project');
                _context.next = 3;
                return get(project, 'projectUsers');

              case 3:
                projectUsers = _context.sent;
                userPromises = projectUsers.mapBy('user');
                taskLists = get(project, 'taskLists');

                taskLists.forEach(function (taskList) {
                  return get(taskList, 'tasks').reload();
                });
                return _context.abrupt('return', RSVP.hash({ project: project, users: RSVP.all(userPromises) }));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function model() {
        return _ref.apply(this, arguments);
      }

      return model;
    }(),
    setupController: function setupController(controller, models) {
      controller.setProperties(models);
    },


    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);
        get(this, 'projectTaskBoard').activate();
        return true;
      },
      willTransition: function willTransition() {
        this._super.apply(this, arguments);
        get(this, 'projectTaskBoard').deactivate();
        return true;
      },
      transitionToTask: function transitionToTask(task) {
        var project = get(task, 'project');
        var organizationSlug = get(project, 'organization.slug');
        var projectSlug = get(project, 'slug');
        var taskNumber = get(task, 'number');

        var organizationId = get(project, 'organization.id');
        var organizationName = get(project, 'organization.name');
        var projectId = get(project, 'id');
        var projectTitle = get(project, 'title');
        var taskId = get(task, 'id');
        var taskTitle = get(task, 'title');

        get(this, 'metrics').trackEvent({
          event: 'Clicked on Task Card in List',
          organization: organizationName,
          organization_id: organizationId,
          project: projectTitle,
          project_id: projectId,
          task: taskTitle,
          task_id: taskId
        });

        this.transitionTo('project.tasks.task', organizationSlug, projectSlug, taskNumber);
      }
    }
  });
});