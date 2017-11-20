define('ember-cli-meta-tags/services/head-tags', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var get = Ember.get;


  //TODO: consider polyfilled Set
  var VALID_HEAD_TAGS = Ember.A(['base', 'link', 'meta', 'script', 'noscript', 'title']);

  var assign = Ember.assign ? Ember.assign : Ember.merge;

  var keys = Object.keys || Ember.keys;

  exports.default = Ember.Service.extend({
    headData: Ember.inject.service(),

    // crawl up the active route stack and collect head tags
    collectHeadTags: function collectHeadTags() {
      var _this = this;

      var tags = {};
      var currentHandlerInfos = this.get('router._routerMicrolib.currentHandlerInfos');
      if (!currentHandlerInfos) {
        currentHandlerInfos = this.get('router.router.currentHandlerInfos');
      }
      var handlerInfos = Ember.A(currentHandlerInfos);
      handlerInfos.forEach(function (handlerInfo) {
        assign(tags, _this._extractHeadTagsFromRoute(handlerInfo.handler));
      });
      var tagArray = Ember.A(keys(tags)).map(function (id) {
        return tags[id];
      });
      this.set('headData.headTags', Ember.A(tagArray));
    },
    _extractHeadTagsFromRoute: function _extractHeadTagsFromRoute(route) {
      var headTags = get(route, 'headTags');
      if (!headTags) {
        return {};
      }
      if (typeof headTags === 'function') {
        headTags = headTags.apply(route);
      } else if ((typeof headTags === 'undefined' ? 'undefined' : _typeof(headTags)) !== 'object') {
        // not recognized construct
        return {};
      }
      // convert headTags to object
      return this._buildTags(headTags);
    },


    // ensure all tags have a tagId and build object keyed by id
    _buildTags: function _buildTags(headTagsArray) {
      var tagMap = {};
      Ember.A(headTagsArray).forEach(function (tagDefinition) {
        if (!VALID_HEAD_TAGS.includes(tagDefinition.type)) {
          return;
        }
        var tagId = tagDefinition.tagId;
        if (!tagId) {
          tagId = Ember.guidFor(tagDefinition);
        }
        tagMap[tagId] = tagDefinition;
      });
      return tagMap;
    }
  });
});