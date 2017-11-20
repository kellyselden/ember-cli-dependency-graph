define('ember-data-factory-guy/mocks/mock-request', ['exports', 'ember-data-factory-guy/utils/helper-functions', 'ember-data-factory-guy/factory-guy', 'ember-data-factory-guy/mocks/request-manager'], function (exports, _helperFunctions, _factoryGuy, _requestManager) {
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

  var assign = Ember.assign || Ember.merge;

  var _class = function () {
    function _class(modelName, requestType) {
      _classCallCheck(this, _class);

      this.modelName = modelName;
      this.requestType = requestType;
      this.fixtureBuilder = _factoryGuy.default.fixtureBuilder(this.modelName);
      this.status = 200;
      this.responseHeaders = {};
      this.responseJson = null;
      this.errorResponse = null;
      this.isDisabled = false;
      this.isDestroyed = false;
      this.timesCalled = 0;
    }

    //  with(options={}) {
    //  }

    /**
     * Set the adapter options that this mockCreate will be using
     *
     * @param {Object} options adapterOptions
     */


    _createClass(_class, [{
      key: 'withAdapterOptions',
      value: function withAdapterOptions(options) {
        this.adapterOptions = options;
        this.setupHandler();
        return this;
      }
    }, {
      key: 'get',
      value: function get() {
        if ((arguments.length <= 0 ? undefined : arguments[0]) === 'id') {
          return this.id;
        }
      }
    }, {
      key: 'getUrl',
      value: function getUrl() {
        return _factoryGuy.default.buildURL(this.modelName, this.get('id'), this.makeFakeSnapshot(), this.requestType, this.queryParams);
      }
    }, {
      key: 'makeFakeSnapshot',
      value: function makeFakeSnapshot() {
        return { adapterOptions: this.adapterOptions, record: this.model };
      }
    }, {
      key: 'getType',
      value: function getType() {
        return "GET";
      }
    }, {
      key: 'returns',
      value: function returns() /*options = {}*/{}
    }, {
      key: 'addResponseHeaders',
      value: function addResponseHeaders(headers) {
        assign(this.responseHeaders, headers);
      }
    }, {
      key: 'succeeds',
      value: function succeeds() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.status = opts.status || 200;
        this.errorResponse = null;
        return this;
      }
    }, {
      key: 'isErrorStatus',
      value: function isErrorStatus(status) {
        return !!status.toString().match(/^([345]\d{2})/);
      }
    }, {
      key: 'fails',
      value: function fails() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var convertErrors = opts.hasOwnProperty('convertErrors') ? opts.convertErrors : true,
            status = opts.status || 500,
            response = opts.response || null;
        Ember.assert('[ember-data-factory-guy] \'fails\' method status code must be 3XX, 4XX or 5XX,\n        you are using: ' + status, this.isErrorStatus(status));

        this.status = status;
        this.errorResponse = response;

        if (response && convertErrors) {
          var errors = this.fixtureBuilder.convertResponseErrors(response, this.status);
          this.errorResponse = errors;
        }

        return this;
      }
    }, {
      key: 'actualResponseJson',
      value: function actualResponseJson() {
        var responseText = this.isErrorStatus(this.status) ? this.errorResponse : this.responseJson;
        return JSON.stringify(responseText);
      }
    }, {
      key: 'getResponse',
      value: function getResponse() {
        return {
          responseText: this.actualResponseJson(),
          headers: this.responseHeaders,
          status: this.status
        };
      }
    }, {
      key: 'logInfo',
      value: function logInfo() {
        if (_factoryGuy.default.logLevel > 0) {
          var _console;

          var json = JSON.parse(this.getResponse().responseText),
              name = this.constructor.name.replace('Request', ''),
              type = this.getType(),
              status = '[' + this.status + ']',
              url = this.getUrl();

          var fullUrl = url;
          if (!(0, _helperFunctions.isEmptyObject)(this.queryParams)) {
            fullUrl = [url, '?', Ember.$.param(this.queryParams)].join('');
          }

          var info = ['[factory-guy]', name, type, status, fullUrl, json];

          (_console = console).log.apply(_console, info);
        }
      }
    }, {
      key: 'paramsMatch',
      value: function paramsMatch() {
        return true;
      }
    }, {
      key: 'extraRequestMatches',
      value: function extraRequestMatches() /*request*/{
        return true;
      }
    }, {
      key: 'matches',
      value: function matches(request) {
        if (this.isDisabled) {
          return false;
        }

        if (!this.extraRequestMatches(request)) {
          return false;
        }

        this.timesCalled++;
        this.logInfo();

        if (this.useOnce) {
          this.disable();
        }

        return true;
      }
    }, {
      key: 'oldUrl',
      value: function oldUrl() {
        return this.mockId && this.mockId.url;
      }
    }, {
      key: 'changedUrl',
      value: function changedUrl() {
        return this.getUrl() !== this.oldUrl();
      }
    }, {
      key: 'setupHandler',
      value: function setupHandler() {
        if (!this.mockId) {
          _requestManager.default.addHandler(this);
        } else if (this.changedUrl()) {
          _requestManager.default.replaceHandler(this);
        }
      }
    }, {
      key: 'singleUse',
      value: function singleUse() {
        this.useOnce = true;
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.isDisabled = true;
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.isDisabled = false;
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        _requestManager.default.removeHandler(this);
        this.isDestroyed = true;
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});