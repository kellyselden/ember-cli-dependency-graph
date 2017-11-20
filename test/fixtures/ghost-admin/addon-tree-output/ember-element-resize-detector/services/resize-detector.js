define("ember-element-resize-detector/services/resize-detector", ["exports", "ember"], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

  var error = _ember["default"].Logger.error;
  exports["default"] = _ember["default"].Service.extend({

    init: function init() {
      this._super.apply(this, arguments);
      this.detector = elementResizeDetectorMaker({
        strategy: "scroll"
      });
    },

    setup: function setup(selector, callback) {
      var _Ember$$$toArray = _ember["default"].$(selector).toArray();

      var _Ember$$$toArray2 = _slicedToArray(_Ember$$$toArray, 1);

      var element = _Ember$$$toArray2[0];

      if (!element) {
        error("service:resize-detector - could not find an element matching " + selector);
        return;
      }
      this.detector.listenTo(element, callback);
    },

    teardown: function teardown(selector, callback) {
      var _Ember$$$toArray3 = _ember["default"].$(selector).toArray();

      var _Ember$$$toArray32 = _slicedToArray(_Ember$$$toArray3, 1);

      var element = _Ember$$$toArray32[0];

      if (element) {
        this.detector.removeListener(element, callback);
      }
    }

  });
});
/* global elementResizeDetectorMaker */