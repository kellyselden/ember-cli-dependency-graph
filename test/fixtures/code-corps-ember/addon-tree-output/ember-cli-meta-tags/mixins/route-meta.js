define('ember-cli-meta-tags/mixins/route-meta', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.metaToHeadTags = metaToHeadTags;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  // Route mixin for setting head meta tags on transition into/out of route

  // @example How to set meta tags on a route
  //   ExampleRoute = Ember.Route.extend RouteMetaMixin,
  //     meta: ->
  //       return
  //         meta_property_name1: meta_value1
  //         meta_property_name2: meta_value2

  var keys = Object.keys || Ember.keys;

  function metaToHeadTags(meta) {
    var metaTypes = keys(meta);
    return metaTypes.reduce(function (headTags, meta_type) {
      return headTags.pushObjects(keys(meta[meta_type]).map(function (key) {
        var _attrs;

        return {
          tagId: meta_type + ':' + key,
          type: 'meta',
          attrs: (_attrs = {}, _defineProperty(_attrs, meta_type, key), _defineProperty(_attrs, 'content', meta[meta_type][key]), _attrs)
        };
      }));
    }, Ember.A([]));
  }

  exports.default = Ember.Mixin.create({
    headTagsService: Ember.inject.service('head-tags'),

    // convert legacy meta tags to headTags
    headTags: function headTags() {
      var meta = this.get('meta');
      if (typeof meta === 'function') {
        meta = meta.apply(this);
      } else if ((typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) !== 'object') {
        return undefined;
      }

      return metaToHeadTags(meta);
    },


    actions: {
      resetMeta: function resetMeta() {
        var service = this.get('headTagsService');
        Ember.run.next(service, 'collectHeadTags');
      }
    }

  });
});