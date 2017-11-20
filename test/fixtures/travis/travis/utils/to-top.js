define('travis/utils/to-top', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var throttle = Ember.run.throttle;

  exports.default = function () {
    // NOTE: I could have probably extract fixed positioning from
    //       Tailing, but then I would need to parametrize positionElement
    //       function to make it flexible to handle both cases. In that
    //       situation I prefer a bit less DRY code over simplicity of
    //       the calculations.

    function ToTop(window, elementSelector, containerSelector) {
      var _this = this;

      this.window = window;
      this.elementSelector = elementSelector;
      this.containerSelector = containerSelector;
      this.position = this.window.scrollTop();
      this.window.scroll(function () {
        throttle(_this, _this.onScroll, [], 200, false);
      });
      return this;
    }

    ToTop.prototype.element = function () {
      return $(this.elementSelector);
    };

    ToTop.prototype.container = function () {
      return $(this.containerSelector);
    };

    ToTop.prototype.onScroll = function () {
      return this.positionElement();
    };

    ToTop.prototype.positionElement = function () {
      var container = void 0,
          containerHeight = void 0,
          element = void 0,
          max = void 0,
          offset = void 0,
          windowHeight = void 0;
      element = this.element();
      container = this.container();
      if (element.length === 0) {
        return;
      }
      containerHeight = container.outerHeight();
      windowHeight = this.window.height();
      offset = container.offset().top + containerHeight - (this.window.scrollTop() + windowHeight);
      max = containerHeight - windowHeight;
      if (offset > max) {
        offset = max;
      }
      if (offset > 0) {
        return element.css({
          bottom: offset + 4
        });
      } else {
        return element.css({
          bottom: 2
        });
      }
    };

    return ToTop;
  }();
});