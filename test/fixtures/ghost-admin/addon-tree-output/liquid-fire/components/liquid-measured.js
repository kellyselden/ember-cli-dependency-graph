define('liquid-fire/components/liquid-measured', ['exports', 'liquid-fire/mutation-observer', 'liquid-fire/templates/components/liquid-measured'], function (exports, _mutationObserver, _liquidMeasured) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.measure = measure;
  var next = Ember.run.next;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    layout: _liquidMeasured.default,

    init: function init() {
      this._super.apply(this, arguments);
      this._destroyOnUnload = this._destroyOnUnload.bind(this);
    },


    didInsertElement: function didInsertElement() {
      var self = this;

      // This prevents margin collapse
      this.$().css({
        overflow: 'auto'
      });

      this.didMutate();

      this.observer = new _mutationObserver.default(function (mutations) {
        self.didMutate(mutations);
      });
      this.observer.observe(this.get('element'), {
        attributes: true,
        subtree: true,
        childList: true,
        characterData: true
      });
      this.$().bind('webkitTransitionEnd', function () {
        self.didMutate();
      });
      // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
      window.addEventListener('unload', this._destroyOnUnload);
    },

    willDestroyElement: function willDestroyElement() {
      if (this.observer) {
        this.observer.disconnect();
      }
      window.removeEventListener('unload', this._destroyOnUnload);
    },

    transitionMap: service('liquid-fire-transitions'),

    didMutate: function didMutate() {
      // by incrementing the running transitions counter here we prevent
      // tests from falling through the gap between the time they
      // triggered mutation the time we may actually animate in
      // response.
      var tmap = this.get('transitionMap');
      tmap.incrementRunningTransitions();
      next(this, function () {
        this._didMutate();
        tmap.decrementRunningTransitions();
      });
    },

    _didMutate: function _didMutate() {
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }
      this.set('measurements', measure(elt));
    },

    _destroyOnUnload: function _destroyOnUnload() {
      this.willDestroyElement();
    }
  });
  function measure($elt) {
    var boundingRect = $elt[0].getBoundingClientRect();

    // Calculate the scaling.
    // NOTE: We only handle the simple zoom case.
    var claimedWidth = $elt[0].offsetWidth;

    // Round the width because offsetWidth is rounded
    var actualWidth = Math.round(boundingRect.width);
    var scale = actualWidth > 0 ? claimedWidth / actualWidth : 0;

    return {
      width: boundingRect.width * scale,
      height: boundingRect.height * scale
    };
  }
});