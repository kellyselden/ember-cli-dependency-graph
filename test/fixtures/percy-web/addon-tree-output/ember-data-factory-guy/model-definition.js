define('ember-data-factory-guy/model-definition', ['exports', 'ember-data-factory-guy/factory-guy', 'ember-data-factory-guy/sequence', 'ember-data-factory-guy/missing-sequence-error', 'ember-data-factory-guy/utils/helper-functions', 'require'], function (exports, _factoryGuy, _sequence, _missingSequenceError, _helperFunctions, _require2) {
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

  var Fragment = void 0;
  try {
    var MF = (0, _require2.default)('ember-data-model-fragments');
    Fragment = MF && MF.default.Fragment;
  } catch (e) {}
  // do nothing


  /**
   A ModelDefinition encapsulates a model's definition
  
   @param model
   @param config
   @constructor
   */

  var ModelDefinition = function () {
    function ModelDefinition(model, config) {
      _classCallCheck(this, ModelDefinition);

      this.modelName = model;
      this.modelId = 1;
      this.originalConfig = (0, _helperFunctions.mergeDeep)({}, config);
      this.parseConfig(Ember.copy(config));
    }

    /**
     Returns a model's full relationship if the field is a relationship.
      @param {String} field  field you want to relationship info for
     @returns {DS.Relationship} relationship object if the field is a relationship, null if not
     */


    _createClass(ModelDefinition, [{
      key: 'getRelationship',
      value: function getRelationship(field) {
        var modelClass = _factoryGuy.default.store.modelFor(this.modelName);
        var relationship = Ember.get(modelClass, 'relationshipsByName').get(field);
        return relationship || null;
      }
    }, {
      key: 'isModelAFragment',
      value: function isModelAFragment() {
        if (Fragment) {
          var type = _factoryGuy.default.store.modelFor(this.modelName);
          return Fragment.detect(type);
        }
        return false;
      }
    }, {
      key: 'modelFragmentInfo',
      value: function modelFragmentInfo(attribute) {
        var modelClass = _factoryGuy.default.store.modelFor(this.modelName);
        return Ember.get(modelClass, 'attributes').get(attribute);
      }
    }, {
      key: 'isModelFragmentAttribute',
      value: function isModelFragmentAttribute(attribute) {
        var info = this.modelFragmentInfo(attribute);
        return !!(info && info.type && info.type.match('mf-fragment'));
      }
    }, {
      key: 'fragmentType',
      value: function fragmentType(attribute) {
        var info = this.modelFragmentInfo(attribute);
        var match = info.type.match('mf-fragment\\$(.*)');
        return match[1];
      }
    }, {
      key: 'matchesName',
      value: function matchesName(name) {
        return this.modelName === name || this.namedModels[name];
      }
    }, {
      key: 'nextId',
      value: function nextId() {
        return this.modelId++;
      }
    }, {
      key: 'backId',
      value: function backId() {
        return this.modelId--;
      }
    }, {
      key: 'generate',
      value: function generate(name, sequenceFn) {
        if (sequenceFn) {
          if (!this.sequences[name]) {
            // create and add that sequence function on the fly
            this.sequences[name] = new _sequence.default(sequenceFn);
          }
        }
        var sequence = this.sequences[name];
        if (!sequence) {
          throw new _missingSequenceError.default('Can not find that sequence named [' + name + '] in \'' + this.modelName + '\' definition');
        }
        return sequence.next();
      }
    }, {
      key: 'build',
      value: function build(name, opts, traitArgs) {
        var _this = this;

        var traitsObj = {};
        traitArgs.forEach(function (trait) {
          Ember.assert('You\'re trying to use a trait [' + trait + '] for model ' + _this.modelName + ' but that trait can\'t be found.', _this.traits[trait]);
          Object.assign(traitsObj, _this.traits[trait]);
        });
        var modelAttributes = this.namedModels[name] || {};
        // merge default, modelAttributes, traits and opts to get the rough fixture
        var fixture = Object.assign({}, this.default, modelAttributes, traitsObj, opts);

        if (this.notPolymorphic !== undefined) {
          fixture._notPolymorphic = true;
        }

        // set the id, unless it was already set in opts
        if (!fixture.id) {
          // Setting a flag to indicate that this is a generated an id,
          // so it can be rolled back if the fixture throws an error.
          fixture._generatedId = true;
          fixture.id = this.nextId();
        }

        try {
          // deal with attributes that are functions or objects
          for (var attribute in fixture) {
            var attributeType = Ember.typeOf(fixture[attribute]);
            if (attributeType === 'function') {
              this.addFunctionAttribute(fixture, attribute);
            } else if (attributeType === 'object') {
              this.addObjectAttribute(fixture, attribute);
            }
          }
        } catch (e) {
          if (fixture._generatedId) {
            this.backId();
          }
          throw e;
        }

        if (this.isModelAFragment()) {
          delete fixture.id;
        }
        delete fixture._generatedId;
        return fixture;
      }
    }, {
      key: 'addFunctionAttribute',
      value: function addFunctionAttribute(fixture, attribute) {
        fixture[attribute] = fixture[attribute].call(this, fixture);
      }
    }, {
      key: 'addObjectAttribute',
      value: function addObjectAttribute(fixture, attribute) {
        // If it's an object and it's a model association attribute, build the json
        // for the association and replace the attribute with that json
        var relationship = this.getRelationship(attribute);

        if (this.isModelFragmentAttribute(attribute)) {
          var payload = fixture[attribute];
          if ((0, _helperFunctions.isEmptyObject)(payload)) {
            // make a payload, but make sure it's the correct fragment type
            var actualType = this.fragmentType(attribute);
            payload = _factoryGuy.default.buildRaw(actualType, {});
          }
          // use the payload you have been given
          fixture[attribute] = payload;
        }
        if (relationship) {
          var _payload = fixture[attribute];
          if (!_payload.isProxy) {
            fixture[attribute] = _factoryGuy.default.buildRaw(relationship.type, _payload);
          }
        }
      }
    }, {
      key: 'buildList',
      value: function buildList(name, number, traits, opts) {
        var arr = [];
        for (var i = 0; i < number; i++) {
          arr.push(this.build(name, opts, traits));
        }
        return arr;
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.modelId = 1;
        for (var name in this.sequences) {
          this.sequences[name].reset();
        }
      }
    }, {
      key: 'hasAfterMake',
      value: function hasAfterMake() {
        return !!this.afterMake;
      }
    }, {
      key: 'applyAfterMake',
      value: function applyAfterMake(model, opts) {
        if (this.afterMake) {
          // passed in options override transient setting
          var options = Object.assign({}, this.transient, opts);
          this.afterMake(model, options);
        }
      }
    }, {
      key: 'mergeSection',
      value: function mergeSection(config, otherConfig, section) {
        var attr = void 0;
        if (otherConfig[section]) {
          if (!config[section]) {
            config[section] = {};
          }
          for (attr in otherConfig[section]) {
            if (!config[section][attr]) {
              config[section][attr] = otherConfig[section][attr];
            }
          }
        }
      }
    }, {
      key: 'merge',
      value: function merge(config, otherDefinition) {
        var otherConfig = (0, _helperFunctions.mergeDeep)({}, otherDefinition.originalConfig);
        delete otherConfig.extends;
        this.mergeSection(config, otherConfig, 'sequences');
        // not sure why I have to use main definition for default,
        // but it works, so umm .. errr .. yeah
        this.mergeSection(config, otherDefinition, 'default');
        this.mergeSection(config, otherConfig, 'traits');
      }
    }, {
      key: 'mergeConfig',
      value: function mergeConfig(config) {
        var extending = config.extends;
        var definition = _factoryGuy.default.findModelDefinition(extending);
        Ember.assert('You are trying to extend [' + this.modelName + '] with [ ' + extending + ' ].\n      But FactoryGuy can\'t find that definition [ ' + extending + ' ]\n      you are trying to extend. Make sure it was created/imported before\n      you define [ ' + this.modelName + ' ]', definition);
        this.merge(config, definition);
      }
    }, {
      key: 'parseDefault',
      value: function parseDefault(config) {
        this.default = config.default || {};
        delete config.default;
      }
    }, {
      key: 'parseTraits',
      value: function parseTraits(config) {
        this.traits = config.traits || {};
        delete config.traits;
      }
    }, {
      key: 'parseTransient',
      value: function parseTransient(config) {
        this.transient = config.transient || {};
        delete config.transient;
      }
    }, {
      key: 'parseCallBacks',
      value: function parseCallBacks(config) {
        this.afterMake = config.afterMake;
        delete config.afterMake;
      }
    }, {
      key: 'parsePolymorphicSetting',
      value: function parsePolymorphicSetting(config) {
        if (config.polymorphic !== undefined && config.polymorphic === false) {
          this.notPolymorphic = true;
          delete config.polymorphic;
        }
      }
    }, {
      key: 'parseSequences',
      value: function parseSequences(config) {
        this.sequences = config.sequences || {};
        delete config.sequences;
        for (var sequenceName in this.sequences) {
          var sequenceFn = this.sequences[sequenceName];

          if (Ember.typeOf(sequenceFn) !== 'function') {
            throw new Error('Problem with [' + sequenceName + '] sequence definition.\n          Sequences must be functions');
          }
          this.sequences[sequenceName] = new _sequence.default(sequenceFn);
        }
      }
    }, {
      key: 'parseConfig',
      value: function parseConfig(config) {
        if (config.extends) {
          this.mergeConfig(config);
        }
        this.parsePolymorphicSetting(config);
        this.parseSequences(config);
        this.parseTraits(config);
        this.parseDefault(config);
        this.parseTransient(config);
        this.parseCallBacks(config);
        this.namedModels = config;
      }
    }]);

    return ModelDefinition;
  }();

  exports.default = ModelDefinition;
});