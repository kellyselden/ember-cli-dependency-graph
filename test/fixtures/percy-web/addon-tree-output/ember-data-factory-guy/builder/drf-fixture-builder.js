define('ember-data-factory-guy/builder/drf-fixture-builder', ['exports', 'ember-data-factory-guy/builder/fixture-builder', 'ember-data-factory-guy/converter/drf-fixture-converter', 'ember-data-factory-guy/payload/drf-payload'], function (exports, _fixtureBuilder, _drfFixtureConverter, _drfPayload) {
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

  var DRFFixtureBuilder = function (_JSONFixtureBuilder) {
    _inherits(DRFFixtureBuilder, _JSONFixtureBuilder);

    function DRFFixtureBuilder(store) {
      _classCallCheck(this, DRFFixtureBuilder);

      return _possibleConstructorReturn(this, (DRFFixtureBuilder.__proto__ || Object.getPrototypeOf(DRFFixtureBuilder)).call(this, store, _drfFixtureConverter.default, _drfPayload.default));
    }

    /**
     DRFAdapter converts the errors to a JSONAPI error format for you,
     but the error HAS to have a status of 400 .. but WHY?
      @param errors
     @returns {*}
     */


    _createClass(DRFFixtureBuilder, [{
      key: 'convertResponseErrors',
      value: function convertResponseErrors(errors, status) {
        if (status === 400) {
          return errors;
        } else {
          return _get(DRFFixtureBuilder.prototype.__proto__ || Object.getPrototypeOf(DRFFixtureBuilder.prototype), 'convertResponseErrors', this).call(this, errors, status);
        }
      }
    }]);

    return DRFFixtureBuilder;
  }(_fixtureBuilder.default);

  exports.default = DRFFixtureBuilder;
});