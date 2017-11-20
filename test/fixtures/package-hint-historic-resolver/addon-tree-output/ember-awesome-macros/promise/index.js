define('ember-awesome-macros/promise/index', ['exports', 'ember-awesome-macros/promise/all', 'ember-awesome-macros/promise/array', 'ember-awesome-macros/promise/hash', 'ember-awesome-macros/promise/object', 'ember-awesome-macros/promise/resolve', 'ember-awesome-macros/promise/then'], function (exports, _all, _array, _hash, _object, _resolve, _then) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'all', {
    enumerable: true,
    get: function () {
      return _all.default;
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function () {
      return _array.default;
    }
  });
  Object.defineProperty(exports, 'hash', {
    enumerable: true,
    get: function () {
      return _hash.default;
    }
  });
  Object.defineProperty(exports, 'object', {
    enumerable: true,
    get: function () {
      return _object.default;
    }
  });
  Object.defineProperty(exports, 'resolve', {
    enumerable: true,
    get: function () {
      return _resolve.default;
    }
  });
  Object.defineProperty(exports, 'then', {
    enumerable: true,
    get: function () {
      return _then.default;
    }
  });
});