define('ember-data-factory-guy/converter/rest-fixture-converter', ['exports', 'ember-data-factory-guy/converter/json-fixture-converter'], function (exports, _jsonFixtureConverter) {
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

  var _Ember$String = Ember.String,
      pluralize = _Ember$String.pluralize,
      dasherize = _Ember$String.dasherize;

  var _class = function (_JSONFixtureConverter) {
    _inherits(_class, _JSONFixtureConverter);

    function _class(store, options) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, store, options));

      _this.included = {};
      return _this;
    }

    _createClass(_class, [{
      key: 'emptyResponse',
      value: function emptyResponse(modelName) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return _defineProperty({}, modelName, options.useValue || null);
      }
    }, {
      key: 'createPayload',
      value: function createPayload(modelName, fixture) {
        return _defineProperty({}, this.getPayloadKey(modelName), fixture);
      }
    }, {
      key: 'getPayloadKey',
      value: function getPayloadKey(modelName) {
        var serializer = this.store.serializerFor(modelName),
            payloadKey = modelName;
        // model fragment serializer does not have payloadKeyFromModelName method
        if (serializer.payloadKeyFromModelName) {
          payloadKey = serializer.payloadKeyFromModelName(modelName);
        }
        return this.listType ? pluralize(payloadKey) : payloadKey;
      }
    }, {
      key: 'addIncludedArray',
      value: function addIncludedArray(payload) {
        var _this2 = this;

        Object.keys(this.included).forEach(function (key) {
          if (!payload[key]) {
            payload[key] = _this2.included[key];
          } else {
            Array.prototype.push.apply(payload[key], _this2.included[key]);
          }
        });
      }
    }, {
      key: 'addToIncluded',
      value: function addToIncluded(data, modelKey) {
        var relationshipKey = pluralize(dasherize(modelKey));

        if (!this.included[relationshipKey]) {
          this.included[relationshipKey] = [];
        }

        var modelRelationships = this.included[relationshipKey],
            found = Ember.A(modelRelationships).find(function (existing) {
          return existing.id === data.id;
        });

        if (!found) {
          modelRelationships.push(data);
        }
      }
    }, {
      key: 'addToIncludedFromProxy',
      value: function addToIncludedFromProxy(proxy) {
        var _this3 = this;

        proxy.includeKeys().forEach(function (modelKey) {
          var includedModels = proxy.getInclude(modelKey);
          includedModels.forEach(function (data) {
            _this3.addToIncluded(data, modelKey);
          });
        });
      }
    }]);

    return _class;
  }(_jsonFixtureConverter.default);

  exports.default = _class;
});