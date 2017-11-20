define('ember-cli-string-helpers/helpers/truncate', ['exports', 'ember-helper'], function (exports, _emberHelper) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.truncate = truncate;

  function truncate(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var string = _ref2[0];
    var _ref2$1 = _ref2[1];
    var characterLimit = _ref2$1 === undefined ? 140 : _ref2$1;

    var limit = characterLimit - 3;

    if (string && string.length > limit) {
      return string.substring(0, limit) + '...';
    } else {
      return string;
    }
  }

  exports['default'] = (0, _emberHelper.helper)(truncate);
});