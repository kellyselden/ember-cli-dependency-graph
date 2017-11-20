define('ember-weakmap/weak-map', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var meta = _ember['default'].meta;

  var id = 0;
  var dateKey = new Date().getTime();
  var metaKey = symbol();

  function UNDEFINED() {}

  function symbol() {
    return '__ember' + dateKey + id++;
  }

  var WeakMap = (function () {
    function WeakMap(iterable) {
      _classCallCheck(this, WeakMap);

      this._id = symbol();

      if (iterable === null || iterable === undefined) {
        return;
      } else if (Array.isArray(iterable)) {
        for (var i = 0; i < iterable.length; i++) {
          var _iterable$i = _slicedToArray(iterable[i], 2);

          var key = _iterable$i[0];
          var value = _iterable$i[1];

          this.set(key, value);
        }
      } else {
        throw new TypeError('The weak map constructor polyfill only supports an array argument');
      }
    }

    /*
     * @method get
     * @param key {Object}
     * @return {*} stored value
     */

    _createClass(WeakMap, [{
      key: 'get',
      value: function get(obj) {
        var metaInfo = meta(obj);
        var metaObject = metaInfo[metaKey];

        if (metaInfo && metaObject) {
          if (metaObject[this._id] === UNDEFINED) {
            return undefined;
          }

          return metaObject[this._id];
        }
      }

      /*
       * @method set
       * @param key {Object}
       * @param value {Any}
       * @return {Any} stored value
       */
    }, {
      key: 'set',
      value: function set(obj, value) {
        var type = typeof obj;

        if (!obj || type !== 'object' && type !== 'function') {
          throw new TypeError('Invalid value used as weak map key');
        }

        var metaInfo = meta(obj);
        if (value === undefined) {
          value = UNDEFINED;
        }

        if (!metaInfo[metaKey]) {
          metaInfo[metaKey] = {};
        }

        metaInfo[metaKey][this._id] = value;
        return this;
      }

      /*
       * @method has
       * @param key {Object}
       * @return {Boolean} if the key exists
       */
    }, {
      key: 'has',
      value: function has(obj) {
        var metaInfo = meta(obj);
        var metaObject = metaInfo[metaKey];

        return metaObject && metaObject[this._id] !== undefined;
      }

      /*
       * @method delete
       * @param key {Object}
       */
    }, {
      key: 'delete',
      value: function _delete(obj) {
        var metaInfo = meta(obj);

        if (this.has(obj)) {
          delete metaInfo[metaKey][this._id];

          return true;
        }

        return false;
      }
    }]);

    return WeakMap;
  })();

  exports['default'] = _ember['default'].WeakMap ? _ember['default'].WeakMap : WeakMap;
});