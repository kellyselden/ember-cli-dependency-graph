define('ember-data-factory-guy/converter/jsonapi-fixture-converter', ['exports', 'ember-data-factory-guy/converter/fixture-converter'], function (exports, _fixtureConverter) {
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

  var dasherize = Ember.String.dasherize;

  var JSONAPIFixtureConverter = function (_Converter) {
    _inherits(JSONAPIFixtureConverter, _Converter);

    function JSONAPIFixtureConverter(store) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { transformKeys: true, serializeMode: false };

      _classCallCheck(this, JSONAPIFixtureConverter);

      var _this = _possibleConstructorReturn(this, (JSONAPIFixtureConverter.__proto__ || Object.getPrototypeOf(JSONAPIFixtureConverter)).call(this, store, options));

      _this.typeTransformFn = _this.serializeMode ? _this.typeTransformViaSerializer : dasherize;
      _this.defaultKeyTransformFn = dasherize;
      _this.polymorphicTypeTransformFn = dasherize;
      _this.included = [];
      return _this;
    }

    _createClass(JSONAPIFixtureConverter, [{
      key: 'typeTransformViaSerializer',
      value: function typeTransformViaSerializer(modelName) {
        var serializer = this.store.serializerFor(modelName);
        return serializer.payloadKeyFromModelName(modelName);
      }
    }, {
      key: 'emptyResponse',
      value: function emptyResponse(_) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return { data: options.useValue || null };
      }
    }, {
      key: 'createPayload',
      value: function createPayload(modelName, fixture) {
        return { data: fixture };
      }
    }, {
      key: 'addIncludedArray',
      value: function addIncludedArray(payload) {
        if (!Ember.isEmpty(this.included)) {
          payload.included = this.included;
        }
      }
    }, {
      key: 'normalizeAssociation',
      value: function normalizeAssociation(record) {
        if (Ember.typeOf(record) === 'object') {
          return { type: this.typeTransformFn(record.type), id: record.id };
        } else {
          return { type: this.typeTransformFn(record.constructor.modelName), id: record.id };
        }
      }
    }, {
      key: 'isEmbeddedRelationship',
      value: function isEmbeddedRelationship() /*modelName, attr*/{
        return false;
      }
    }, {
      key: 'convertSingle',
      value: function convertSingle(modelName, fixture) {
        var polymorphicType = fixture.type;
        if (polymorphicType && fixture._notPolymorphic) {
          polymorphicType = modelName;
          delete fixture._notPolymorphic;
        }
        var data = {
          type: this.typeTransformFn(polymorphicType || modelName),
          attributes: this.extractAttributes(modelName, fixture)
        };

        this.addPrimaryKey(modelName, data, fixture);

        var relationships = this.extractRelationships(modelName, fixture);
        if (Object.getOwnPropertyNames(relationships).length > 0) {
          data.relationships = relationships;
        }
        return data;
      }
    }, {
      key: 'addToIncluded',
      value: function addToIncluded(data) {
        var found = Ember.A(this.included).find(function (model) {
          return model.id === data.id && model.type === data.type;
        });
        if (!found) {
          this.included.push(data);
        }
      }
    }, {
      key: 'addToIncludedFromProxy',
      value: function addToIncludedFromProxy(proxy) {
        var _this2 = this;

        proxy.includes().forEach(function (data) {
          _this2.addToIncluded(data);
        });
      }
    }, {
      key: 'assignRelationship',
      value: function assignRelationship(object) {
        return { data: object };
      }
    }]);

    return JSONAPIFixtureConverter;
  }(_fixtureConverter.default);

  exports.default = JSONAPIFixtureConverter;
});