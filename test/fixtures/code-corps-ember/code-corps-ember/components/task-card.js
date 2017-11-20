define('code-corps-ember/components/task-card', ['exports', 'ember-can', 'ember-keyboard', 'ember-concurrency'], function (exports, _emberCan, _emberKeyboard, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var mapBy = Ember.computed.mapBy;
  var computed = Ember.computed;
  var get = Ember.get;
  var getProperties = Ember.getProperties;
  var set = Ember.set;
  var on = Ember.on;
  var service = Ember.inject.service;


  var ICON_CLASS = 'ember-power-select-status-icon';
  var TRIGGER_CLASS = 'ember-power-select-trigger';

  exports.default = Component.extend(_emberKeyboard.EKMixin, {
    attributeBindings: ['data-can-reposition', 'data-model-id', 'data-model-type'],
    classNames: ['task-card'],
    classNameBindings: ['canReposition:task-card--can-reposition', 'isLoading:task-card--is-loading'],
    tagName: 'div',

    session: service(),
    store: service(),

    bound: false,
    editingDetails: false,
    hasHovered: false,
    hovering: false,
    shouldShowUsers: false,
    task: null,
    taskUser: null,
    users: null,

    // auto-assigns 'task' property from component as ability 'model'
    ability: _emberCan.default.computed.ability('task'),
    canArchive: alias('ability.canArchive'),
    canReposition: alias('ability.canReposition'),
    isLoading: alias('task.isLoading'),
    taskSkills: mapBy('task.taskSkills', 'skill'),

    init: function init() {
      this._super.apply(this, arguments);
    },


    /**
    For usage with data attribute bindings. Needs to be a function because it
    needs to send 'true' and 'false' strings.
    */
    'data-can-reposition': computed('canReposition', function () {
      var canReposition = get(this, 'canReposition');
      return canReposition ? 'true' : 'false';
    }),
    'data-model-id': alias('task.id'),
    'data-model-type': 'task',

    archiveTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var task, next;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              task = get(this, 'task');

              set(task, 'archived', true);
              next = this.$().next(); // get the next sibling

              _context.next = 5;
              return task.save().then(function () {
                // trigger a mouseenter since the mouse doesn't update without the user
                if (next) {
                  next.trigger('mouseenter');
                }
              });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this.$().trigger('mouseleave');
    },
    assignmentClosed: function assignmentClosed() {
      set(this, 'editingDetails', false);
    },
    assignmentOpened: function assignmentOpened() {
      set(this, 'editingDetails', true);
    },
    click: function click(e) {
      if (e.target instanceof SVGElement) {
        return;
      }

      // TODO: Find a better way to do this
      // Currently necessary due to the way that power select handles trigger
      var clickedIcon = e.target.className.includes(ICON_CLASS);
      var clickedTrigger = e.target.className.includes(TRIGGER_CLASS);
      if (clickedIcon || clickedTrigger) {
        return;
      }

      var _getProperties = getProperties(this, 'isLoading', 'task'),
          isLoading = _getProperties.isLoading,
          task = _getProperties.task;

      if (!isLoading) {
        this.sendAction('clickedTask', task);
      }
    },
    mouseEnter: function mouseEnter() {
      set(this, 'hasHovered', true);
      set(this, 'hovering', true);
      set(this, 'keyboardActivated', true);
    },
    mouseLeave: function mouseLeave() {
      set(this, 'hovering', false);
      set(this, 'keyboardActivated', false);
    },


    triggerArchive: on((0, _emberKeyboard.keyDown)('KeyC'), function () {
      var hovering = get(this, 'hovering');
      var editingDetails = get(this, 'editingDetails');
      var canArchive = get(this, 'canArchive');
      if (hovering && !editingDetails && canArchive) {
        get(this, 'archiveTask').perform();
      }
    })
  });
});