define('ember-data-factory-guy/builder/active-model-fixture-builder', ['exports', 'ember-data-factory-guy/builder/fixture-builder', 'ember-data-factory-guy/converter/active-model-fixture-converter', 'ember-data-factory-guy/payload/rest-payload'], function (exports, _fixtureBuilder, _activeModelFixtureConverter, _restPayload) {
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

  var ActiveModelFixtureBuilder = function (_RESTFixtureBuilder) {
    _inherits(ActiveModelFixtureBuilder, _RESTFixtureBuilder);

    function ActiveModelFixtureBuilder(store) {
      _classCallCheck(this, ActiveModelFixtureBuilder);

      return _possibleConstructorReturn(this, (ActiveModelFixtureBuilder.__proto__ || Object.getPrototypeOf(ActiveModelFixtureBuilder)).call(this, store, _activeModelFixtureConverter.default, _restPayload.default));
    }

    /**
     ActiveModelAdapter converts them automatically for status 422
      @param errors
     @returns {*}
     */


    _createClass(ActiveModelFixtureBuilder, [{
      key: 'convertResponseErrors',
      value: function convertResponseErrors(errors, status) {
        if (status === 422) {
          return errors;
        } else {
          return _get(ActiveModelFixtureBuilder.prototype.__proto__ || Object.getPrototypeOf(ActiveModelFixtureBuilder.prototype), 'convertResponseErrors', this).call(this, errors, status);
        }
      }
    }, {
      key: 'normalize',
      value: function normalize(modelName, payload) {
        return _defineProperty({}, modelName, payload);
      }
    }]);

    return ActiveModelFixtureBuilder;
  }(_fixtureBuilder.default);

  exports.default = ActiveModelFixtureBuilder;
});