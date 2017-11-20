define('code-corps-ember/serializers/application', ['exports', 'ember-data', 'ember-inflector'], function (exports, _emberData, _emberInflector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var JSONAPISerializer = _emberData.default.JSONAPISerializer;
  exports.default = JSONAPISerializer.extend({
    createPageMeta: function createPageMeta(data) {
      var meta = {};

      Object.keys(data).forEach(function (type) {
        var link = data[type];
        meta[type] = {};
        var a = document.createElement('a');
        a.href = link;

        a.search.slice(1).split('&').forEach(function (pairs) {
          var _pairs$split = pairs.split('='),
              _pairs$split2 = _slicedToArray(_pairs$split, 2),
              param = _pairs$split2[0],
              value = _pairs$split2[1];

          if (param == 'page[page]') {
            meta[type].number = parseInt(value);
          }
          if (param == 'page[page-size]') {
            meta[type].size = parseInt(value);
          }
        });
        a = null;
      });

      return meta;
    },
    normalizeQueryResponse: function normalizeQueryResponse(store, klass, payload) {
      var result = this._super.apply(this, arguments);
      result.meta = result.meta || {};

      if (payload.links) {
        result.meta.pagination = this.createPageMeta(payload.links);
      }

      return result;
    },


    // Our Phoenix API uses singularized model names
    payloadKeyFromModelName: function payloadKeyFromModelName(modelName) {
      return (0, _emberInflector.singularize)(modelName);
    }
  });
});