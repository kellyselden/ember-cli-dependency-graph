define("ember-data-factory-guy/payload/base-payload", ["exports"], function (exports) {
  "use strict";

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

  var w = Ember.String.w;

  var _class = function () {

    /**
     Proxy class for getting access to a json payload.
     Allows you to: 
       - inspect a payload with friendly .get(attr)  syntax 
       - add to json payload with more json built from build and buildList methods.
      @param {String} modelName name of model for payload
     @param {Object} json json payload being proxied
     @param {Boolean} converter the converter that built this json
     */
    function _class(modelName, json, converter) {
      _classCallCheck(this, _class);

      this.modelName = modelName;
      this.json = json;
      this.converter = converter;
      this.listType = converter.listType || false;
      this.proxyMethods = w("getModelPayload isProxy get add unwrap");
      this.wrap(this.proxyMethods);
    }

    /**
     Add another json payload or meta data to this payload
      Typically you would build a payload and add that to another one
      Usage:
     ```
     let batMen = buildList('bat_man', 2);
     let user = build('user').add(batMen);
     ```
      but you can also add meta data:
     ```
     let user = buildList('user', 2).add({meta: { next: '/url?page=3', previous: '/url?page=1'}});
     ```
      @param {Object} optional json built from FactoryGuy build or buildList or
     meta data to add to payload
     @returns {Object} the current json payload
     */


    _createClass(_class, [{
      key: "add",
      value: function add(more) {
        var _this = this;

        this.converter.included = this.json;
        Ember.A(Object.getOwnPropertyNames(more)).reject(function (key) {
          return Ember.A(_this.proxyMethods).includes(key);
        }).forEach(function (key) {
          if (Ember.typeOf(more[key]) === "array") {
            more[key].forEach(function (data) {
              return _this.converter.addToIncluded(data, key);
            });
          } else {
            if (key === "meta") {
              _this.addMeta(more[key]);
            } else {
              _this.converter.addToIncluded(more[key], key);
            }
          }
        });
        return this.json;
      }
    }, {
      key: "addMeta",
      value: function addMeta(data) {
        this.json.meta = this.json.meta || {};
        Object.assign(this.json.meta, data);
      }
    }, {
      key: "isProxy",
      value: function isProxy() {}
    }, {
      key: "getModelPayload",
      value: function getModelPayload() {
        return this.get();
      }
    }, {
      key: "addProxyMethods",
      value: function addProxyMethods(methods) {
        this.proxyMethods = this.proxyMethods.concat(methods);
        this.wrap(methods);
      }
    }, {
      key: "wrap",
      value: function wrap(methods) {
        var _this2 = this;

        methods.forEach(function (method) {
          return _this2.json[method] = _this2[method].bind(_this2);
        });
      }
    }, {
      key: "unwrap",
      value: function unwrap() {
        var _this3 = this;

        this.proxyMethods.forEach(function (method) {
          return delete _this3.json[method];
        });
      }
    }, {
      key: "get",
      value: function get(key) {
        if (this.listType) {
          return this.getListKeys(key);
        }
        return this.getObjectKeys(key);
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});