define('ember-data-factory-guy/builder/fixture-builder', ['exports', 'ember-data-factory-guy/converter/jsonapi-fixture-converter'], function (exports, _jsonapiFixtureConverter) {
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

  var _class = function () {
    function _class(store, converterClass, payloadClass) {
      _classCallCheck(this, _class);

      this.store = store;
      this.converterClass = converterClass;
      this.payloadClass = payloadClass;
    }

    _createClass(_class, [{
      key: 'getConverter',
      value: function getConverter(options) {
        return new this.converterClass(this.store, options);
      }
    }, {
      key: 'wrapPayload',
      value: function wrapPayload(modelName, json) {
        var converter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.getConverter();

        new this.payloadClass(modelName, json, converter);
      }
    }, {
      key: 'transformKey',
      value: function transformKey(modelName, key) {
        var converter = this.getConverter(),
            model = this.store.modelFor(modelName),
            relationshipsByName = Ember.get(model, 'relationshipsByName'),
            relationship = relationshipsByName.get(key);
        if (relationship) {
          return converter.transformRelationshipKey(relationship);
        }
        var transformKeyFunction = converter.getTransformKeyFunction(modelName, 'Attribute');
        return transformKeyFunction(key);
      }
    }, {
      key: 'normalize',
      value: function normalize(modelName, payload) {
        return payload;
      }
    }, {
      key: 'convertForBuild',
      value: function convertForBuild(modelName, fixture, converterOptions) {
        var converter = this.getConverter(converterOptions);
        if (!fixture) {
          return converter.emptyResponse(modelName, converterOptions);
        }
        var json = converter.convert(modelName, fixture);
        this.wrapPayload(modelName, json, converter);
        return json;
      }
    }, {
      key: 'convertForMake',
      value: function convertForMake(modelName, fixture) {
        var converter = new _jsonapiFixtureConverter.default(this.store, { transformKeys: false });
        return converter.convert(modelName, fixture);
      }
    }, {
      key: 'convertResponseErrors',
      value: function convertResponseErrors(object) {
        var jsonAPIErrors = [];
        Ember.assert('[ember-data-factory-guy] Your error response must have an errors key. The errors hash format is: {errors: {name: ["name too short"]}}', object.errors);
        var errors = object.errors;
        for (var key in errors) {
          var description = Ember.typeOf(errors[key]) === "array" ? errors[key][0] : errors[key],
              source = { pointer: "data/attributes/" + key },
              newError = { detail: description, title: "invalid " + key, source: source };
          jsonAPIErrors.push(newError);
        }
        return { errors: jsonAPIErrors };
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});