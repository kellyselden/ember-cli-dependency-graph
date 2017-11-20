define('liquid-fire/transitions/wait', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ms, opts) {
    for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    var _this = this;

    opts = opts !== undefined ? opts : {};

    return new EmberPromise(function (resolve) {
      setTimeout(function () {
        var _lookup;

        resolve((_lookup = _this.lookup(opts.then || 'default')).call.apply(_lookup, [_this].concat(rest)));
      }, ms);
    });
  };

  var EmberPromise = Ember.RSVP.Promise;
});