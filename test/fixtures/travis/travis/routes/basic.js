define('travis/routes/basic', ['exports', 'ember-decorators/service'], function (exports, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _desc, _value, _obj, _init, _init2;

  var reject = Ember.RSVP.reject;
  var Route = Ember.Route;
  exports.default = Route.extend((_obj = { auth: null,
    featureFlags: null,

    activate: function activate() {
      if (this.routeName !== 'error') {
        this.controllerFor('error').set('layoutName', null);
      }
      return this._super.apply(this, arguments);
    },
    beforeModel: function beforeModel(transition) {
      if (!this.signedIn()) {
        this.auth.autoSignIn();
      }
      if (!this.signedIn() && this.get('needsAuth')) {
        this.auth.set('afterSignInTransition', transition);
        return reject('needs-auth');
      } else if (this.redirectToProfile(transition)) {
        return this.transitionTo('profile', this.get('auth.currentUser.login'));
      } else {
        return this._super.apply(this, arguments);
      }
    },
    signedIn: function signedIn() {
      return this.get('auth.currentUser');
    },
    redirectToProfile: function redirectToProfile(transition) {
      // make this hack the least invasive it can be
      var targetName = transition.targetName;
      var params = transition.params;

      if (targetName === 'owner.repositories' && params.owner && params.owner.owner && params.owner.owner === 'profile') {
        this.transitionTo('account', this.get('auth.currentUser.login'), {
          queryParams: { offset: 0 }
        });
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'featureFlags', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'featureFlags'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj));
});