define('ember-changeset/helpers/changeset', ['exports', 'ember', 'ember-changeset', 'ember-changeset/utils/is-changeset', 'ember-changeset/utils/is-promise'], function (exports, _ember, _emberChangeset, _emberChangesetUtilsIsChangeset, _emberChangesetUtilsIsPromise) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.changeset = changeset;
  var helper = _ember['default'].Helper.helper;

  function changeset(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var obj = _ref2[0];
    var validations = _ref2[1];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if ((0, _emberChangesetUtilsIsChangeset['default'])(obj)) {
      return obj;
    }

    if ((0, _emberChangesetUtilsIsPromise['default'])(obj)) {
      return obj.then(function (resolved) {
        return new _emberChangeset['default'](resolved, validations, {}, options);
      });
    }

    return new _emberChangeset['default'](obj, validations, {}, options);
  }

  exports['default'] = helper(changeset);
});