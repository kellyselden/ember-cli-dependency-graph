define("ember-data/-private/system/model/internal-model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/model/states", "ember-data/-private/system/relationships/state/create", "ember-data/-private/system/snapshot", "ember-data/-private/system/empty-object", "ember-data/-private/features", "ember-data/-private/utils", "ember-data/-private/system/references"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemModelStates, _emberDataPrivateSystemRelationshipsStateCreate, _emberDataPrivateSystemSnapshot, _emberDataPrivateSystemEmptyObject, _emberDataPrivateFeatures, _emberDataPrivateUtils, _emberDataPrivateSystemReferences) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var get = _ember["default"].get;
  var set = _ember["default"].set;
  var copy = _ember["default"].copy;
  var EmberError = _ember["default"].Error;
  var inspect = _ember["default"].inspect;
  var isEmpty = _ember["default"].isEmpty;
  var isEqual = _ember["default"].isEqual;
  var emberRun = _ember["default"].run;
  var setOwner = _ember["default"].setOwner;
  var RSVP = _ember["default"].RSVP;
  var Promise = _ember["default"].RSVP.Promise;

  var assign = _ember["default"].assign || _ember["default"].merge;

  /*
    The TransitionChainMap caches the `state.enters`, `state.setups`, and final state reached
    when transitioning from one state to another, so that future transitions can replay the
    transition without needing to walk the state tree, collect these hook calls and determine
     the state to transition into.
  
     A future optimization would be to build a single chained method out of the collected enters
     and setups. It may also be faster to do a two level cache (from: { to }) instead of caching based
     on a key that adds the two together.
   */
  var TransitionChainMap = new _emberDataPrivateSystemEmptyObject["default"]();

  var _extractPivotNameCache = new _emberDataPrivateSystemEmptyObject["default"]();
  var _splitOnDotCache = new _emberDataPrivateSystemEmptyObject["default"]();

  function splitOnDot(name) {
    return _splitOnDotCache[name] || (_splitOnDotCache[name] = name.split('.'));
  }

  function extractPivotName(name) {
    return _extractPivotNameCache[name] || (_extractPivotNameCache[name] = splitOnDot(name)[0]);
  }

  // this (and all heimdall instrumentation) will be stripped by a babel transform
  //  https://github.com/heimdalljs/babel5-plugin-strip-heimdall

  /*
    `InternalModel` is the Model class that we use internally inside Ember Data to represent models.
    Internal ED methods should only deal with `InternalModel` objects. It is a fast, plain Javascript class.
  
    We expose `DS.Model` to application code, by materializing a `DS.Model` from `InternalModel` lazily, as
    a performance optimization.
  
    `InternalModel` should never be exposed to application code. At the boundaries of the system, in places
    like `find`, `push`, etc. we convert between Models and InternalModels.
  
    We need to make sure that the properties from `InternalModel` are correctly exposed/proxied on `Model`
    if they are needed.
  
    @private
    @class InternalModel
  */

  var InternalModel = (function () {
    function InternalModel(modelClass, id, store, data) {
      this.modelClass = modelClass;
      this.id = id;
      this.store = store;
      this._data = data || new _emberDataPrivateSystemEmptyObject["default"]();
      this.modelName = modelClass.modelName;
      this.dataHasInitialized = false;
      this._loadingPromise = null;
      this._recordArrays = undefined;
      this._record = null;
      this.currentState = _emberDataPrivateSystemModelStates["default"].empty;
      this.isReloading = false;
      this._isDestroyed = false;
      this.isError = false;
      this.error = null;

      // caches for lazy getters
      this.__deferredTriggers = null;
      this._references = null;
      this._recordReference = null;
      this.__inFlightAttributes = null;
      this.__relationships = null;
      this.__attributes = null;
      this.__implicitRelationships = null;
    }

    _createClass(InternalModel, [{
      key: "isEmpty",
      value: function isEmpty() {
        return this.currentState.isEmpty;
      }
    }, {
      key: "isLoading",
      value: function isLoading() {
        return this.currentState.isLoading;
      }
    }, {
      key: "isLoaded",
      value: function isLoaded() {
        return this.currentState.isLoaded;
      }
    }, {
      key: "hasDirtyAttributes",
      value: function hasDirtyAttributes() {
        return this.currentState.hasDirtyAttributes;
      }
    }, {
      key: "isSaving",
      value: function isSaving() {
        return this.currentState.isSaving;
      }
    }, {
      key: "isDeleted",
      value: function isDeleted() {
        return this.currentState.isDeleted;
      }
    }, {
      key: "isNew",
      value: function isNew() {
        return this.currentState.isNew;
      }
    }, {
      key: "isValid",
      value: function isValid() {
        return this.currentState.isValid;
      }
    }, {
      key: "dirtyType",
      value: function dirtyType() {
        return this.currentState.dirtyType;
      }
    }, {
      key: "getRecord",
      value: function getRecord() {
        if (!this._record) {

          // lookupFactory should really return an object that creates
          // instances with the injections applied
          var createOptions = {
            store: this.store,
            _internalModel: this,
            id: this.id,
            currentState: this.currentState,
            isError: this.isError,
            adapterError: this.error
          };

          if (setOwner) {
            // ensure that `getOwner(this)` works inside a model instance
            setOwner(createOptions, (0, _emberDataPrivateUtils.getOwner)(this.store));
          } else {
            createOptions.container = this.store.container;
          }

          this._record = this.store.modelFactoryFor(this.modelName).create(createOptions);

          this._triggerDeferredTriggers();
        }

        return this._record;
      }
    }, {
      key: "recordObjectWillDestroy",
      value: function recordObjectWillDestroy() {
        this._record = null;
      }
    }, {
      key: "deleteRecord",
      value: function deleteRecord() {
        this.send('deleteRecord');
      }
    }, {
      key: "save",
      value: function save(options) {
        var promiseLabel = "DS: Model#save " + this;
        var resolver = RSVP.defer(promiseLabel);

        this.store.scheduleSave(this, resolver, options);
        return resolver.promise;
      }
    }, {
      key: "startedReloading",
      value: function startedReloading() {
        this.isReloading = true;
        if (this.hasRecord) {
          set(this.record, 'isReloading', true);
        }
      }
    }, {
      key: "finishedReloading",
      value: function finishedReloading() {
        this.isReloading = false;
        if (this.hasRecord) {
          set(this.record, 'isReloading', false);
        }
      }
    }, {
      key: "reload",
      value: function reload() {
        this.startedReloading();
        var internalModel = this;
        var promiseLabel = "DS: Model#reload of " + this;

        return new Promise(function (resolve) {
          internalModel.send('reloadRecord', resolve);
        }, promiseLabel).then(function () {
          internalModel.didCleanError();
          return internalModel;
        }, function (error) {
          internalModel.didError(error);
          throw error;
        }, "DS: Model#reload complete, update flags")["finally"](function () {
          internalModel.finishedReloading();
          internalModel.updateRecordArrays();
        });
      }
    }, {
      key: "unloadRecord",
      value: function unloadRecord() {
        this.send('unloadRecord');
      }
    }, {
      key: "eachRelationship",
      value: function eachRelationship(callback, binding) {
        return this.modelClass.eachRelationship(callback, binding);
      }
    }, {
      key: "eachAttribute",
      value: function eachAttribute(callback, binding) {
        return this.modelClass.eachAttribute(callback, binding);
      }
    }, {
      key: "inverseFor",
      value: function inverseFor(key) {
        return this.modelClass.inverseFor(key);
      }
    }, {
      key: "setupData",
      value: function setupData(data) {
        var changedKeys = this._changedKeys(data.attributes);
        assign(this._data, data.attributes);
        this.pushedData();
        if (this.hasRecord) {
          this.record._notifyProperties(changedKeys);
        }
        this.didInitializeData();
      }
    }, {
      key: "becameReady",
      value: function becameReady() {
        emberRun.schedule('actions', this.store.recordArrayManager, this.store.recordArrayManager.recordWasLoaded, this);
      }
    }, {
      key: "didInitializeData",
      value: function didInitializeData() {
        if (!this.dataHasInitialized) {
          this.becameReady();
          this.dataHasInitialized = true;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._isDestroyed = true;
        if (this.hasRecord) {
          return this.record.destroy();
        }
      }

      /*
        @method createSnapshot
        @private
      */
    }, {
      key: "createSnapshot",
      value: function createSnapshot(options) {
        return new _emberDataPrivateSystemSnapshot["default"](this, options);
      }

      /*
        @method loadingData
        @private
        @param {Promise} promise
      */
    }, {
      key: "loadingData",
      value: function loadingData(promise) {
        this.send('loadingData', promise);
      }

      /*
        @method loadedData
        @private
      */
    }, {
      key: "loadedData",
      value: function loadedData() {
        this.send('loadedData');
        this.didInitializeData();
      }

      /*
        @method notFound
        @private
      */
    }, {
      key: "notFound",
      value: function notFound() {
        this.send('notFound');
      }

      /*
        @method pushedData
        @private
      */
    }, {
      key: "pushedData",
      value: function pushedData() {
        this.send('pushedData');
      }
    }, {
      key: "flushChangedAttributes",
      value: function flushChangedAttributes() {
        this._inFlightAttributes = this._attributes;
        this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
      }
    }, {
      key: "hasChangedAttributes",
      value: function hasChangedAttributes() {
        return Object.keys(this._attributes).length > 0;
      }

      /*
        Checks if the attributes which are considered as changed are still
        different to the state which is acknowledged by the server.
         This method is needed when data for the internal model is pushed and the
        pushed data might acknowledge dirty attributes as confirmed.
         @method updateChangedAttributes
        @private
       */
    }, {
      key: "updateChangedAttributes",
      value: function updateChangedAttributes() {
        var changedAttributes = this.changedAttributes();
        var changedAttributeNames = Object.keys(changedAttributes);
        var attrs = this._attributes;

        for (var i = 0, _length = changedAttributeNames.length; i < _length; i++) {
          var attribute = changedAttributeNames[i];
          var data = changedAttributes[attribute];
          var oldData = data[0];
          var newData = data[1];

          if (oldData === newData) {
            delete attrs[attribute];
          }
        }
      }

      /*
        Returns an object, whose keys are changed properties, and value is an
        [oldProp, newProp] array.
         @method changedAttributes
        @private
      */
    }, {
      key: "changedAttributes",
      value: function changedAttributes() {
        var oldData = this._data;
        var currentData = this._attributes;
        var inFlightData = this._inFlightAttributes;
        var newData = assign(copy(inFlightData), currentData);
        var diffData = new _emberDataPrivateSystemEmptyObject["default"]();
        var newDataKeys = Object.keys(newData);

        for (var i = 0, _length2 = newDataKeys.length; i < _length2; i++) {
          var key = newDataKeys[i];
          diffData[key] = [oldData[key], newData[key]];
        }

        return diffData;
      }

      /*
        @method adapterWillCommit
        @private
      */
    }, {
      key: "adapterWillCommit",
      value: function adapterWillCommit() {
        this.send('willCommit');
      }

      /*
        @method adapterDidDirty
        @private
      */
    }, {
      key: "adapterDidDirty",
      value: function adapterDidDirty() {
        this.send('becomeDirty');
        this.updateRecordArraysLater();
      }

      /*
        @method send
        @private
        @param {String} name
        @param {Object} context
      */
    }, {
      key: "send",
      value: function send(name, context) {
        var currentState = this.currentState;

        if (!currentState[name]) {
          this._unhandledEvent(currentState, name, context);
        }

        return currentState[name](this, context);
      }
    }, {
      key: "notifyHasManyAdded",
      value: function notifyHasManyAdded(key, record, idx) {
        if (this.hasRecord) {
          this.record.notifyHasManyAdded(key, record, idx);
        }
      }
    }, {
      key: "notifyHasManyRemoved",
      value: function notifyHasManyRemoved(key, record, idx) {
        if (this.hasRecord) {
          this.record.notifyHasManyRemoved(key, record, idx);
        }
      }
    }, {
      key: "notifyBelongsToChanged",
      value: function notifyBelongsToChanged(key, record) {
        if (this.hasRecord) {
          this.record.notifyBelongsToChanged(key, record);
        }
      }
    }, {
      key: "notifyPropertyChange",
      value: function notifyPropertyChange(key) {
        if (this.hasRecord) {
          this.record.notifyPropertyChange(key);
        }
      }
    }, {
      key: "rollbackAttributes",
      value: function rollbackAttributes() {
        var dirtyKeys = Object.keys(this._attributes);

        this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();

        if (get(this, 'isError')) {
          this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
          this.didCleanError();
        }

        //Eventually rollback will always work for relationships
        //For now we support it only out of deleted state, because we
        //have an explicit way of knowing when the server acked the relationship change
        if (this.isDeleted()) {
          //TODO: Should probably move this to the state machine somehow
          this.becameReady();
        }

        if (this.isNew()) {
          this.clearRelationships();
        }

        if (this.isValid()) {
          this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
        }

        this.send('rolledBack');

        this.record._notifyProperties(dirtyKeys);
      }

      /*
        @method transitionTo
        @private
        @param {String} name
      */
    }, {
      key: "transitionTo",
      value: function transitionTo(name) {
        // POSSIBLE TODO: Remove this code and replace with
        // always having direct reference to state objects

        var pivotName = extractPivotName(name);
        var state = this.currentState;
        var transitionMapId = state.stateName + "->" + name;

        do {
          if (state.exit) {
            state.exit(this);
          }
          state = state.parentState;
        } while (!state[pivotName]);

        var setups = undefined;
        var enters = undefined;
        var i = undefined;
        var l = undefined;
        var map = TransitionChainMap[transitionMapId];

        if (map) {
          setups = map.setups;
          enters = map.enters;
          state = map.state;
        } else {
          setups = [];
          enters = [];

          var path = splitOnDot(name);

          for (i = 0, l = path.length; i < l; i++) {
            state = state[path[i]];

            if (state.enter) {
              enters.push(state);
            }
            if (state.setup) {
              setups.push(state);
            }
          }

          TransitionChainMap[transitionMapId] = { setups: setups, enters: enters, state: state };
        }

        for (i = 0, l = enters.length; i < l; i++) {
          enters[i].enter(this);
        }

        this.currentState = state;
        if (this.hasRecord) {
          set(this.record, 'currentState', state);
        }

        for (i = 0, l = setups.length; i < l; i++) {
          setups[i].setup(this);
        }

        this.updateRecordArraysLater();
      }
    }, {
      key: "_unhandledEvent",
      value: function _unhandledEvent(state, name, context) {
        var errorMessage = "Attempted to handle event `" + name + "` ";
        errorMessage += "on " + String(this) + " while in state ";
        errorMessage += state.stateName + ". ";

        if (context !== undefined) {
          errorMessage += "Called with " + inspect(context) + ".";
        }

        throw new EmberError(errorMessage);
      }
    }, {
      key: "triggerLater",
      value: function triggerLater() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (this._deferredTriggers.push(args) !== 1) {
          return;
        }
        emberRun.schedule('actions', this, this._triggerDeferredTriggers);
      }
    }, {
      key: "_triggerDeferredTriggers",
      value: function _triggerDeferredTriggers() {
        //TODO: Before 1.0 we want to remove all the events that happen on the pre materialized record,
        //but for now, we queue up all the events triggered before the record was materialized, and flush
        //them once we have the record
        if (!this.hasRecord) {
          return;
        }
        for (var i = 0, l = this._deferredTriggers.length; i < l; i++) {
          this.record.trigger.apply(this.record, this._deferredTriggers[i]);
        }

        this._deferredTriggers.length = 0;
      }

      /*
        @method clearRelationships
        @private
      */
    }, {
      key: "clearRelationships",
      value: function clearRelationships() {
        var _this = this;

        this.eachRelationship(function (name, relationship) {
          if (_this._relationships.has(name)) {
            var rel = _this._relationships.get(name);
            rel.clear();
            rel.destroy();
          }
        });
        Object.keys(this._implicitRelationships).forEach(function (key) {
          _this._implicitRelationships[key].clear();
          _this._implicitRelationships[key].destroy();
        });
      }

      /*
        When a find request is triggered on the store, the user can optionally pass in
        attributes and relationships to be preloaded. These are meant to behave as if they
        came back from the server, except the user obtained them out of band and is informing
        the store of their existence. The most common use case is for supporting client side
        nested URLs, such as `/posts/1/comments/2` so the user can do
        `store.findRecord('comment', 2, { preload: { post: 1 } })` without having to fetch the post.
         Preloaded data can be attributes and relationships passed in either as IDs or as actual
        models.
         @method preloadData
        @private
        @param {Object} preload
      */
    }, {
      key: "preloadData",
      value: function preloadData(preload) {
        var _this2 = this;

        //TODO(Igor) consider the polymorphic case
        Object.keys(preload).forEach(function (key) {
          var preloadValue = get(preload, key);
          var relationshipMeta = _this2.modelClass.metaForProperty(key);
          if (relationshipMeta.isRelationship) {
            _this2._preloadRelationship(key, preloadValue);
          } else {
            _this2._data[key] = preloadValue;
          }
        });
      }
    }, {
      key: "_preloadRelationship",
      value: function _preloadRelationship(key, preloadValue) {
        var relationshipMeta = this.modelClass.metaForProperty(key);
        var modelClass = relationshipMeta.type;
        if (relationshipMeta.kind === 'hasMany') {
          this._preloadHasMany(key, preloadValue, modelClass);
        } else {
          this._preloadBelongsTo(key, preloadValue, modelClass);
        }
      }
    }, {
      key: "_preloadHasMany",
      value: function _preloadHasMany(key, preloadValue, modelClass) {
        (0, _emberDataPrivateDebug.assert)("You need to pass in an array to set a hasMany property on a record", Array.isArray(preloadValue));
        var recordsToSet = new Array(preloadValue.length);

        for (var i = 0; i < preloadValue.length; i++) {
          var recordToPush = preloadValue[i];
          recordsToSet[i] = this._convertStringOrNumberIntoInternalModel(recordToPush, modelClass);
        }

        //We use the pathway of setting the hasMany as if it came from the adapter
        //because the user told us that they know this relationships exists already
        this._relationships.get(key).updateRecordsFromAdapter(recordsToSet);
      }
    }, {
      key: "_preloadBelongsTo",
      value: function _preloadBelongsTo(key, preloadValue, modelClass) {
        var recordToSet = this._convertStringOrNumberIntoInternalModel(preloadValue, modelClass);

        //We use the pathway of setting the hasMany as if it came from the adapter
        //because the user told us that they know this relationships exists already
        this._relationships.get(key).setRecord(recordToSet);
      }
    }, {
      key: "_convertStringOrNumberIntoInternalModel",
      value: function _convertStringOrNumberIntoInternalModel(value, modelClass) {
        if (typeof value === 'string' || typeof value === 'number') {
          return this.store._internalModelForId(modelClass, value);
        }
        if (value._internalModel) {
          return value._internalModel;
        }
        return value;
      }

      /*
        @method updateRecordArrays
        @private
      */
    }, {
      key: "updateRecordArrays",
      value: function updateRecordArrays() {
        this._updatingRecordArraysLater = false;
        this.store.dataWasUpdated(this.modelClass, this);
      }
    }, {
      key: "setId",
      value: function setId(id) {
        (0, _emberDataPrivateDebug.assert)('A record\'s id cannot be changed once it is in the loaded state', this.id === null || this.id === id || this.isNew());
        this.id = id;
        if (this.record.get('id') !== id) {
          this.record.set('id', id);
        }
      }
    }, {
      key: "didError",
      value: function didError(error) {
        this.error = error;
        this.isError = true;

        if (this.hasRecord) {
          this.record.setProperties({
            isError: true,
            adapterError: error
          });
        }
      }
    }, {
      key: "didCleanError",
      value: function didCleanError() {
        this.error = null;
        this.isError = false;

        if (this.hasRecord) {
          this.record.setProperties({
            isError: false,
            adapterError: null
          });
        }
      }

      /*
        If the adapter did not return a hash in response to a commit,
        merge the changed attributes and relationships into the existing
        saved data.
         @method adapterDidCommit
      */
    }, {
      key: "adapterDidCommit",
      value: function adapterDidCommit(data) {
        if (data) {
          data = data.attributes;
        }

        this.didCleanError();
        var changedKeys = this._changedKeys(data);

        assign(this._data, this._inFlightAttributes);
        if (data) {
          assign(this._data, data);
        }

        this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();

        this.send('didCommit');
        this.updateRecordArraysLater();

        if (!data) {
          return;
        }

        this.record._notifyProperties(changedKeys);
      }

      /*
        @method updateRecordArraysLater
        @private
      */
    }, {
      key: "updateRecordArraysLater",
      value: function updateRecordArraysLater() {
        // quick hack (something like this could be pushed into run.once
        if (this._updatingRecordArraysLater) {
          return;
        }
        this._updatingRecordArraysLater = true;
        emberRun.schedule('actions', this, this.updateRecordArrays);
      }
    }, {
      key: "addErrorMessageToAttribute",
      value: function addErrorMessageToAttribute(attribute, message) {
        get(this.getRecord(), 'errors')._add(attribute, message);
      }
    }, {
      key: "removeErrorMessageFromAttribute",
      value: function removeErrorMessageFromAttribute(attribute) {
        get(this.getRecord(), 'errors')._remove(attribute);
      }
    }, {
      key: "clearErrorMessages",
      value: function clearErrorMessages() {
        get(this.getRecord(), 'errors')._clear();
      }
    }, {
      key: "hasErrors",
      value: function hasErrors() {
        var errors = get(this.getRecord(), 'errors');

        return !isEmpty(errors);
      }

      // FOR USE DURING COMMIT PROCESS

      /*
        @method adapterDidInvalidate
        @private
      */
    }, {
      key: "adapterDidInvalidate",
      value: function adapterDidInvalidate(errors) {
        var attribute = undefined;

        for (attribute in errors) {
          if (errors.hasOwnProperty(attribute)) {
            this.addErrorMessageToAttribute(attribute, errors[attribute]);
          }
        }

        this.send('becameInvalid');

        this._saveWasRejected();
      }

      /*
        @method adapterDidError
        @private
      */
    }, {
      key: "adapterDidError",
      value: function adapterDidError(error) {
        this.send('becameError');
        this.didError(error);
        this._saveWasRejected();
      }
    }, {
      key: "_saveWasRejected",
      value: function _saveWasRejected() {
        var keys = Object.keys(this._inFlightAttributes);
        var attrs = this._attributes;
        for (var i = 0; i < keys.length; i++) {
          if (attrs[keys[i]] === undefined) {
            attrs[keys[i]] = this._inFlightAttributes[keys[i]];
          }
        }
        this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
      }

      /*
        Ember Data has 3 buckets for storing the value of an attribute on an internalModel.
         `_data` holds all of the attributes that have been acknowledged by
        a backend via the adapter. When rollbackAttributes is called on a model all
        attributes will revert to the record's state in `_data`.
         `_attributes` holds any change the user has made to an attribute
        that has not been acknowledged by the adapter. Any values in
        `_attributes` are have priority over values in `_data`.
         `_inFlightAttributes`. When a record is being synced with the
        backend the values in `_attributes` are copied to
        `_inFlightAttributes`. This way if the backend acknowledges the
        save but does not return the new state Ember Data can copy the
        values from `_inFlightAttributes` to `_data`. Without having to
        worry about changes made to `_attributes` while the save was
        happenign.
          Changed keys builds a list of all of the values that may have been
        changed by the backend after a successful save.
         It does this by iterating over each key, value pair in the payload
        returned from the server after a save. If the `key` is found in
        `_attributes` then the user has a local changed to the attribute
        that has not been synced with the server and the key is not
        included in the list of changed keys.
      
        If the value, for a key differs from the value in what Ember Data
        believes to be the truth about the backend state (A merger of the
        `_data` and `_inFlightAttributes` objects where
        `_inFlightAttributes` has priority) then that means the backend
        has updated the value and the key is added to the list of changed
        keys.
         @method _changedKeys
        @private
      */
    }, {
      key: "_changedKeys",
      value: function _changedKeys(updates) {
        var changedKeys = [];

        if (updates) {
          var original = undefined,
              i = undefined,
              value = undefined,
              key = undefined;
          var keys = Object.keys(updates);
          var _length3 = keys.length;
          var attrs = this._attributes;

          original = assign(new _emberDataPrivateSystemEmptyObject["default"](), this._data);
          original = assign(original, this._inFlightAttributes);

          for (i = 0; i < _length3; i++) {
            key = keys[i];
            value = updates[key];

            // A value in _attributes means the user has a local change to
            // this attributes. We never override this value when merging
            // updates from the backend so we should not sent a change
            // notification if the server value differs from the original.
            if (attrs[key] !== undefined) {
              continue;
            }

            if (!isEqual(original[key], value)) {
              changedKeys.push(key);
            }
          }
        }

        return changedKeys;
      }
    }, {
      key: "toString",
      value: function toString() {
        return "<" + this.modelName + ":" + this.id + ">";
      }
    }, {
      key: "referenceFor",
      value: function referenceFor(kind, name) {
        var _this3 = this;

        var reference = this.references[name];

        if (!reference) {
          (function () {
            var relationship = _this3._relationships.get(name);

            (0, _emberDataPrivateDebug.runInDebug)(function () {
              var modelName = _this3.modelName;
              (0, _emberDataPrivateDebug.assert)("There is no " + kind + " relationship named '" + name + "' on a model of modelClass '" + modelName + "'", relationship);

              var actualRelationshipKind = relationship.relationshipMeta.kind;
              (0, _emberDataPrivateDebug.assert)("You tried to get the '" + name + "' relationship on a '" + modelName + "' via record." + kind + "('" + name + "'), but the relationship is of kind '" + actualRelationshipKind + "'. Use record." + actualRelationshipKind + "('" + name + "') instead.", actualRelationshipKind === kind);
            });

            if (kind === "belongsTo") {
              reference = new _emberDataPrivateSystemReferences.BelongsToReference(_this3.store, _this3, relationship);
            } else if (kind === "hasMany") {
              reference = new _emberDataPrivateSystemReferences.HasManyReference(_this3.store, _this3, relationship);
            }

            _this3.references[name] = reference;
          })();
        }

        return reference;
      }
    }, {
      key: "type",
      get: function get() {
        return this.modelClass;
      }
    }, {
      key: "recordReference",
      get: function get() {
        if (this._recordReference === null) {
          this._recordReference = new _emberDataPrivateSystemReferences.RecordReference(this.store, this);
        }
        return this._recordReference;
      }
    }, {
      key: "references",
      get: function get() {
        if (this._references === null) {
          this._references = new _emberDataPrivateSystemEmptyObject["default"]();
        }
        return this._references;
      }
    }, {
      key: "_deferredTriggers",
      get: function get() {
        if (this.__deferredTriggers === null) {
          this.__deferredTriggers = [];
        }
        return this.__deferredTriggers;
      }
    }, {
      key: "_attributes",
      get: function get() {
        if (this.__attributes === null) {
          this.__attributes = new _emberDataPrivateSystemEmptyObject["default"]();
        }
        return this.__attributes;
      },
      set: function set(v) {
        this.__attributes = v;
      }
    }, {
      key: "_relationships",
      get: function get() {
        if (this.__relationships === null) {
          this.__relationships = new _emberDataPrivateSystemRelationshipsStateCreate["default"](this);
        }

        return this.__relationships;
      }
    }, {
      key: "_inFlightAttributes",
      get: function get() {
        if (this.__inFlightAttributes === null) {
          this.__inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
        }
        return this.__inFlightAttributes;
      },
      set: function set(v) {
        this.__inFlightAttributes = v;
      }

      /*
       implicit relationships are relationship which have not been declared but the inverse side exists on
       another record somewhere
       For example if there was
        ```app/models/comment.js
       import DS from 'ember-data';
        export default DS.Model.extend({
       name: DS.attr()
       })
       ```
        but there is also
        ```app/models/post.js
       import DS from 'ember-data';
        export default DS.Model.extend({
       name: DS.attr(),
       comments: DS.hasMany('comment')
       })
       ```
        would have a implicit post relationship in order to be do things like remove ourselves from the post
       when we are deleted
      */
    }, {
      key: "_implicitRelationships",
      get: function get() {
        if (this.__implicitRelationships === null) {
          this.__implicitRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
        }
        return this.__implicitRelationships;
      }
    }, {
      key: "record",
      get: function get() {
        return this._record;
      }
    }, {
      key: "isDestroyed",
      get: function get() {
        return this._isDestroyed;
      }
    }, {
      key: "hasRecord",
      get: function get() {
        return !!this._record;
      }
    }]);

    return InternalModel;
  })();

  exports["default"] = InternalModel;

  if (false) {
    /*
       Returns the latest truth for an attribute - the canonical value, or the
       in-flight value.
        @method lastAcknowledgedValue
       @private
    */
    InternalModel.prototype.lastAcknowledgedValue = function lastAcknowledgedValue(key) {
      if (key in this._inFlightAttributes) {
        return this._inFlightAttributes[key];
      } else {
        return this._data[key];
      }
    };
  }
});