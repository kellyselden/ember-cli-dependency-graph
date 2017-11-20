define('travis/utils/expandable-record-array', ['exports', 'ember-decorators/object'], function (exports, _object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _desc, _value, _obj;

  var EmberPromise = Ember.RSVP.Promise;
  var ArrayProxy = Ember.ArrayProxy;
  exports.default = ArrayProxy.extend((_dec = (0, _object.computed)(), (_obj = {
    isLoaded: false,
    isLoading: false,

    promise: function promise() {
      var _this = this;

      return new EmberPromise(function (resolve) {
        var observer = function observer() {
          if (_this.get('isLoaded')) {
            resolve(_this);
            _this.removeObserver('isLoaded', observer);
            return true;
          }
        };
        if (!observer()) {
          return _this.addObserver('isLoaded', observer);
        }
      });
    },
    load: function load(array) {
      var _this2 = this;

      this.set('isLoading', true);
      return array.then(function () {
        array.forEach(function (record) {
          if (!_this2.includes(record)) {
            return _this2.pushObject(record);
          }
        });
        _this2.set('isLoading', false);
        return _this2.set('isLoaded', true);
      });
    },
    observe: function observe(collection) {
      return collection.addArrayObserver(this, {
        willChange: 'observedArrayWillChange',
        didChange: 'observedArraydidChange'
      });
    },
    observedArrayWillChange: function observedArrayWillChange(array, index, removedCount) {
      var i = void 0,
          len = void 0,
          object = void 0,
          removedObjects = void 0,
          results = void 0;
      removedObjects = array.slice(index, index + removedCount);
      results = [];
      for (i = 0, len = removedObjects.length; i < len; i++) {
        object = removedObjects[i];
        results.push(this.removeObject(object));
      }
      return results;
    },
    observedArraydidChange: function observedArraydidChange(array, index, removedCount, addedCount) {
      var addedObjects = void 0,
          i = void 0,
          len = void 0,
          object = void 0,
          results = void 0;
      addedObjects = array.slice(index, index + addedCount);
      results = [];
      for (i = 0, len = addedObjects.length; i < len; i++) {
        object = addedObjects[i];
        // TODO: I'm not sure why deleted objects get here, but I'll just filter them
        // for now
        if (!object.get('isDeleted')) {
          if (!this.includes(object)) {
            results.push(this.pushObject(object));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    pushObject: function pushObject(record) {
      var content = this.get('content');
      if (content) {
        if (!content.includes(record)) {
          return content.pushObject(record);
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'promise', [_dec], Object.getOwnPropertyDescriptor(_obj, 'promise'), _obj)), _obj)));
});