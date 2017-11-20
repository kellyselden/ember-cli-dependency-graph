define("ember-i18n/legacy/helper", ["exports", "ember-i18n/legacy/stream", "ember"], function (exports, _emberI18nLegacyStream, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

  exports["default"] = tHelper;

  var assign = _ember["default"].assign || _ember["default"].merge;

  function tHelper(_ref, hash, options, env) {
    var _ref2 = _slicedToArray(_ref, 2);

    var i18nKey = _ref2[0];
    var _ref2$1 = _ref2[1];
    var contextObject = _ref2$1 === undefined ? { value: function value() {} } : _ref2$1;

    var i18n = env.data.view.container.lookup('service:i18n');

    var out = new _emberI18nLegacyStream["default"](function () {
      var value = i18nKey.isStream ? i18nKey.value() : i18nKey;

      var contextObjectValue = contextObject.value();
      var mergedHash = {};
      assign(mergedHash, contextObjectValue);
      assign(mergedHash, hash);

      return value === undefined ? '' : i18n.t(value, (0, _emberI18nLegacyStream.readHash)(mergedHash));
    });

    // Once the view is destroyed destroy the steam as well
    env.data.view.one('willDestroyElement', out, function () {
      this.destroy();
    });

    if (contextObject && contextObject.isStream) {
      contextObject.subscribe(out.notify, out);
    }

    // observe any hash arguments that are streams:
    Object.keys(hash).forEach(function (key) {
      var value = hash[key];

      if (value && value.isStream) {
        value.subscribe(out.notify, out);
      }
    });

    // observe the locale:
    i18n.localeStream.subscribe(out.notify, out);

    // if the i18n key itself is dynamic, observe it:
    if (i18nKey.isStream) {
      i18nKey.subscribe(out.notify, out);
    }

    return out;
  }
});