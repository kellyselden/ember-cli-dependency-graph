define('ember-data-factory-guy/mocks/request-wrapper', ['exports', 'ember-data-factory-guy/utils/helper-functions'], function (exports, _helperFunctions) {
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

  var RequestWrapper = function () {
    function RequestWrapper() {
      _classCallCheck(this, RequestWrapper);

      this.index = 0;
      this.handlers = [];
      return this.generateRequestHandler();
    }

    /**
     * Generating a function that we can hand off to pretender that
     * will handle the request.
     *
     * Before passing back that function, add some other functions
     * to control the handlers array
     *
     * @returns {function(this:T)}
     */


    _createClass(RequestWrapper, [{
      key: 'generateRequestHandler',
      value: function generateRequestHandler() {
        var _this = this;

        var requestHandler = this.handleRequest.bind(this),
            methods = ['getHandlers', 'addHandler', 'removeHandler'];
        methods.forEach(function (method) {
          return requestHandler[method] = _this[method].bind(_this);
        });
        return requestHandler;
      }
    }, {
      key: 'getHandlers',
      value: function getHandlers(request) {
        if (request && !(0, _helperFunctions.isEmptyObject)(request.queryParams)) {
          // reverse sort so query comes before findAll
          return this.handlers.sort(RequestWrapper.reverseSortByRequestType);
        }
        return this.handlers;
      }
    }, {
      key: 'addHandler',
      value: function addHandler(handler) {
        this.handlers.push(handler);
        return this.index++;
      }
    }, {
      key: 'removeHandler',
      value: function removeHandler(handler) {
        this.handlers = this.handlers.filter(function (h) {
          return h.mockId !== handler.mockId;
        });
      }
    }, {
      key: 'handleRequest',
      value: function handleRequest(request) {
        var handler = this.getHandlers(request).find(function (handler) {
          return handler.matches(request);
        });
        if (handler) {
          var _handler$getResponse = handler.getResponse(),
              status = _handler$getResponse.status,
              headers = _handler$getResponse.headers,
              responseText = _handler$getResponse.responseText;

          return [status, headers, responseText];
        }
      }
    }], [{
      key: 'reverseSortByRequestType',
      value: function reverseSortByRequestType(a, b) {
        if (b.requestType < a.requestType) {
          return -1;
        }
        return b.requestType > a.requestType ? 1 : 0;
      }
    }]);

    return RequestWrapper;
  }();

  exports.default = RequestWrapper;
});