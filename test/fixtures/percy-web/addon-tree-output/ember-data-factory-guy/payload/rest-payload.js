define('ember-data-factory-guy/payload/rest-payload', ['exports', 'ember-data-factory-guy/payload/base-payload'], function (exports, _basePayload) {
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

  var _class = function (_BasePayload) {
    _inherits(_class, _BasePayload);

    function _class(modelName, json, converter) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, modelName, json, converter));

      _this.payloadKey = converter.getPayloadKey(modelName);
      _this.addProxyMethods(['includeKeys', 'getInclude']);
      return _this;
    }

    _createClass(_class, [{
      key: 'includeKeys',
      value: function includeKeys() {
        var _this2 = this;

        var keys = Ember.A(Object.keys(this.json)).reject(function (key) {
          return _this2.payloadKey === key;
        });
        return Ember.A(keys).reject(function (key) {
          return Ember.A(_this2.proxyMethods).includes(key);
        }) || [];
      }
    }, {
      key: 'getInclude',
      value: function getInclude(modelType) {
        return this.json[modelType];
      }
    }, {
      key: 'getObjectKeys',
      value: function getObjectKeys(key) {
        var attrs = this.json[this.payloadKey];
        if (Ember.isEmpty(key)) {
          return attrs;
        }
        return attrs[key];
      }
    }, {
      key: 'getListKeys',
      value: function getListKeys(key) {
        var attrs = this.json[this.payloadKey];
        if (Ember.isEmpty(key)) {
          return attrs;
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
  }(_basePayload.default);

  exports.default = _class;
});