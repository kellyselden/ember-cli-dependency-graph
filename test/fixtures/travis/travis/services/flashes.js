define('travis/services/flashes', ['exports', 'travis/utils/limited-array', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-decorators/service'], function (exports, _limitedArray, _object, _computed, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2, _init3;

  var run = Ember.run;
  var Service = Ember.Service;


  var messageTypeToIcon = {
    notice: 'icon-flag',
    success: 'flash-success',
    error: 'flash-error'
  };

  var messageTypeToPreamble = {
    notice: 'Heads up!',
    success: 'Hooray!',
    error: 'Oh no!'
  };

  var messageTypeToCloseButton = {
    notice: true,
    success: false,
    error: true
  };

  exports.default = Service.extend((_dec = (0, _computed.alias)('auth.currentUser'), _dec2 = (0, _object.computed)('flashes.[]'), (_obj = { auth: null,
    store: null,

    currentUser: null,

    // This changes when scrolling to adjust flash messages to fixed
    topBarVisible: true,

    init: function init() {
      this._super.apply(this, arguments);

      this.setup();
    },
    setup: function setup() {
      this.set('flashes', _limitedArray.default.create({
        limit: 1,
        content: []
      }));
    },
    messages: function messages(flashes) {
      var model = [];
      if (flashes.length) {
        model.pushObjects(flashes.toArray().reverse());
      }
      return model.uniq();
    },


    // TODO: when we rewrite all of the place where we use `loadFlashes` we could
    // rewrite this class and make the implementation better, because right now
    // it's really complicated for just displaying a flash message (especially
    // that we show only one at the moment anyway). We still get some error
    // messages from API responses in V2 that way, so I think that cleaning this
    // up once we're using V3 would be a good point.
    loadFlashes: function loadFlashes(msgs) {
      var i = void 0,
          len = void 0,
          msg = void 0,
          results = void 0,
          type = void 0;

      results = [];
      for (i = 0, len = msgs.length; i < len; i++) {
        msg = msgs[i];
        type = Object.keys(msg)[0];

        var messageText = void 0,
            preamble = void 0;

        messageText = msg[type].message;
        preamble = msg[type].preamble || messageTypeToPreamble[type];

        msg = {
          type: type,
          message: messageText,
          icon: messageTypeToIcon[type],
          preamble: preamble,
          closeButton: messageTypeToCloseButton[type]
        };
        this.get('flashes').unshiftObject(msg);

        if (!messageTypeToCloseButton[type]) {
          this.removeFlash(msg);
        }
      }
      return results;
    },
    removeFlash: function removeFlash(msg) {
      var _this = this;

      setTimeout(function () {
        run(_this, function () {
          if (_this.get('flashes.content')) {
            return _this.get('flashes.content').removeObject(msg);
          }
        });
      }, 15000);
    },
    close: function close(msg) {
      return this.get('flashes').removeObject(msg);
    },
    clear: function clear() {
      this.setup();
    },
    display: function display(type, message, preamble) {
      if (!['error', 'notice', 'success'].includes(type)) {
        // eslint-disable-next-line
        console.warn("WARNING: <service:flashes> display(type, message) function can only handle 'error', 'notice' and 'success' types");
      }
      this.loadFlashes([_defineProperty({}, type, { message: message, preamble: preamble })]);
    },
    success: function success(message) {
      var preamble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messageTypeToPreamble['success'];

      this.display('success', message, preamble);
    },
    error: function error(message) {
      var preamble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messageTypeToPreamble['error'];

      this.display('error', message, preamble);
    },
    notice: function notice(message) {
      var preamble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messageTypeToPreamble['notice'];

      this.display('notice', message, preamble);
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'messages', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'messages'), _obj)), _obj)));
});