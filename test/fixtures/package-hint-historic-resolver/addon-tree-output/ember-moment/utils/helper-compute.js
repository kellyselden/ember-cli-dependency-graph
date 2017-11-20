define('ember-moment/utils/helper-compute', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (cb) {
    return function (params, hash) {
      if (!params || params && params.length === 0) {
        throw new TypeError('ember-moment: Invalid Number of arguments, expected at least 1');
      }

      var datetime = params[0];

      var allowEmpty = hash.allowEmpty || hash['allow-empty'];

      if (allowEmpty === undefined || allowEmpty === null) {
        allowEmpty = get(this, 'globalAllowEmpty');
      }

      if (isBlank(datetime)) {
        if (allowEmpty) {
          return;
        }

        warn('ember-moment: an empty value (null, undefined, or "") was passed to ember-moment helper');
      }

      return cb.apply(this, arguments);
    };
  };

  var isBlank = Ember.isBlank;
  var get = Ember.get;
  var warn = Ember.Logger.warn;
});