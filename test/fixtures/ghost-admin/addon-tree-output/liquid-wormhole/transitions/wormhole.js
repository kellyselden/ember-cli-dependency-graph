define('liquid-wormhole/transitions/wormhole', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = wormhole;
  function wormhole(context) {
    var _this = this;

    var use = context.use;


    var oldWormholeElement = void 0,
        newWormholeElement = void 0;

    if (this.oldElement) {
      oldWormholeElement = this.oldElement.find('.liquid-wormhole-element:last-child');

      this.oldElement = null;

      if (oldWormholeElement.length > 0) {
        var newChild = oldWormholeElement.clone();
        newChild.addClass('liquid-wormhole-temp-element');

        oldWormholeElement.css({ visibility: 'hidden' });
        oldWormholeElement.find('.liquid-child').css({ visibility: 'hidden' });

        var offset = oldWormholeElement.offset();

        newChild.css({
          position: 'absolute',
          top: offset.top,
          left: offset.left,
          bottom: '',
          right: '',
          margin: '0px',
          transform: ''
        });

        newChild.appendTo(oldWormholeElement.parent());
        this.oldElement = newChild;
      }
    }

    if (this.newElement) {
      newWormholeElement = this.newElement.find('.liquid-wormhole-element:last-child');

      this.newElement = null;

      if (newWormholeElement.length > 0) {
        var _newChild = newWormholeElement.clone();

        newWormholeElement.css({ visibility: 'hidden' });
        newWormholeElement.find('.liquid-child').css({ visibility: 'hidden' });

        var _offset = newWormholeElement.offset();

        _newChild.css({
          position: 'absolute',
          top: _offset.top,
          left: _offset.left,
          bottom: '',
          right: '',
          margin: '0px',
          transform: ''
        });

        _newChild.appendTo(newWormholeElement.parent());
        this.newElement = _newChild;
      }
    }

    var animation;
    if (typeof use.handler === 'function') {
      animation = use.handler;
    } else {
      animation = context.lookup(use.name);
    }

    return animation.apply(this, use.args).finally(function () {
      if (_this.oldElement && oldWormholeElement) {
        _this.oldElement.remove();
        oldWormholeElement.css({ visibility: 'visible' });
        oldWormholeElement.find('.liquid-child').css({ visibility: 'visible' });
      }
      if (_this.newElement && newWormholeElement) {
        _this.newElement.remove();
        newWormholeElement.css({ visibility: 'visible' });
        newWormholeElement.find('.liquid-child').css({ visibility: 'visible' });
      }
    });
  }
});