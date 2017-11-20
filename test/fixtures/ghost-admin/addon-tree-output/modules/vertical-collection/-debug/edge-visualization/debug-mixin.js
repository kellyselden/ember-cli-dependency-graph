define('vertical-collection/-debug/edge-visualization/debug-mixin', ['exports', 'vertical-collection/-debug/edge-visualization/visualization', 'vertical-collection/-private', 'vertical-collection/-debug/utils/validate-style'], function (exports, _visualization, _private, _validateStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var assert = Ember.assert,
      Mixin = Ember.Mixin;
  exports.default = Mixin.create({
    debugVis: false,
    debugCSS: false,

    __visualization: null,

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);

      this._radar._debugDidUpdate = function () {
        _this.updateVisualization();
        _this.detectIssuesWithCSS();
      };
    },
    detectIssuesWithCSS: function detectIssuesWithCSS() {
      if (this.get('debugCSS') === false) {
        return;
      }

      var radar = this._radar;
      var styles = void 0;

      // check telescope
      if (radar.scrollContainer !== _private.default) {
        styles = window.getComputedStyle(radar.scrollContainer);
      } else {
        styles = window.getComputedStyle(document.body);
      }

      assert('scrollContainer cannot be inline.', (0, _validateStyle.styleIsOneOf)(styles, 'display', ['block', 'inline-block', 'flex', 'inline-flex']));
      assert('scrollContainer must define position', (0, _validateStyle.styleIsOneOf)(styles, 'position', ['static', 'relative', 'absolute']));
      assert('scrollContainer must define height or max-height', (0, _validateStyle.hasStyleWithNonZeroValue)(styles, 'height') || (0, _validateStyle.hasStyleWithNonZeroValue)(styles, 'max-height'));

      // conditional perf check for non-body scrolling
      if (radar.scrollContainer !== _private.default) {
        assert('scrollContainer must define overflow-y', (0, _validateStyle.hasStyleValue)(styles, 'overflow-y', 'scroll') || (0, _validateStyle.hasStyleValue)(styles, 'overflow', 'scroll'));
      }

      // check itemContainer
      styles = window.getComputedStyle(radar.itemContainer);

      assert('itemContainer cannot be inline.', (0, _validateStyle.styleIsOneOf)(styles, 'display', ['block', 'inline-block', 'flex', 'inline-flex']));
      assert('itemContainer must define position', (0, _validateStyle.styleIsOneOf)(styles, 'position', ['static', 'relative', 'absolute']));

      // check item defaults
      assert('You must supply at least one item to the collection to debug it\'s CSS.', this.get('items.length'));

      var element = radar.itemContainer.firstElementChild;

      styles = window.getComputedStyle(element);

      assert('Item cannot be inline.', (0, _validateStyle.styleIsOneOf)(styles, 'display', ['block', 'inline-block', 'flex', 'inline-flex']));
      assert('Item must define position', (0, _validateStyle.styleIsOneOf)(styles, 'position', ['static', 'relative', 'absolute']));
    },
    updateVisualization: function updateVisualization() {
      if (this.get('debugVis') === false) {
        if (this.__visualization !== null) {
          console.info('tearing down existing visualization'); // eslint-disable-line no-console
          this.__visualization.destroy();
          this.__visualization = null;
        }
        return;
      }

      if (this.__visualization === null) {
        this.__visualization = new _visualization.default(this._radar);
      }

      this.__visualization.render();
    },
    willDestroy: function willDestroy() {
      this._super();
      if (this.__visualization) {
        console.info('destroying visualization'); // eslint-disable-line no-console
        this.__visualization.destroy();
        this.__visualization = null;
      }
    }
  });
});