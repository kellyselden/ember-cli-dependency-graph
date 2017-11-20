define('ember-scrollable/classes/scrollable', ['exports', 'ember'], function (exports, _ember) {
  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var camelize = _ember['default'].String.camelize;

  var Scrollable = (function () {
    function Scrollable(options) {
      _classCallCheck(this, Scrollable);

      this.scrollbarElement = options.scrollbarElement;
      this.contentElement = options.contentElement;
    }

    _createClass(Scrollable, [{
      key: 'scrollbarSize',
      value: function scrollbarSize() {
        return this.scrollbarElement[this.sizeAttr]();
      }
    }, {
      key: 'contentOuterSize',
      value: function contentOuterSize() {
        return this.contentElement[camelize('outer-' + this.sizeAttr)]();
      }
    }, {
      key: 'getHandlePositionAndSize',
      value: function getHandlePositionAndSize(scrollOffset) {
        // we own this data
        var contentSize = this.contentOuterSize();
        // we pass this to the child
        var scrollbarSize = this.scrollbarSize();
        var scrollbarRatio = scrollbarSize / contentSize;

        // Calculate new height/position of drag handle.
        // Offset of 2px allows for a small top/bottom or left/right margin around handle.
        var handleOffset = Math.round(scrollbarRatio * scrollOffset) + 2;

        var handleSize = 0;

        // check if content is scrollbar is longer than content
        if (scrollbarRatio < 1) {
          var handleSizeCalculated = Math.floor(scrollbarRatio * (scrollbarSize - 2)) - 2;
          // check if handleSize is too small
          handleSize = handleSizeCalculated < 10 ? 10 : handleSizeCalculated;
        }

        return { handleOffset: handleOffset, handleSize: handleSize };
      }
    }, {
      key: 'isScrolledToBottom',
      value: function isScrolledToBottom(scrollBuffer, scrollOffset) {
        var contentSize = this.contentOuterSize();
        var scrollbarSize = this.scrollbarSize();

        return scrollOffset + scrollbarSize + scrollBuffer >= contentSize;
      }
    }, {
      key: 'isNecessary',
      get: function get() {
        return this.scrollbarSize() < this.contentOuterSize();
      }
    }]);

    return Scrollable;
  })();

  exports['default'] = Scrollable;

  var Vertical = (function (_Scrollable) {
    _inherits(Vertical, _Scrollable);

    function Vertical(options) {
      _classCallCheck(this, Vertical);

      _get(Object.getPrototypeOf(Vertical.prototype), 'constructor', this).call(this, options);

      this.offsetAttr = 'top';
      this.sizeAttr = 'height';
    }

    return Vertical;
  })(Scrollable);

  exports.Vertical = Vertical;

  var Horizontal = (function (_Scrollable2) {
    _inherits(Horizontal, _Scrollable2);

    function Horizontal(options) {
      _classCallCheck(this, Horizontal);

      _get(Object.getPrototypeOf(Horizontal.prototype), 'constructor', this).call(this, options);

      this.offsetAttr = 'left';
      this.sizeAttr = 'width';
    }

    return Horizontal;
  })(Scrollable);

  exports.Horizontal = Horizontal;
});