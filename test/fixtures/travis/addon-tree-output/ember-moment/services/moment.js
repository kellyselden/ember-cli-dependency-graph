define('ember-moment/services/moment', ['exports', 'moment'], function (exports, _moment2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      _get = Ember.get,
      getProperties = Ember.getProperties,
      _set = Ember.set,
      setProperties = Ember.setProperties,
      logger = Ember.Logger;
  exports.default = Ember.Service.extend(Ember.Evented, {
    _timeZone: null,

    locale: null,
    localeOptions: {},
    defaultFormat: null,

    timeZone: computed('_timeZone', {
      get: function get() {
        return _get(this, '_timeZone');
      },
      set: function set(propertyKey, timeZone) {
        if (!_moment2.default.tz) {
          logger.warn('[ember-moment] attempted to set timezone, but moment-timezone is not setup.');
          return;
        }

        _set(this, '_timeZone', timeZone);

        return timeZone;
      }
    }),

    setLocale: function setLocale(locale) {
      this.changeLocale(locale);
    },
    updateLocale: function updateLocale(locale) {
      var localeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.changeLocale(locale, localeOptions);
    },
    changeLocale: function changeLocale(locale) {
      var localeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      setProperties(this, {
        locale: locale,
        localeOptions: localeOptions
      });
      _moment2.default.updateLocale(locale, localeOptions);
      this.trigger('localeChanged', locale);
    },
    setTimeZone: function setTimeZone(timeZone) {
      this.changeTimeZone(timeZone);
    },
    changeTimeZone: function changeTimeZone(timeZone) {
      _set(this, 'timeZone', timeZone);
      this.trigger('timeZoneChanged', timeZone);
    },
    isMoment: function isMoment(obj) {
      return _moment2.default.isMoment(obj);
    },
    moment: function moment() {
      var momentObj = _moment2.default.apply(undefined, arguments);

      var _getProperties = getProperties(this, 'locale', 'timeZone'),
          locale = _getProperties.locale,
          timeZone = _getProperties.timeZone;

      if (locale && momentObj.locale) {
        momentObj = momentObj.locale(locale);
      }

      if (timeZone && momentObj.tz) {
        momentObj = momentObj.tz(timeZone);
      }

      return momentObj;
    }
  });
});