define('ember-data-factory-guy/factory-guy', ['exports', 'ember-data', 'ember-data-factory-guy/model-definition', 'ember-data-factory-guy/builder/fixture-builder-factory', 'ember-data-factory-guy/mocks/request-manager'], function (exports, _emberData, _modelDefinition, _fixtureBuilderFactory, _requestManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.clearStore = exports.buildList = exports.build = exports.makeList = exports.makeNew = exports.make = undefined;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
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

  //const assign = Ember.assign || Ember.merge;
  var modelDefinitions = {};

  /**
  
   @param {String} name a fixture name could be model name like 'person'
   or a named person in model definition like 'dude'
   @returns {ModelDefinition} ModelDefinition associated with model or undefined if not found
   */
  var lookupDefinitionForFixtureName = function lookupDefinitionForFixtureName(name) {
    for (var model in modelDefinitions) {
      var definition = modelDefinitions[model];
      if (definition.matchesName(name)) {
        return definition;
      }
    }
  };

  /**
   Given a fixture name like 'person' or 'dude' determine what model this name
   refers to. In this case it's 'person' for each one.
  
   @param {String} name  a fixture name could be model name like 'person'
   or a named person in model definition like 'dude'
   @returns {String} model  name associated with fixture name or undefined if not found
   */
  var lookupModelForFixtureName = function lookupModelForFixtureName(name) {
    var definition = lookupDefinitionForFixtureName(name);
    if (definition) {
      return definition.modelName;
    }
  };

  var extractArgumentsShort = function extractArgumentsShort() {
    var opts = {};

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (Ember.typeOf(args[args.length - 1]) === 'object') {
      opts = args.pop();
    }
    // whatever is left are traits
    var traits = Ember.A(args).compact();
    return { opts: opts, traits: traits };
  };

  /**
   extract arguments for build and make function
   @param {String} name  fixture name
   @param {String} trait  optional trait names ( one or more )
   @param {Object} opts  optional fixture options that will override default fixture values
   @returns {Object} json fixture
   */
  var extractArguments = function extractArguments() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var name = args.shift();
    if (!name) {
      throw new Error('Build needs a factory name to build');
    }
    return Object.assign({ name: name }, extractArgumentsShort.apply(this, args));
  };

  var FactoryGuy = function () {
    function FactoryGuy() {
      _classCallCheck(this, FactoryGuy);
    }

    _createClass(FactoryGuy, [{
      key: 'settings',
      value: function settings() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$logLevel = _ref.logLevel,
            logLevel = _ref$logLevel === undefined ? 0 : _ref$logLevel,
            _ref$responseTime = _ref.responseTime,
            responseTime = _ref$responseTime === undefined ? null : _ref$responseTime;

        _requestManager.default.settings({ responseTime: responseTime });
        this.logLevel = logLevel;
      }
    }, {
      key: 'setStore',
      value: function setStore(aStore) {
        Ember.assert("FactoryGuy#setStore needs a valid store instance.You passed in [" + aStore + "]", aStore instanceof _emberData.default.Store);
        this.store = aStore;
        this.fixtureBuilderFactory = new _fixtureBuilderFactory.default(this.store);

        aStore.willDestroy = function () {
          this._super.apply(this, arguments);
          this.store = null;
          this.fixtureBuilderFactory = null;
        };
      }
    }, {
      key: 'fixtureBuilder',
      value: function fixtureBuilder(modelName) {
        return this.fixtureBuilderFactory.fixtureBuilder(modelName);
      }
    }, {
      key: 'updateHTTPMethod',
      value: function updateHTTPMethod(modelName) {
        return this.fixtureBuilder(modelName).updateHTTPMethod || 'PUT';
      }
    }, {
      key: 'define',
      value: function define(model, config) {
        modelDefinitions[model] = new _modelDefinition.default(model, config);
      }
    }, {
      key: 'findModelDefinition',
      value: function findModelDefinition(model) {
        return modelDefinitions[model];
      }
    }, {
      key: 'generate',
      value: function generate(nameOrFunction) {
        var sortaRandomName = Math.floor((1 + Math.random()) * 65536).toString(16) + Date.now();
        return function () {
          // this function will be called by ModelDefinition, which has it's own generate method
          if (Ember.typeOf(nameOrFunction) === 'function') {
            return this.generate(sortaRandomName, nameOrFunction);
          } else {
            return this.generate(nameOrFunction);
          }
        };
      }
    }, {
      key: 'belongsTo',
      value: function belongsTo(fixtureName, opts) {
        var _this = this;

        return function () {
          return _this.buildRaw(fixtureName, opts);
        };
      }
    }, {
      key: 'hasMany',
      value: function hasMany() {
        var _this2 = this;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return function () {
          return _this2.buildRawList.apply(_this2, args);
        };
      }
    }, {
      key: 'build',
      value: function build() {
        var args = extractArguments.apply(this, arguments),
            fixture = this.buildRaw.apply(this, arguments),
            modelName = lookupModelForFixtureName(args.name);

        return this.fixtureBuilder(modelName).convertForBuild(modelName, fixture);
      }
    }, {
      key: 'buildRaw',
      value: function buildRaw() {
        var args = extractArguments.apply(this, arguments),
            definition = lookupDefinitionForFixtureName(args.name);

        if (!definition) {
          throw new Error('Can\'t find that factory named [' + args.name + ']');
        }

        return definition.build(args.name, args.opts, args.traits);
      }
    }, {
      key: 'buildList',
      value: function buildList() {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        Ember.assert("buildList needs at least a name ( of model or named factory definition )", args.length > 0);

        var list = this.buildRawList.apply(this, arguments),
            name = args.shift(),
            modelName = lookupModelForFixtureName(name);

        return this.fixtureBuilder(modelName).convertForBuild(modelName, list);
      }
    }, {
      key: 'buildRawList',
      value: function buildRawList() {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        var name = args.shift(),
            definition = lookupDefinitionForFixtureName(name);
        if (!definition) {
          throw new Error("Can't find that factory named [" + name + "]");
        }
        var number = args[0] || 0;
        if (typeof number === 'number') {
          args.shift();
          var parts = extractArgumentsShort.apply(this, args);
          return definition.buildList(name, number, parts.traits, parts.opts);
        } else {
          return args.map(function (innerArgs) {
            if (Ember.typeOf(innerArgs) !== 'array') {
              innerArgs = [innerArgs];
            }
            var parts = extractArgumentsShort.apply(this, innerArgs);
            return definition.build(name, parts.opts, parts.traits);
          });
        }
      }
    }, {
      key: 'make',
      value: function make() {
        var _this3 = this;

        var args = extractArguments.apply(this, arguments);

        Ember.assert('FactoryGuy does not have the application\'s store.\n       Use manualSetup(this.container) in model/component test\n       before using make/makeList', this.store);

        var modelName = lookupModelForFixtureName(args.name),
            fixture = this.buildRaw.apply(this, arguments),
            data = this.fixtureBuilder(modelName).convertForMake(modelName, fixture),
            model = Ember.run(function () {
          return _this3.store.push(data);
        }),
            definition = lookupDefinitionForFixtureName(args.name);

        if (definition.hasAfterMake()) {
          definition.applyAfterMake(model, args.opts);
        }
        return model;
      }
    }, {
      key: 'makeNew',
      value: function makeNew() {
        var _this4 = this;

        var args = extractArguments.apply(this, arguments);

        Ember.assert('FactoryGuy does not have the application\'s store.\n       Use manualSetup(this.container) in model/component test\n       before using makeNew', this.store);

        var modelName = lookupModelForFixtureName(args.name),
            fixture = this.buildRaw.apply(this, arguments);
        delete fixture.id;

        var data = this.fixtureBuilder(modelName).convertForBuild(modelName, fixture, { transformKeys: false });

        return Ember.run(function () {
          return _this4.store.createRecord(modelName, data.get());
        });
      }
    }, {
      key: 'makeList',
      value: function makeList() {
        var _this5 = this;

        Ember.assert('FactoryGuy does not have the application\'s store.\n       Use manualSetup(this.container) in model/component test\n       before using make/makeList', this.store);

        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        Ember.assert("makeList needs at least a name ( of model or named factory definition )", args.length >= 1);

        var name = args.shift(),
            definition = lookupDefinitionForFixtureName(name);
        Ember.assert("Can't find that factory named [" + name + "]", !!definition);

        var number = args[0] || 0;
        if (typeof number === 'number') {
          args.shift();
          var arr = [];
          for (var i = 0; i < number; i++) {
            arr.push(this.make.apply(this, [name].concat(args)));
          }
          return arr;
        }

        return args.map(function (innerArgs) {
          if (Ember.typeOf(innerArgs) !== 'array') {
            innerArgs = [innerArgs];
          }
          return _this5.make.apply(_this5, [name].concat(_toConsumableArray(innerArgs)));
        });
      }
    }, {
      key: 'clearStore',
      value: function clearStore() {
        this.resetDefinitions();
        this.clearModels();
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.resetDefinitions();
        this.resetMockAjax();
      }
    }, {
      key: 'resetMockAjax',
      value: function resetMockAjax() {
        _requestManager.default.reset();
      }
    }, {
      key: 'resetDefinitions',
      value: function resetDefinitions() {
        for (var model in modelDefinitions) {
          var definition = modelDefinitions[model];
          definition.reset();
        }
      }
    }, {
      key: 'clearModels',
      value: function clearModels() {
        this.store.unloadAll();
      }
    }, {
      key: 'clearDefinitions',
      value: function clearDefinitions(opts) {
        if (!opts) {
          this.modelDefinitions = {};
        }
      }
    }, {
      key: 'buildURL',
      value: function buildURL(modelName) {
        var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var snapshot = arguments[2];
        var requestType = arguments[3];
        var queryParams = arguments[4];

        var adapter = this.store.adapterFor(modelName);
        return adapter.buildURL(modelName, id, snapshot, requestType, queryParams);
      }
    }, {
      key: 'cacheOnlyMode',
      value: function cacheOnlyMode() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$except = _ref2.except,
            except = _ref2$except === undefined ? [] : _ref2$except;

        var store = this.store;
        var findAdapter = store.adapterFor.bind(store);

        store.adapterFor = function (name) {
          var adapter = findAdapter(name);
          var shouldCache = function shouldCache() {
            if (Ember.isPresent(except)) {
              return Ember.A(except).includes(name);
            }
            return false;
          };
          adapter.shouldBackgroundReloadAll = shouldCache;
          adapter.shouldBackgroundReloadRecord = shouldCache;
          adapter.shouldReloadRecord = shouldCache;
          adapter.shouldReloadAll = shouldCache;
          return adapter;
        };
      }
    }]);

    return FactoryGuy;
  }();

  var factoryGuy = new FactoryGuy(),
      make = factoryGuy.make.bind(factoryGuy),
      makeNew = factoryGuy.makeNew.bind(factoryGuy),
      makeList = factoryGuy.makeList.bind(factoryGuy),
      build = factoryGuy.build.bind(factoryGuy),
      buildList = factoryGuy.buildList.bind(factoryGuy),
      clearStore = factoryGuy.clearStore.bind(factoryGuy);

  exports.make = make;
  exports.makeNew = makeNew;
  exports.makeList = makeList;
  exports.build = build;
  exports.buildList = buildList;
  exports.clearStore = clearStore;
  exports.default = factoryGuy;
});