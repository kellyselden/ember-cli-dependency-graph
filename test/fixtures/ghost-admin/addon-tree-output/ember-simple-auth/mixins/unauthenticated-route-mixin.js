define('ember-simple-auth/mixins/unauthenticated-route-mixin', ['exports', 'ember-simple-auth/configuration'], function (exports, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service,
      Mixin = Ember.Mixin,
      assert = Ember.assert,
      computed = Ember.computed,
      getOwner = Ember.getOwner;
  exports.default = Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: service('session'),

    _isFastBoot: computed(function () {
      var fastboot = getOwner(this).lookup('service:fastboot');

      return fastboot ? fastboot.get('isFastBoot') : false;
    }),

    /**
      The route to transition to if a route that implements the
      {{#crossLink "UnauthenticatedRouteMixin"}}{{/crossLink}} is accessed when
      the session is authenticated.
       @property routeIfAlreadyAuthenticated
      @type String
      @default 'index'
      @public
    */
    routeIfAlreadyAuthenticated: computed(function () {
      return _configuration.default.routeIfAlreadyAuthenticated;
    }),

    /**
      Checks whether the session is authenticated and if it is aborts the current
      transition and instead transitions to the
      {{#crossLink "Configuration/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}.
       __If `beforeModel` is overridden in a route that uses this mixin, the route's
     implementation must call `this._super(...arguments)`__ so that the mixin's
     `beforeModel` method is actually executed.
       @method beforeModel
      @param {Transition} transition The transition that lead to this route
      @public
    */
    beforeModel: function beforeModel() {
      if (this.get('session').get('isAuthenticated')) {
        var routeIfAlreadyAuthenticated = this.get('routeIfAlreadyAuthenticated');
        assert('The route configured as Configuration.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== routeIfAlreadyAuthenticated);

        this.transitionTo(routeIfAlreadyAuthenticated);
      } else {
        return this._super.apply(this, arguments);
      }
    }
  });
});