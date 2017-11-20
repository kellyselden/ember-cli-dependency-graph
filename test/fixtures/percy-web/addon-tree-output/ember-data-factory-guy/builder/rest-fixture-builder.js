define('ember-data-factory-guy/builder/rest-fixture-builder', ['exports', 'ember-data-factory-guy/builder/fixture-builder', 'ember-data-factory-guy/converter/rest-fixture-converter', 'ember-data-factory-guy/payload/rest-payload'], function (exports, _fixtureBuilder, _restFixtureConverter, _restPayload) {
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

  var RESTFixtureBuilder = function (_FixtureBuilder) {
    _inherits(RESTFixtureBuilder, _FixtureBuilder);

    function RESTFixtureBuilder(store) {
      _classCallCheck(this, RESTFixtureBuilder);

      return _possibleConstructorReturn(this, (RESTFixtureBuilder.__proto__ || Object.getPrototypeOf(RESTFixtureBuilder)).call(this, store, _restFixtureConverter.default, _restPayload.default));
    }
    /**
     Map single object to response json.
      Allows custom serializing mappings and meta data to be added to requests.
      @param {String} modelName model name
     @param {Object} json Json object from record.toJSON
     @return {Object} responseJson
     */


    _createClass(RESTFixtureBuilder, [{
      key: 'normalize',
      value: function normalize(modelName, payload) {
        return _defineProperty({}, modelName, payload);
      }
    }]);

    return RESTFixtureBuilder;
  }(_fixtureBuilder.default);

  exports.default = RESTFixtureBuilder;
});