define('ember-data-factory-guy/payload/json-api-payload', ['exports', 'ember-data-factory-guy/payload/base-payload'], function (exports, _basePayload) {
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

      _this.data = json.data;
      _this.addProxyMethods(["includes"]);
      return _this;
    }

    _createClass(_class, [{
      key: 'getModelPayload',
      value: function getModelPayload() {
        return this.data;
      }
    }, {
      key: 'add',
      value: function add(more) {
        var _this2 = this;

        if (more.meta) {
          this.addMeta(more.meta);
        } else {
          if (!this.json.included) {
            this.json.included = [];
          }
          this.converter.included = this.json.included;
          // add the main moreJson model payload
          var data = more.getModelPayload();
          if (Ember.typeOf(data) === "array") {
            data.forEach(function (dati) {
              return _this2.converter.addToIncluded(dati);
            });
          } else {
            this.converter.addToIncluded(data);
          }
          // add all of the moreJson's includes
          this.converter.addToIncludedFromProxy(more);
        }
        return this.json;
      }
    }, {
      key: 'createAttrs',
      value: function createAttrs(data) {
        var relationships = {};
        Object.keys(data.relationships || []).forEach(function (key) {
          relationships[key] = data.relationships[key].data;
        });
        var attrs = Ember.$.extend({}, data.attributes, relationships);
        attrs.id = data.id;
        return attrs;
      }
    }, {
      key: 'includes',
      value: function includes() {
        return this.json.included || [];
      }
    }, {
      key: 'getObjectKeys',
      value: function getObjectKeys(key) {
        var attrs = this.createAttrs(this.data);
        if (!key) {
          return attrs;
        }
        if (attrs[key]) {
          return attrs[key];
        }
      }
    }, {
      key: 'getListKeys',
      value: function getListKeys(key) {
        var _this3 = this;

        var attrs = this.data.map(function (data) {
          return _this3.createAttrs(data);
        });
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