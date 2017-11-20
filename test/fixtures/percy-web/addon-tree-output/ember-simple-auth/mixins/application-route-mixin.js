define('ember-simple-auth/mixins/application-route-mixin', ['exports', 'ember', 'ember-simple-auth/configuration'], function (exports, _ember, _emberSimpleAuthConfiguration) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var inject = _ember['default'].inject;
  var Mixin = _ember['default'].Mixin;
  var A = _ember['default'].A;
  var bind = _ember['default'].run.bind;
  var testing = _ember['default'].testing;
  var computed = _ember['default'].computed;
  var getOwner = _ember['default'].getOwner;

  /**
    The mixin for the application route, __defining methods that are called when
    the session is successfully authenticated (see
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}})
    or invalidated__ (see
    {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}).
  
    __Using this mixin is optional.__ The session events can also be handled
    manually, e.g. in an instance initializer:
  
    ```js
    // app/instance-initializers/session-events.js
    export function initialize(instance) {
      const applicationRoute = instance.container.lookup('route:application');
      const session          = instance.container.lookup('service:session');
      session.on('authenticationSucceeded', function() {
        applicationRoute.transitionTo('index');
      });
      session.on('invalidationSucceeded', function() {
        applicationRoute.transitionTo('bye');
      });
    };
  
    export default {
      initialize,
      name:  'session-events',
      after: 'ember-simple-auth'
    };
    ```
  
    __When using the `ApplicationRouteMixin` you need to specify
    `needs: ['service:session']` in the application route's unit test.__
  
    @class ApplicationRouteMixin
    @module ember-simple-auth/mixins/application-route-mixin
    @extends Ember.Mixin
    @public
  */
  exports['default'] = Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: inject.service('session'),

    _isFastBoot: computed(function () {
      var fastboot = getOwner(this).lookup('service:fastboot');

      return fastboot ? fastboot.get('isFastBoot') : false;
    }),

    /**
      The route to transition to after successful authentication.
       @property routeAfterAuthentication
      @type String
      @default 'index'
      @public
    */
    routeAfterAuthentication: computed(function () {
      return _emberSimpleAuthConfiguration['default'].routeAfterAuthentication;
    }),

    init: function init() {
      this._super.apply(this, arguments);
      this._subscribeToSessionEvents();
    },

    _subscribeToSessionEvents: function _subscribeToSessionEvents() {
      var _this = this,
          _arguments = arguments;

      A([['authenticationSucceeded', 'sessionAuthenticated'], ['invalidationSucceeded', 'sessionInvalidated']]).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var event = _ref2[0];
        var method = _ref2[1];

        _this.get('session').on(event, bind(_this, function () {
          _this[method].apply(_this, _arguments);
        }));
      });
    },

    /**
      This method handles the session's
      {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
      event. If there is a transition that was previously intercepted by the
      {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}
      AuthenticatedRouteMixin's `beforeModel` method{{/crossLink}} it will retry
      it. If there is no such transition, the `ember_simple_auth-redirectTarget`
      cookie will be checked for a url that represents an attemptedTransition
      that was aborted in Fastboot mode, otherwise this action transitions to the
      {{#crossLink "Configuration/routeAfterAuthentication:property"}}{{/crossLink}}.
        @method sessionAuthenticated
      @public
    */
    sessionAuthenticated: function sessionAuthenticated() {
      var attemptedTransition = this.get('session.attemptedTransition');
      var cookies = getOwner(this).lookup('service:cookies');
      var redirectTarget = cookies.read('ember_simple_auth-redirectTarget');

      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else if (redirectTarget) {
        this.transitionTo(redirectTarget);
        cookies.clear('ember_simple_auth-redirectTarget');
      } else {
        this.transitionTo(this.get('routeAfterAuthentication'));
      }
    },

    /**
      This method handles the session's
      {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
      event. __It reloads the Ember.js application__ by redirecting the browser
      to the application's root URL so that all in-memory data (such as Ember
      Data stores etc.) gets cleared.
       If the Ember.js application will be used in an environment where the users
      don't have direct access to any data stored on the client (e.g.
      [cordova](http://cordova.apache.org)) this action can be overridden to e.g.
      simply transition to the index route.
       @method sessionInvalidated
      @public
    */
    sessionInvalidated: function sessionInvalidated() {
      if (!testing) {
        if (this.get('_isFastBoot')) {
          this.transitionTo(_emberSimpleAuthConfiguration['default'].baseURL);
        } else {
          window.location.replace(_emberSimpleAuthConfiguration['default'].baseURL);
        }
      }
    }
  });
});