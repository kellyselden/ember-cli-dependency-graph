define('ember-macro-helpers/create-class-computed', ['exports', 'ember-weakmap', 'ember-macro-helpers/get-value', 'ember-macro-helpers/collapse-keys', 'ember-macro-helpers/flatten-keys', 'ember-macro-helpers/-constants'], function (exports, _emberWeakmap, _getValue, _collapseKeys, _flattenKeys, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (observerBools, macroGenerator) {
    return function () {
      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      var _collapseKeysWithMap = (0, _collapseKeys.collapseKeysWithMap)(keys),
          collapsedKeys = _collapseKeysWithMap.collapsedKeys,
          keyMap = _collapseKeysWithMap.keyMap;

      function getOriginalArrayDecorator(key, i) {
        if (typeof key === 'string') {
          var originalKey = keys[keyMap[i]];
          if (originalKey.indexOf(_constants.ARRAY_EACH) !== -1 || originalKey.indexOf(_constants.ARRAY_LENGTH) !== -1) {
            return originalKey;
          }
        }
        return key;
      }

      var mappedKeys = [];

      function rewriteComputed(obj, key) {
        var _this = this;

        var mappedWithResolvedOberverKeys = mappedKeys.map(function (macro, i) {
          var shouldObserve = observerBools[i];
          if (shouldObserve) {
            macro = (0, _getValue.default)({ context: _this, macro: macro, key: key });
          }
          return macro;
        });

        var cp = macroGenerator.apply(this, mappedWithResolvedOberverKeys);
        defineProperty(this, 'computed', cp);
      }

      var classProperties = {};

      collapsedKeys.forEach(function (key, i) {
        var shouldObserve = observerBools[i];
        if (!shouldObserve) {
          key = getOriginalArrayDecorator(key, i);
        }

        var mappedKey = resolveMappedLocation(key, i);

        mappedKeys.push(mappedKey);
        if (shouldObserve) {
          classProperties['key' + i + 'DidChange'] = observer(mappedKey, rewriteComputed);
        }
      });

      var ObserverClass = BaseClass.extend(classProperties, {
        // can't use rewriteComputed directly, maybe a bug
        // https://github.com/emberjs/ember.js/issues/15246
        onInit: on('init', function () {
          rewriteComputed.call(this);
        })
      });

      var cp = computed.apply(undefined, _toConsumableArray((0, _flattenKeys.default)(keys)).concat([function (key) {
        var _this2 = this;

        var propertyInstance = findOrCreatePropertyInstance(this, ObserverClass, key, cp);

        var properties = collapsedKeys.reduce(function (properties, macro, i) {
          if (typeof macro !== 'string') {
            properties[i.toString()] = (0, _getValue.default)({ context: _this2, macro: macro, key: key });
          }
          return properties;
        }, {});

        setProperties(propertyInstance.nonStrings, properties);

        return get(propertyInstance, 'computed');
      }])).readOnly();

      return cp;
    };
  };

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

  var EmberObject = Ember.Object;
  var computed = Ember.computed;
  var observer = Ember.observer;
  var get = Ember.get;
  var setProperties = Ember.setProperties;
  var Component = Ember.Component;
  var on = Ember.on;
  var defineProperty = Ember.defineProperty;


  var PROPERTIES = new _emberWeakmap.default();

  function findOrCreatePropertyInstance(context, propertyClass, key, cp) {
    var propertiesForContext = PROPERTIES.get(context);
    if (!propertiesForContext) {
      propertiesForContext = new _emberWeakmap.default();
      PROPERTIES.set(context, propertiesForContext);
    }

    var property = propertiesForContext.get(cp);
    if (property) {
      return property;
    }

    // let owner = getOwner(context);
    property = propertyClass.create( /* owner.ownerInjection(), */{
      key: key,
      context: context,
      nonStrings: EmberObject.create()
    });

    propertiesForContext.set(cp, property);

    if (context instanceof Component) {
      context.one('willDestroyElement', function () {
        property.destroy();
      });
    }

    return property;
  }

  var BaseClass = EmberObject.extend({
    computedDidChange: observer('computed', function () {
      var context = this.context,
          key = this.key;


      if (context.isDestroying) {
        // controllers can get into this state
        this.destroy();

        return;
      }

      context.notifyPropertyChange(key);
    })
  });

  function resolveMappedLocation(key, i) {
    if (typeof key === 'string') {
      return 'context.' + key;
    } else {
      return 'nonStrings.' + i;
    }
  }
});