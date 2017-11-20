define('code-corps-ember/mixins/can-animate', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var computed = Ember.computed;
  var Mixin = Ember.Mixin;
  var run = Ember.run;
  exports.default = Mixin.create({
    scrollTimeout: 100,
    boundingClientRect: 0,
    windowHeight: 0,
    windowWidth: 0,

    canAnimate: computed('boundingClientRect', 'windowHeight', function () {
      var rect = void 0,
          windowHeight = void 0;
      rect = this.get('boundingClientRect');
      windowHeight = this.get('windowHeight');
      return rect.top <= windowHeight - 150;
    }),

    _updateBoundingClientRect: function _updateBoundingClientRect() {
      var el = void 0;
      el = this.$()[0];
      this.set('boundingClientRect', el.getBoundingClientRect());
    },


    _setup: function () {
      return run.scheduleOnce('afterRender', this, function () {
        this._updateBoundingClientRect();
        this.set('windowHeight', window.innerHeight || document.documentElement.clientHeight);
        this.set('windowWidth', window.innerWidth || document.documentElement.clientWidth);
      });
    }.on('didInsertElement'),

    _scrollHandler: function _scrollHandler() {
      return run.debounce(this, '_updateBoundingClientRect', this.get('scrollTimeout'));
    },


    _bindScroll: function () {
      var scrollHandler = void 0;
      scrollHandler = this._scrollHandler.bind(this);
      $(document).on('touchmove.scrollable', scrollHandler);
      $(window).on('scroll.scrollable', scrollHandler);
    }.on('didInsertElement'),

    _unbindScroll: function () {
      $(window).off('.scrollable');
      $(document).off('.scrollable');
    }.on('willDestroyElement')
  });
});