define('travis/services/broadcasts', ['exports', 'travis/config/environment', 'ember-decorators/object', 'ember-decorators/service'], function (exports, _environment, _object, _service) {
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

  var _dec, _desc, _value, _obj, _init, _init2;

  var run = Ember.run;
  var EmberObject = Ember.Object;
  var $ = Ember.$;
  var ArrayProxy = Ember.ArrayProxy;
  var Service = Ember.Service;
  exports.default = Service.extend((_dec = (0, _object.computed)('auth.signedIn'), (_obj = { auth: null,
    storage: null,

    broadcasts: function broadcasts(signedIn) {
      var _this = this;

      var apiEndpoint = void 0,
          broadcasts = void 0,
          options = void 0,
          seenBroadcasts = void 0;
      if (signedIn) {
        broadcasts = ArrayProxy.create({
          content: [],
          lastBroadcastStatus: '',
          isLoading: true
        });

        apiEndpoint = _environment.default.apiEndpoint;
        options = {};
        options.type = 'GET';
        options.headers = {
          Authorization: 'token ' + this.get('auth').token(),
          'Travis-API-Version': '3'
        };
        seenBroadcasts = this.get('storage').getItem('travis.seen_broadcasts');
        if (seenBroadcasts) {
          seenBroadcasts = JSON.parse(seenBroadcasts);
        } else {
          seenBroadcasts = [];
        }
        $.ajax(apiEndpoint + '/broadcasts', options).then(function (response) {
          var receivedBroadcasts = response.broadcasts.reduce(function (processed, broadcast) {
            if (!broadcast.expired && seenBroadcasts.indexOf(broadcast.id.toString()) === -1) {
              processed.unshift(EmberObject.create(broadcast));
            }

            return processed;
          }, []);
          run(function () {
            broadcasts.set('lastBroadcastStatus', _this.getStatus(receivedBroadcasts));
            broadcasts.set('content', receivedBroadcasts);
            broadcasts.set('isLoading', false);
          });
        });
        return broadcasts;
      }
    },
    markAsSeen: function markAsSeen(broadcast) {
      var id = void 0,
          seenBroadcasts = void 0;
      id = broadcast.get('id').toString();
      seenBroadcasts = this.get('storage').getItem('travis.seen_broadcasts');
      if (seenBroadcasts) {
        seenBroadcasts = JSON.parse(seenBroadcasts);
      } else {
        seenBroadcasts = [];
      }
      seenBroadcasts.push(id);
      this.get('storage').setItem('travis.seen_broadcasts', JSON.stringify(seenBroadcasts));
      this.get('broadcasts.content').removeObject(broadcast);
      var status = this.getStatus(this.get('broadcasts.content'));
      this.set('broadcasts.lastBroadcastStatus', status);
    },
    getStatus: function getStatus(broadcastArray) {
      if (!broadcastArray) {
        return '';
      }
      if (broadcastArray.length) {
        if (broadcastArray.findBy('category', 'warning')) {
          return 'warning';
        } else if (broadcastArray.findBy('category', 'announcement')) {
          return 'announcement';
        } else {
          return '';
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'storage', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'storage'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'broadcasts', [_dec], Object.getOwnPropertyDescriptor(_obj, 'broadcasts'), _obj)), _obj)));
});