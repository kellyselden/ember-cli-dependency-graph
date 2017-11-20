define('code-corps-ember/helpers/highlight-substrings', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.highlightSubstrings = highlightSubstrings;

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

  var Helper = Ember.Helper;
  var isEmpty = Ember.isEmpty;
  function highlightSubstrings(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        string = _ref2[0],
        substring = _ref2[1];

    if (isEmpty(substring) || isEmpty(string)) {
      return string;
    }
    var substrings = substring.split(' ').uniq();
    var positionsToAdd = [];
    var newString = [];
    var count = 0;
    var strongTagLocations = [];

    _findPositionsToAdd(positionsToAdd, string, substrings, newString);
    _assembleArrayOfStrings(positionsToAdd, newString, count, strongTagLocations);
    return _assembleOutputString(newString);
  }

  function _findPositionsToAdd(positionsToAdd, string, substrings, newString) {
    for (var i = 0; i < string.length; i++) {
      newString.push(string.charAt(i));
      for (var e = 0; e < substrings.length; e++) {
        var stringOfSize = string.substring(i, substrings[e].length + i).toLowerCase();
        var substringToMatch = substrings[e].toLowerCase();
        if (stringOfSize === substringToMatch) {
          positionsToAdd.push({
            index: i,
            stringLength: substringToMatch.length
          });
        }
      }
    }
  }

  function _assembleArrayOfStrings(positionsToAdd, newString, count, strongTagLocations) {
    for (var i = 0; i < positionsToAdd.length; i++) {
      var canProceed = true;
      var startIndex = positionsToAdd[i].index;
      var stringLength = positionsToAdd[i].stringLength;

      var firstLocation = startIndex + count;
      var lastLocation = firstLocation + (stringLength + 1);

      canProceed = _checkIfLocationInLocations(firstLocation, strongTagLocations);

      if (canProceed) {
        newString.splice(firstLocation, 0, '<strong>');
        newString.splice(lastLocation, 0, '</strong>');
        strongTagLocations.push({ start: firstLocation, end: lastLocation });
        count += 2;
      }
    }
  }

  function _assembleOutputString(arrayOfStrings) {
    var outputString = '';
    for (var i = 0; i < arrayOfStrings.length; i++) {
      outputString += arrayOfStrings[i];
    }
    return outputString;
  }

  function _checkIfLocationInLocations(location, locations) {
    var result = true;
    locations.forEach(function (searchedLocation) {
      if (location <= searchedLocation.end) {
        result = false;
      }
    });
    return result;
  }

  exports.default = Helper.helper(highlightSubstrings);
});