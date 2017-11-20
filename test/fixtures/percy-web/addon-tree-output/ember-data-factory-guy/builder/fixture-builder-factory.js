define('ember-data-factory-guy/builder/fixture-builder-factory', ['exports', 'require', 'ember-data', 'ember-data-factory-guy/builder/jsonapi-fixture-builder', 'ember-data-factory-guy/builder/rest-fixture-builder', 'ember-data-factory-guy/builder/json-fixture-builder', 'ember-data-factory-guy/builder/drf-fixture-builder', 'ember-data-factory-guy/builder/active-model-fixture-builder'], function (exports, _require2, _emberData, _jsonapiFixtureBuilder, _restFixtureBuilder, _jsonFixtureBuilder, _drfFixtureBuilder, _activeModelFixtureBuilder) {
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

  var ActiveModelSerializer = void 0,
      DjangoSerializer = void 0;
  try {
    var activeModel = (0, _require2.default)('active-model-adapter');
    ActiveModelSerializer = activeModel.ActiveModelSerializer;
  } catch (e) {
    // do nothing
  }

  try {
    var drf = (0, _require2.default)('ember-django-adapter/serializers/drf');
    DjangoSerializer = drf && drf.default;
  } catch (e) {
    // do nothing
  }

  var _class = function () {
    function _class(store) {
      _classCallCheck(this, _class);

      this.store = store;
    }

    /**
     Return appropriate FixtureBuilder for the model's serializer type
     */


    _createClass(_class, [{
      key: 'fixtureBuilder',
      value: function fixtureBuilder(modelName) {
        var serializer = this.store.serializerFor(modelName);
        if (!serializer) {
          return new _jsonapiFixtureBuilder.default(this.store);
        }
        if (this.usingJSONAPISerializer(serializer)) {
          return new _jsonapiFixtureBuilder.default(this.store);
        }
        if (this.usingDRFSerializer(serializer)) {
          return new _drfFixtureBuilder.default(this.store);
        }
        if (this.usingActiveModelSerializer(serializer)) {
          return new _activeModelFixtureBuilder.default(this.store);
        }
        if (this.usingRESTSerializer(serializer)) {
          return new _restFixtureBuilder.default(this.store);
        }
        if (this.usingJSONSerializer(serializer)) {
          return new _jsonFixtureBuilder.default(this.store);
        }
        return new _jsonapiFixtureBuilder.default(this.store);
      }
    }, {
      key: 'usingJSONAPISerializer',
      value: function usingJSONAPISerializer(serializer) {
        return serializer instanceof _emberData.default.JSONAPISerializer;
      }
    }, {
      key: 'usingDRFSerializer',
      value: function usingDRFSerializer(serializer) {
        return DjangoSerializer && serializer instanceof DjangoSerializer;
      }
    }, {
      key: 'usingActiveModelSerializer',
      value: function usingActiveModelSerializer(serializer) {
        return ActiveModelSerializer && serializer instanceof ActiveModelSerializer;
      }
    }, {
      key: 'usingRESTSerializer',
      value: function usingRESTSerializer(serializer) {
        return serializer instanceof _emberData.default.RESTSerializer;
      }
    }, {
      key: 'usingJSONSerializer',
      value: function usingJSONSerializer(serializer) {
        return serializer instanceof _emberData.default.JSONSerializer;
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});