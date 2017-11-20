define('ember-data-factory-guy/mocks/request-manager', ['exports', 'ember-data-factory-guy/mocks/request-wrapper', 'pretender'], function (exports, _requestWrapper, _pretender) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var wrappers = {},
      pretender = null,
      delay = 0;

  /**
   * RequestManager controls setting up pretender to handle the mocks that are
   * created.
   *
   * For each request type / url like [GET /users] or [POST /user/1]
   * the request manager will assign a RequestWrapper class to handle it's response.
   *
   * This class will take the mock handler classes and assign them to a wrapper,
   * and also allow you to remove the handler or replace it from it's current
   * wrapper to new one.
   */

  var _class = function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
      key: 'settings',
      value: function settings() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            responseTime = _ref.responseTime;

        if (Ember.isPresent(responseTime)) {
          delay = responseTime;
        }
        // return current settings
        return { responseTime: delay };
      }
    }, {
      key: 'getKey',
      value: function getKey(type, url) {
        return [type, url].join(' ');
      }
    }, {
      key: 'assignMockId',
      value: function assignMockId(type, url, num, handler) {
        handler.mockId = { type: type, url: url, num: num };
      }
    }, {
      key: 'addHandler',
      value: function addHandler(handler) {
        var _getTypeUrl = this.getTypeUrl(handler),
            type = _getTypeUrl.type,
            url = _getTypeUrl.url,
            key = this.getKey(type, url),
            wrapper = wrappers[key];

        if (!wrapper) {
          wrapper = new _requestWrapper.default();
          this.getPretender()[type.toLowerCase()].call(pretender, url, wrapper, delay);
          wrappers[key] = wrapper;
        }

        var index = wrapper.addHandler(handler);
        this.assignMockId(type, url, index, handler);
      }
    }, {
      key: 'removeHandler',
      value: function removeHandler(handler) {
        var _handler$mockId = handler.mockId,
            type = _handler$mockId.type,
            url = _handler$mockId.url,
            key = this.getKey(type, url),
            wrapper = wrappers[key];


        if (wrapper) {
          wrapper.removeHandler(handler);
        }
      }
    }, {
      key: 'replaceHandler',
      value: function replaceHandler(handler) {
        this.removeHandler(handler);
        this.addHandler(handler);
      }
    }, {
      key: 'findWrapper',
      value: function findWrapper(_ref2) {
        var handler = _ref2.handler,
            type = _ref2.type,
            url = _ref2.url;

        if (handler) {
          type = handler.getType();
          url = handler.getUrl();
        }
        var key = this.getKey(type, url);
        return wrappers[key];
      }
    }, {
      key: 'getTypeUrl',
      value: function getTypeUrl(handler) {
        return { type: handler.getType(), url: handler.getUrl() };
      }
    }, {
      key: 'adHockMock',
      value: function adHockMock(_ref3) {
        var url = _ref3.url,
            type = _ref3.type,
            responseText = _ref3.responseText;

        var responseHandler = function responseHandler() {
          return [200, {}, JSON.stringify(responseText)];
        };
        this.getPretender()[type.toLowerCase()].call(pretender, url, responseHandler, delay);
      }
    }, {
      key: 'reset',
      value: function reset() {
        wrappers = {};
        pretender && pretender.shutdown();
        pretender = null;
        delay = 0;
      }
    }, {
      key: 'getPretender',
      value: function getPretender() {
        if (!pretender) {
          pretender = new _pretender.default();
        }
        return pretender;
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});