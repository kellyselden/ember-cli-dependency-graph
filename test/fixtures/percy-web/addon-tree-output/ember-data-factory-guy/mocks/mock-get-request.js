define('ember-data-factory-guy/mocks/mock-get-request', ['exports', 'ember-data-factory-guy/factory-guy', 'ember-data/model', 'ember-data-factory-guy/mocks/mock-request', 'ember-data-factory-guy/utils/helper-functions'], function (exports, _factoryGuy, _model, _mockRequest, _helperFunctions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var assign = Ember.assign || Ember.merge;

  var MockGetRequest = function (_MockRequest) {
    _inherits(MockGetRequest, _MockRequest);

    function MockGetRequest(modelName, requestType, defaultResponse) {
      _classCallCheck(this, MockGetRequest);

      var _this = _possibleConstructorReturn(this, (MockGetRequest.__proto__ || Object.getPrototypeOf(MockGetRequest)).call(this, modelName, requestType));

      if (defaultResponse !== undefined) {
        _this.setResponseJson(_this.fixtureBuilder.convertForBuild(modelName, defaultResponse));
      }
      _this.validReturnsKeys = [];
      _this.queryParams = {};
      return _this;
    }

    /**
     Used for inspecting the response that this mock will generate
      Usually the args will be an attribute like 'id', but it might
     also be a number like 0 or 1 for and index to list types.
      Ideally the responseJson is a JSONProxy class so the logic can be handed off there.
     Otherwise it's a plain object which is rare ( so the logic is not great )
      @param args
     @returns {*}
     */


    _createClass(MockGetRequest, [{
      key: 'get',
      value: function get(args) {
        var json = this.responseJson;
        if (json) {
          if (json.get) {
            return json.get(args);
          }
          // if this becomes issue, make this search more robust
          return json[args];
        }
      }
    }, {
      key: 'setValidReturnsKeys',
      value: function setValidReturnsKeys(validKeys) {
        this.validReturnsKeys = validKeys;
      }
    }, {
      key: 'validateReturnsOptions',
      value: function validateReturnsOptions(options) {
        var responseKeys = Object.keys(options);
        Ember.assert('[ember-data-factory-guy] You can pass zero or one key to \'returns\',\n                you passed these keys: ' + responseKeys, responseKeys.length <= 1);

        var _responseKeys = _slicedToArray(responseKeys, 1),
            responseKey = _responseKeys[0];

        Ember.assert('[ember-data-factory-guy] You passed an invalid key for \'returns\' function.\n      Valid keys are ' + this.validReturnsKeys + '. You used this key: ' + responseKey, Ember.A(this.validReturnsKeys).includes(responseKey));
        return responseKey;
      }
    }, {
      key: 'returns',
      value: function returns() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var responseKey = this.validateReturnsOptions(options);
        this.setReturns(responseKey, options);
        return this;
      }
    }, {
      key: 'setReturns',
      value: function setReturns(responseKey, options) {
        var json = void 0,
            model = void 0,
            models = void 0,
            modelName = this.modelName;

        switch (responseKey) {
          case 'id':
            // if you want to return existing model with an id, set up the json
            // as if it might be found, but check later during request match to
            // see if it really exists
            json = { id: options.id };
            this.idSearch = true;
            this.setResponseJson(this.fixtureBuilder.convertForBuild(modelName, json));
            break;

          case 'model':
            model = options.model;

            Ember.assert('argument ( model ) must be a Model instance - found type:\'\n          ' + Ember.typeOf(model), model instanceof _model.default);

            json = { id: model.id };
            this.setResponseJson(this.fixtureBuilder.convertForBuild(modelName, json));
            break;

          case 'ids':
            {
              var store = _factoryGuy.default.store;
              models = options.ids.map(function (id) {
                return store.peekRecord(modelName, id);
              });
              this.returns({ models: models });
              break;
            }
          case 'models':
            {
              models = options.models;
              Ember.assert('argument ( models ) must be an array - found type:\'\n          ' + Ember.typeOf(models), Ember.isArray(models));

              json = models.map(function (model) {
                return { id: model.id, type: model.constructor.modelName };
              });

              json = this.fixtureBuilder.convertForBuild(modelName, json);
              this.setResponseJson(json);
              break;
            }
          case 'json':
            json = options.json;
            if (!json.get) {
              // need to wrap a payload so the json can at least respond to 'get' method
              this.fixtureBuilder.wrapPayload(modelName, json);
            }
            this.setResponseJson(json);
            break;

          case 'attrs':
            {
              var currentId = this.responseJson.get('id'),
                  modelParams = assign({ id: currentId }, options.attrs);
              json = this.fixtureBuilder.convertForBuild(modelName, modelParams);
              this.setResponseJson(json);
              break;
            }
          case 'headers':
            this.addResponseHeaders(options.headers);
            break;
        }
      }
    }, {
      key: 'setResponseJson',
      value: function setResponseJson(json) {
        this.responseJson = json;
        this.setupHandler();
      }
    }, {
      key: 'withParams',
      value: function withParams(queryParams) {
        this.queryParams = queryParams;
        return this;
      }
    }, {
      key: 'withSomeParams',
      value: function withSomeParams(someQueryParams) {
        this.someQueryParams = someQueryParams;
        return this;
      }
    }, {
      key: 'paramsMatch',
      value: function paramsMatch(request) {
        if (!(0, _helperFunctions.isEmptyObject)(this.someQueryParams)) {
          return (0, _helperFunctions.isPartOf)(request.queryParams, (0, _helperFunctions.toParams)(this.someQueryParams));
        }
        if (!(0, _helperFunctions.isEmptyObject)(this.queryParams)) {
          return (0, _helperFunctions.isEquivalent)(request.queryParams, (0, _helperFunctions.toParams)(this.queryParams));
        }
        return true;
      }
    }, {
      key: 'extraRequestMatches',
      value: function extraRequestMatches(settings) {
        return this.paramsMatch(settings);
      }
    }]);

    return MockGetRequest;
  }(_mockRequest.default);

  exports.default = MockGetRequest;
});