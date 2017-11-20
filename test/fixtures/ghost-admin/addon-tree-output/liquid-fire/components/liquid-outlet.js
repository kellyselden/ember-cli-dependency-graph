define('liquid-fire/components/liquid-outlet', ['exports', 'liquid-fire/templates/components/liquid-outlet', 'liquid-fire/ember-internals'], function (exports, _liquidOutlet, _emberInternals) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;


  var LiquidOutlet = Component.extend({
    layout: _liquidOutlet.default,
    positionalParams: ['inputOutletName'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
    tagName: '',
    versionEquality: computed('outletName', 'watchModels', function () {
      var outletName = this.get('outletName');
      var watchModels = this.get('watchModels');
      return function (oldValue, newValue) {
        var oldChild = (0, _emberInternals.childRoute)(oldValue, outletName);
        var newChild = (0, _emberInternals.childRoute)(newValue, outletName);
        return (0, _emberInternals.routeIsStable)(oldChild, newChild) && (!watchModels || (0, _emberInternals.modelIsStable)(oldChild, newChild));
      };
    }),
    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      this.set('outletName', this.get('inputOutletName') || 'main');
    }
  });

  LiquidOutlet.reopenClass({
    positionalParams: ['inputOutletName']
  });

  exports.default = LiquidOutlet;
});