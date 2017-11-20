define('ember-power-calendar/components/power-calendar', ['exports', 'ember-power-calendar/templates/components/power-calendar', 'moment', 'ember-concurrency'], function (exports, _powerCalendar, _moment, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  var guidFor = Ember.guidFor;
  exports.default = Component.extend({
    layout: _powerCalendar.default,
    classNames: ['ember-power-calendar'],
    powerCalendarService: service('power-calendar'),
    momentService: service('moment'),
    navComponent: 'power-calendar/nav',
    daysComponent: 'power-calendar/days',
    center: null,

    // Lifecycle chooks
    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);
      var changeCenter = function changeCenter(newCenter, calendar, e) {
        return _this.get('changeCenterTask').perform((0, _moment.default)(newCenter), calendar, e);
      };
      this.publicActions = {
        changeCenter: changeCenter,
        moveCenter: function moveCenter(step, unit, calendar, e) {
          var newCenter = (0, _moment.default)(_this.get('center')).add(step, unit);
          return changeCenter(newCenter, calendar, e);
        },
        select: function select() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _this.send.apply(_this, ['select'].concat(args));
        }
      };
      this.get('powerCalendarService').registerCalendar(this);
      var onInit = this.get('onInit');
      if (onInit) {
        onInit(this.get('publicAPI'));
      }
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this.get('powerCalendarService').unregisterCalendar(this);
    },


    // CPs
    currentCenter: computed('center', function () {
      var center = this.get('center');
      if (center) {
        return (0, _moment.default)(center);
      }
      return (0, _moment.default)(this.get('selected') || this.get('powerCalendarService').getDate());
    }),

    publicAPI: computed('_publicAPI', function () {
      return this.get('_publicAPI');
    }),

    _publicAPI: computed('selected', 'currentCenter', 'locale', 'momentService.locale', 'changeCenterTask.isRunning', function () {
      return {
        uniqueId: guidFor(this),
        selected: this.get('selected'),
        loading: this.get('changeCenterTask.isRunning'),
        center: this.get('currentCenter'),
        locale: this.get('locale') || this.get('momentService.locale') || _moment.default.locale(),
        actions: this.get('publicActions')
      };
    }),

    // Actions
    actions: {
      select: function select(day, calendar, e) {
        var action = this.get('onSelect');
        if (action) {
          action(day, calendar, e);
        }
      }
    },

    // Tasks
    changeCenterTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newCenterMoment, calendar, e) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.get('onCenterChange')({ date: newCenterMoment.toDate(), moment: newCenterMoment }, calendar, e);

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }))
  });
});