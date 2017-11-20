define('travis/utils/filtered-array-manager', ['exports', 'travis/utils/string-hash'], function (exports, _stringHash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var EmberPromise = Ember.RSVP.Promise;
  var resolve = Ember.RSVP.resolve;
  var EmberObject = Ember.Object;
  var alias = Ember.computed.alias;
  var ArrayProxy = Ember.ArrayProxy;


  // An array proxy wrapping records that fit a filtered array.
  var FilteredArray = ArrayProxy.extend({
    arrangedContent: alias('content'),

    tryRecord: function tryRecord(record) {
      if (!this.get('content').includes(record) && this.fits(record)) {
        this.get('content').pushObject(record);
      } else if (this.get('content').includes(record) && !this.fits(record)) {
        this.get('content').removeObject(record);
      }
    },
    fits: function fits(record) {
      return this.get('filterFunction')(record);
    }
  });

  // Manages filtered arrays for a given type. It keeps a reference to all of the
  // records of a given type (obtained using store.peekAll() function) and watches
  // for changes on all of the records to determine wheather a record should be
  // added to one of the filtered arrays.
  //
  // Filtered arrays are indexed by an id unique for a given set of parameters,
  // calculated using the calculateId function.
  //
  // In order to minimise the number of observers FilteredArrayManagerForType will
  // group arrays by dependencies. Let's consider the following code:
  //
  //     let manager = FilteredArrayManagerForType.create({ modelName: 'repo' });
  //
  //     manager.fetchArray({}, function() {}, ['id']) {
  //     manager.fetchArray({}, function() {}, ['id', 'slug']) {
  //
  // 2 arrays will be created for such a call for dependencies ['id'] and
  // ['id', 'slug'] respectively. That means that all of the records need to be
  // observed for dependencies 'id' and 'slug'. Instead of creating 2 observers
  // for the 'id' dependency we will create only one observer, which will process
  // both arrays.
  //
  // Whenever a record is added to a store for a given type,
  // FilteredArrayManagerForType will add observers for the record and it will see
  // if the record needs to be added to any of the filtered arrays. Whenever a
  // record is removed, the observers will be removed as well and it will be
  // removed from all of the filtered arrays.
  var FilteredArrayManagerForType = EmberObject.extend({
    init: function init() {
      this.arrays = {};
      var store = this.get('store'),
          modelName = this.get('modelName');
      this.allRecords = store.peekAll(modelName);
      this.allRecords.addArrayObserver(this, {
        willChange: 'allRecordsWillChange',
        didChange: 'allRecordsDidChange'
      });
      this.arraysByDependency = {};
      this.dependencies = [];
    },
    fetchArray: function fetchArray(queryParams, filterFunction, dependencies, forceReload) {
      var _this = this;

      var id = this.calculateId.apply(this, arguments);
      var array = this.arrays[id];

      if (!array) {
        array = this.createArray.apply(this, [id].concat(Array.prototype.slice.call(arguments)));
      } else if (forceReload) {
        // if forceReload is true and array already exist, just run the query
        // to get new results
        var promise = new EmberPromise(function (resolve, reject) {
          _this.fetchQuery(queryParams).then(function (queryResult) {
            array.set('queryResult', queryResult);
            resolve(array);
          }, reject);
        });

        array._lastPromise = promise;
      }

      return array;
    },
    createArray: function createArray(id, queryParams, filterFunction, dependencies) {
      var _this2 = this;

      // TODO: test what ahppens when records already exist in a store,I think it
      // won't work
      var array = this.arrays[id] = FilteredArray.create({ filterFunction: filterFunction, content: [] });

      // for each of the dependency add an array to a list of arrays by the
      // dependency. Also, create observers on all of the records if it's a new
      // dependency
      dependencies.forEach(function (dependency) {
        var arrays = _this2.arraysByDependency[dependency];

        if (!arrays) {
          arrays = _this2.arraysByDependency[dependency] = [];
        }

        arrays.push(array);

        if (!_this2.dependencies.includes(dependency)) {
          _this2.dependencies.push(dependency);

          _this2.allRecords.forEach(function (record) {
            _this2.addObserver(record, dependency);
          });
        }
      });

      // check existing records
      this.allRecords.forEach(function (record) {
        return array.tryRecord(record);
      });

      var promise = new EmberPromise(function (resolve, reject) {
        // TODO: think about error handling, at the moment it will just pass the
        // reject from store.query
        _this2.fetchQuery(queryParams).then(function (queryResult) {
          array.set('queryResult', queryResult);
          resolve(array);
        }, reject);
      });

      array._promise = promise;
      array._lastPromise = promise;

      return array;
    },
    fetchQuery: function fetchQuery(queryParams) {
      if (queryParams) {
        return this.get('store').query(this.get('modelName'), queryParams);
      } else {
        return resolve([]);
      }
    },
    addObserver: function addObserver(record, property) {
      record.addObserver(property, this, 'propertyDidChange');
    },
    removeObserver: function removeObserver(record, property) {
      if (record) {
        record.removeObserver(property, this, 'propertyDidChange');
      }
    },
    propertyDidChange: function propertyDidChange(record, key, value, rev) {
      var arrays = this.arraysByDependency[key];

      arrays.forEach(function (array) {
        array.tryRecord(record);
      });
    },
    calculateId: function calculateId(queryParams, filterFunction, dependencies) {
      var params = queryParams || {};
      var id = (0, _stringHash.default)([Object.entries(params).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return key + ':' + value;
      }).sort(), (dependencies || []).sort(),
      // not sure if this is a good idea, but I want to get the unique id for
      // each set of arguments to filter
      filterFunction.toString()].toString());

      return id;
    },
    allRecordsWillChange: function allRecordsWillChange(array, offset, removeCount, addCount) {
      this.removeRecords(array.slice(offset, offset + removeCount));
    },
    allRecordsDidChange: function allRecordsDidChange(array, offset, removeCount, addCount) {
      this.addRecords(array.slice(offset, offset + addCount));
    },
    addRecords: function addRecords(records) {
      var _this3 = this;

      records.forEach(function (record) {
        return _this3.addRecord(record);
      });
    },
    removeRecords: function removeRecords(records) {
      var _this4 = this;

      records.forEach(function (record) {
        return _this4.removeRecord(record);
      });
    },
    addRecord: function addRecord(record) {
      var _this5 = this;

      this.dependencies.forEach(function (dependency) {
        _this5.addObserver(record, dependency);
      });

      Object.values(this.arrays).forEach(function (array) {
        array.tryRecord(record);
      });
    },
    removeRecord: function removeRecord(record) {
      var _this6 = this;

      this.dependencies.forEach(function (dependency) {
        _this6.removeObserver(record, dependency);
      });
    }
  });

  var FilteredArrayManager = EmberObject.extend({
    init: function init() {
      this.filteredArrayManagersByType = {};
    },
    fetchArray: function fetchArray(modelName, queryParams, filterFunction, dependencies, forceReload) {
      var _filteredArrayManager;

      var _arguments = Array.prototype.slice.call(arguments),
          _ = _arguments[0],
          rest = _arguments.slice(1);

      return (_filteredArrayManager = this.filteredArrayManagerForType(modelName)).fetchArray.apply(_filteredArrayManager, _toConsumableArray(rest))._promise;
    },
    filteredArrayManagerForType: function filteredArrayManagerForType(modelName) {
      var manager = this.filteredArrayManagersByType[modelName];

      if (!manager) {
        manager = this.filteredArrayManagersByType[modelName] = FilteredArrayManagerForType.create({ store: this.get('store'), modelName: modelName });
      }

      return manager;
    }
  });

  exports.default = FilteredArrayManager;
});