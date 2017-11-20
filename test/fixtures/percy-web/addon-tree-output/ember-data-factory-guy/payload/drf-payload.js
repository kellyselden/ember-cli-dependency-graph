define('ember-data-factory-guy/payload/drf-payload', ['exports', 'ember-data-factory-guy/payload/json-payload'], function (exports, _jsonPayload) {
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

  var _class = function (_JSONPayload) {
    _inherits(_class, _JSONPayload);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'addMeta',
      value: function addMeta(data) {
        if (this.json.results) {
          Object.assign(this.json, data);
        }
      }
    }, {
      key: 'getListKeys',
      value: function getListKeys(key) {
        var attrs = this.json.results;
        if (Ember.isEmpty(key)) {
          return JSON.parse(JSON.stringify(attrs));
        }
        if (typeof key === 'number') {
          return attrs[key];
        }
        if (key === 'firstObject') {
          return attrs[0];
        }
        if (key === 'lastObject') {
          return attrs[attrs.length - 1];
        }
      }
    }]);

    return _class;
  }(_jsonPayload.default);

  exports.default = _class;
});