define('percy-web/mixins/target-application-actions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isNone = Ember.isNone;
  var getOwner = Ember.getOwner;
  var computed = Ember.computed;
  var Mixin = Ember.Mixin;

  /**
    Targets a component's actions to bubble immediately to the application controller and
    through the route hierarchy, skipping any parent component action handlers.
  
    This allows us to avoid passing redundant args like:
  
      <my-component myAction={{action "myAction"}} myOtherAction={{action "myOtherAction"}}>
  
    ...through many layers of nested components, at the cost of highly-coupling the actions
    to the application and skipping any parent component action handlers along the way.
  
    This mixin should be used for simple components where this high-coupling is desirable.
  */
  var TargetApplicationActionsMixin = Mixin.create({
    target: computed(function () {
      // Note: high-coupling to the container. We always return the main application controller, which
      // will trigger standard bubbling through the route hierarchy if not handled.
      return getOwner(this).lookup('controller:application');
    }),

    send: function send(action) {
      var actionName = this.get(action);
      if (isNone(actionName)) {
        this.set(action, action);
      }
      return this._super.apply(this, arguments); // Pass through all original arguments.
    }
  });

  exports.default = TargetApplicationActionsMixin;
});