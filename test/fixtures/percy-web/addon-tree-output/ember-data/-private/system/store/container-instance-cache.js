define('ember-data/-private/system/store/container-instance-cache', ['exports', 'ember', 'ember-data/-private/system/empty-object'], function (exports, _ember, _emberDataPrivateSystemEmptyObject) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var set = _ember['default'].set;

  /*
   * The `ContainerInstanceCache` serves as a lazy cache for looking up
   * instances of serializers and adapters. It has some additional logic for
   * finding the 'fallback' adapter or serializer.
   *
   * The 'fallback' adapter or serializer is an adapter or serializer that is looked up
   * when the preferred lookup fails. For example, say you try to look up `adapter:post`,
   * but there is no entry (app/adapters/post.js in EmberCLI) for `adapter:post` in the registry.
   *
   * When an adapter or serializer is unfound, getFallbacks will be invoked with the current namespace
   * ('adapter' or 'serializer') and the 'preferredKey' (usually a modelName).  The method should return
   * an array of keys to check against.
   *
   * The first entry in the fallbacks array that exists in the container will then be cached for
   * `adapter:post`. So, the next time you look up `adapter:post`, you'll get the `adapter:application`
   * instance (or whatever the fallback was if `adapter:application` doesn't exist).
   *
   * @private
   * @class ContainerInstanceCache
   *
  */

  var ContainerInstanceCache = (function () {
    function ContainerInstanceCache(owner, store) {
      this._owner = owner;
      this._store = store;
      this._namespaces = {
        adapter: new _emberDataPrivateSystemEmptyObject['default'](),
        serializer: new _emberDataPrivateSystemEmptyObject['default']()
      };
    }

    _createClass(ContainerInstanceCache, [{
      key: 'get',
      value: function get(namespace, preferredKey) {
        var cache = this._namespaces[namespace];

        if (cache[preferredKey]) {
          return cache[preferredKey];
        }

        var preferredLookupKey = namespace + ':' + preferredKey;

        var instance = this._instanceFor(preferredLookupKey) || this._findInstance(namespace, this._fallbacksFor(namespace, preferredKey));
        if (instance) {
          cache[preferredKey] = instance;
          set(instance, 'store', this._store);
        }

        return cache[preferredKey];
      }
    }, {
      key: '_fallbacksFor',
      value: function _fallbacksFor(namespace, preferredKey) {
        if (namespace === 'adapter') {
          return ['application', this._store.get('adapter'), '-json-api'];
        }

        // serializer
        return ['application', this.get('adapter', preferredKey).get('defaultSerializer'), '-default'];
      }
    }, {
      key: '_findInstance',
      value: function _findInstance(namespace, fallbacks) {
        var cache = this._namespaces[namespace];

        for (var i = 0, _length = fallbacks.length; i < _length; i++) {
          var fallback = fallbacks[i];

          if (cache[fallback]) {
            return cache[fallback];
          }

          var lookupKey = namespace + ':' + fallback;
          var instance = this._instanceFor(lookupKey);

          if (instance) {
            cache[fallback] = instance;
            return instance;
          }
        }
      }
    }, {
      key: '_instanceFor',
      value: function _instanceFor(key) {
        return this._owner.lookup(key);
      }
    }, {
      key: 'destroyCache',
      value: function destroyCache(cache) {
        var cacheEntries = Object.keys(cache);

        for (var i = 0, _length2 = cacheEntries.length; i < _length2; i++) {
          var cacheKey = cacheEntries[i];
          var cacheEntry = cache[cacheKey];
          if (cacheEntry) {
            cacheEntry.destroy();
          }
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.destroyCache(this._namespaces.adapter);
        this.destroyCache(this._namespaces.serializer);
        this._namespaces = null;
        this._store = null;
        this._owner = null;
      }
    }, {
      key: 'toString',
      value: function toString() {
        return 'ContainerInstanceCache';
      }
    }]);

    return ContainerInstanceCache;
  })();

  exports['default'] = ContainerInstanceCache;
});
/* global heimdall */