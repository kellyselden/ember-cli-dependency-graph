define('ember-datetimepicker/components/date-time-picker', ['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      get = Ember.get,
      on = Ember.on,
      observer = Ember.observer,
      computed = Ember.computed,
      run = Ember.run,
      scheduleOnce = Ember.run.scheduleOnce,
      proxy = Ember.$.proxy,
      copy = Ember.copy;


  function formatDate(date) {
    return (0, _moment.default)(date).format('YYYY/MM/DD H:mm');
  }

  var MyComponent = Component.extend({
    tagName: 'input',
    classNames: ['date-time-picker'],

    _changeHandler: function _changeHandler(event) {
      var _this = this;

      run(function () {
        var newValue = Ember.$(event.target).val(),
            oldValue = get(_this, 'datetime'),
            newDatetime = void 0,
            newDatetimeFormat = void 0,
            oldDatetimeFormat = void 0;
        if (newValue) {
          newDatetime = new Date(newValue);
          newDatetimeFormat = formatDate(newDatetime);
        }
        if (oldValue) {
          oldDatetimeFormat = formatDate(oldValue);
        }

        if (newDatetimeFormat === oldDatetimeFormat) {
          return;
        }

        _this.sendAction('action', newDatetime);
      });
    },

    _changeHandlerProxy: computed(function () {
      return proxy(this._changeHandler, this);
    }),

    _datetimeChanged: observer('datetime', function () {
      this._updateValue(true);
    }),

    _updateValue: function _updateValue(shouldForceUpdatePicker) {
      var value = void 0,
          datetime = get(this, 'datetime');
      if (datetime) {
        value = formatDate(datetime);
      } else {
        value = '';
      }

      var el = this.$();
      el.val(value);

      // is only needed for inline, changing value above didn't change the picker
      if (shouldForceUpdatePicker) {
        el.datetimepicker({ value: value });
      }
    },


    setUp: on('didInsertElement', function () {
      var _this2 = this;

      var changeHandler = get(this, '_changeHandlerProxy');
      var options = get(this, 'options') || {};

      // https://github.com/emberjs/ember.js/issues/14655
      options = copy(options);

      this._updateValue();

      scheduleOnce('afterRender', function () {
        _this2.$().datetimepicker(options).on('change', changeHandler);
      });
    }),

    tearDown: on('willDestroyElement', function () {
      var changeHandler = get(this, '_changeHandlerProxy');

      this.$().off('change', changeHandler).datetimepicker('destroy');
    })
  });

  MyComponent.reopenClass({
    positionalParams: ['datetime']
  });

  exports.default = MyComponent;
});