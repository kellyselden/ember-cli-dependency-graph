define('code-corps-ember/utils/mention-parser', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var get = Ember.get;
  var isPresent = Ember.isPresent;


  function parse(body, mentions) {
    if (isPresent(body) && isPresent(mentions)) {
      return _parseMentions(body, mentions);
    } else {
      return body;
    }
  }

  function _generateLink(mention) {
    var username = get(mention, 'username');
    return '<a href="/' + username + '" class="username">@' + username + '</a>';
  }

  function _parseMentions(body, mentions) {
    var parsedBody = '';
    var currentPosition = 0;

    mentions.forEach(function (mention) {
      var indices = get(mention, 'indices');

      var _indices = _slicedToArray(indices, 2),
          startIndex = _indices[0],
          endIndex = _indices[1];

      parsedBody += body.slice(currentPosition, startIndex);
      parsedBody += _generateLink(mention);
      currentPosition = endIndex + 1;
    });

    parsedBody += body.slice(currentPosition, body.length);

    return parsedBody;
  }

  exports.parse = parse;
});