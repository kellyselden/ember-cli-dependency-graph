define('travis/components/top-bar', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-decorators/service'], function (exports, _object, _computed, _service) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6, _init7, _init8;

  var run = Ember.run;
  var htmlSafe = Ember.String.htmlSafe;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _service.service)('broadcasts'), _dec2 = (0, _computed.alias)('auth.currentUser'), _dec3 = (0, _object.computed)('user.{login,name}'), _dec4 = (0, _computed.alias)('broadcastsService.broadcasts'), _dec5 = (0, _object.computed)(), _dec6 = (0, _object.computed)('auth.signedIn', 'landingPage', 'features.proVersion'), _dec7 = (0, _object.computed)('tab', 'auth.state'), (_obj = { auth: null,
    store: null,
    externalLinks: null,
    features: null,
    flashes: null,
    broadcastsService: null,

    tagName: 'header',
    classNames: ['top'],
    landingPage: false,

    user: null,

    userName: function userName(login, name) {
      return name || login;
    },
    broadcasts: null,

    deploymentVersion: function deploymentVersion() {
      if (window && window.location) {
        var hostname = window.location.hostname;

        if (hostname.indexOf('ember-beta') === 0 || hostname.indexOf('ember-canary') === 0) {
          return 'Ember ' + Ember.VERSION;
        } else if (hostname.indexOf('test-deployments') > 0) {
          var branchName = hostname.split('.')[0];
          var branchURL = this.get('externalLinks').travisWebBranch(branchName);
          var branchLink = '<a href=\'' + branchURL + '\'><code>' + branchName + '</code></a>';

          return htmlSafe('Test deployment ' + branchLink);
        } else {
          return false;
        }
      } else {
        return false;
      }
    },


    actions: {
      signIn: function signIn() {
        return this.get('signIn')();
      },
      signOut: function signOut() {
        return this.get('signOut')();
      },
      toggleBurgerMenu: function toggleBurgerMenu() {
        this.toggleProperty('is-open');
        return false;
      },
      toggleBroadcasts: function toggleBroadcasts() {
        this.toggleProperty('showBroadcasts');
        return false;
      },
      markBroadcastAsSeen: function markBroadcastAsSeen(broadcast) {
        this.get('broadcastsService').markAsSeen(broadcast);
        return false;
      },
      helpscoutTrigger: function helpscoutTrigger() {
        HS.beacon.open();
        return false;
      }
    },

    showCta: function showCta(signedIn, landingPage, pro) {
      return !signedIn && !landingPage && !pro;
    },
    classProfile: function classProfile(tab, authState) {
      var classes = ['profile menu'];

      if (this.get('tab') === 'profile') {
        classes.push('active');
      }

      classes.push(authState || 'signed-out');

      return classes.join(' ');
    },
    didInsertElement: function didInsertElement() {
      var component = this; // Not pleasant, but I can’t find a better way.

      if (Ember.testing) {
        return;
      }

      var waypoint = new Waypoint.Inview({
        element: this.element,
        exited: function exited() {
          run(function () {
            component.get('flashes').set('topBarVisible', false);
          });
        },
        enter: function enter() {
          run(function () {
            component.get('flashes').set('topBarVisible', true);
          });
        }
      });

      this.set('waypoint', waypoint);
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'store'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'features', [_service.service], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'features'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'broadcastsService', [_dec], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'broadcastsService'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'user', [_dec2], (_init7 = Object.getOwnPropertyDescriptor(_obj, 'user'), _init7 = _init7 ? _init7.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init7;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'userName', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'userName'), _obj), _applyDecoratedDescriptor(_obj, 'broadcasts', [_dec4], (_init8 = Object.getOwnPropertyDescriptor(_obj, 'broadcasts'), _init8 = _init8 ? _init8.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init8;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'deploymentVersion', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'deploymentVersion'), _obj), _applyDecoratedDescriptor(_obj, 'showCta', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'showCta'), _obj), _applyDecoratedDescriptor(_obj, 'classProfile', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'classProfile'), _obj)), _obj)));
});