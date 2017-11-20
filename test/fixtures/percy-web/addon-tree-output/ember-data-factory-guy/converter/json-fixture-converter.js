define('ember-data-factory-guy/converter/json-fixture-converter', ['exports', 'ember-data-factory-guy/converter/fixture-converter'], function (exports, _fixtureConverter) {
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

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

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
      underscore = _Ember$String.underscore,
      dasherize = _Ember$String.dasherize;

  var _class = function (_Converter) {
    _inherits(_class, _Converter);

    function _class(store, options) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, store, options));

      _this.defaultKeyTransformFn = underscore;
      _this.polymorphicTypeTransformFn = underscore;
      return _this;
    }

    /**
     * Can't add to payload since sideloading not supported
     *
     * @param moreJson
     */


    _createClass(_class, [{
      key: 'add',
      value: function add() /*moreJson*/{}
    }, {
      key: 'createPayload',
      value: function createPayload(_, fixture) {
        return fixture;
      }
    }, {
      key: 'addIncludedArray',
      value: function addIncludedArray() /*payload*/{}
    }, {
      key: 'convertSingle',
      value: function convertSingle(modelName, fixture) {
        var data = {},
            attributes = this.extractAttributes(modelName, fixture),
            relationships = this.extractRelationships(modelName, fixture);

        Object.keys(attributes).forEach(function (key) {
          data[key] = attributes[key];
        });
        Object.keys(relationships).forEach(function (key) {
          data[key] = relationships[key];
        });

        this.addPrimaryKey(modelName, data, fixture);

        return data;
      }
    }, {
      key: 'transformRelationshipKey',
      value: function transformRelationshipKey(relationship) {
        var transformedKey = _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'transformRelationshipKey', this).call(this, relationship);
        if (relationship.options.polymorphic) {
          transformedKey = transformedKey.replace('_id', '');
        }
        return transformedKey;
      }
    }, {
      key: 'normalizeAssociation',
      value: function normalizeAssociation(record, relationship) {
        if (this.serializeMode) {
          return record.id;
        }
        if (Ember.typeOf(record) === 'object') {
          if (relationship.options.polymorphic) {
            return { type: dasherize(record.type), id: record.id };
          } else {
            return record.id;
          }
        }
        // it's a model instance
        if (relationship.options.polymorphic) {
          return { type: dasherize(record.constructor.modelName), id: record.id };
        }
        return record.id;
      }
    }, {
      key: 'addToIncluded',
      value: function addToIncluded() /*data, modelKey*/{}
    }, {
      key: 'addToIncludedFromProxy',
      value: function addToIncludedFromProxy() /*proxy*/{}
    }]);

    return _class;
  }(_fixtureConverter.default);

  exports.default = _class;
});