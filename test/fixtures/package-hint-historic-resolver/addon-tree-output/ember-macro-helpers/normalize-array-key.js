define('ember-macro-helpers/normalize-array-key', ['exports', 'ember-macro-helpers/-constants'], function (exports, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (array) {
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // this macro support should be extracted out
    // we should only deal with string keys in here
    if (typeof array !== 'string') {
      return array;
    }

    var props = void 0;

    var i = array.indexOf(_constants.ARRAY_EACH);
    if (i !== -1) {
      var chain = array.split('.');
      var end = chain[chain.length - 1];
      if (end.indexOf('{') === 0) {
        props = end.substring(1, end.length - 1).split(',');
      } else {
        props = [end];
      }
    } else {
      i = array.indexOf(_constants.ARRAY_LENGTH);
      props = [];
    }

    if (i === 0) {
      // empty string will be handled later by `getValue`
      // and will convert to `this`
      array = '';
    } else if (i > 0) {
      array = array.slice(0, i - 1);
    }

    keys.forEach(function (key) {
      // key could be a promise proxy and not resolved yet
      if (key === undefined) {
        return;
      }

      if (props.indexOf(key) === -1) {
        props.push(key);
      }
    });

    var suffix = void 0;
    if (props.length === 0) {
      suffix = _constants.ARRAY_LENGTH;
    } else {
      suffix = _constants.ARRAY_EACH;
      if (props.length === 1) {
        suffix += props[0];
      } else {
        suffix += '{' + props.join(',') + '}';
      }
    }

    return isBlank(array) ? suffix : array + '.' + suffix;
  };

  var isBlank = Ember.isBlank;
});