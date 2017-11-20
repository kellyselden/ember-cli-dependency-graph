define('ember-click-outside/mixins/click-outside', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var computed = Ember.computed;

  var bound = function bound(fnName) {
    return computed(fnName, function () {
      var fn = this.get(fnName);
      if (fn) {
        // https://github.com/zeppelin/ember-click-outside/issues/1
        return fn.bind(this);
      }
    });
  };
  var supportsTouchEvents = function supportsTouchEvents() {
    return 'ontouchstart' in window || window.navigator.msMaxTouchPoints;
  };

  exports.default = Ember.Mixin.create({
    clickOutside: function clickOutside() {},

    clickHandler: bound('outsideClickHandler'),

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      if (!supportsTouchEvents()) {
        return;
      }

      $('body').css('cursor', 'pointer');
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      if (!supportsTouchEvents()) {
        return;
      }

      $('body').css('cursor', '');
    },
    outsideClickHandler: function outsideClickHandler(e) {
      var element = this.get('element');
      var $target = $(e.target);
      var isInside = $target.closest(element).length === 1;

      if (!isInside) {
        this.clickOutside(e);
      }
    },
    addClickOutsideListener: function addClickOutsideListener() {
      var clickHandler = this.get('clickHandler');
      $(window).on('click', clickHandler);
    },
    removeClickOutsideListener: function removeClickOutsideListener() {
      var clickHandler = this.get('clickHandler');
      $(window).off('click', clickHandler);
    }
  });
});