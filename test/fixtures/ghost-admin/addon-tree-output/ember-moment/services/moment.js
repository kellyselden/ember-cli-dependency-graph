define('ember-moment/services/moment', ['exports', 'moment'], function (exports, _moment2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var Evented = Ember.Evented;
  var getOwner = Ember.getOwner;
  var computed = Ember.computed;
  var _get = Ember.get;
  var _set = Ember.set;
  var getProperties = Ember.getProperties;
  var setProperties = Ember.setProperties;
  var warn = Ember.Logger.warn;
  exports.default = Service.extend(Evented, {
    _timeZone: null,

    locale: null,
    localeOptions: {},
    defaultFormat: null,

    __config__: computed(function () {
      var config = getOwner(this).factoryFor('config:environment').class || {};

      return _get(config, 'moment') || {};
    }).readOnly(),

    timeZone: computed('_timeZone', {
      get: function get() {
        return _get(this, '_timeZone');
      },
      set: function set(propertyKey, timeZone) {
        if (!_moment2.default.tz) {
          warn('[ember-moment] attempted to set timezone, but moment-timezone is not setup.');
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