define('ember-macro-helpers/normalize-array-key', ['exports'], function (exports) {
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

    var i = array.indexOf('.@each');
    if (i !== -1) {
      var chain = array.split('.');
      var end = chain[chain.length - 1];
      if (end.indexOf('{') === 0) {
        props = end.substring(1, end.length - 1).split(',');
      } else {
        props = [end];
      }
    } else {
      i = array.indexOf('.[]');
      props = [];
    }

    if (i !== -1) {
      array = array.substr(0, i);
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
      suffix = '[]';
    } else {
      suffix = '@each.';
      if (props.length === 1) {
        suffix += props[0];
      } else {
        suffix += '{' + props.join(',') + '}';
      }
    }

    return array + '.' + suffix;
  };
});