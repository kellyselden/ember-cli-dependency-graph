define('package-hint-historic-resolver/utils/get-repo', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getRepo;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function getRepo(url) {
    if (!url) {
      return;
    }

    if (url.indexOf('/', url.length - 1) !== -1) {
      url = url.substr(0, url.length - 1);
    }
    var fragments = url.split('/');
    if (fragments.length < 2) {
      return;
    }

    var _fragments$reverse = fragments.reverse(),
        _fragments$reverse2 = _slicedToArray(_fragments$reverse, 2),
        repo = _fragments$reverse2[0],
        user = _fragments$reverse2[1];

    return user + '/' + repo;
  }
});