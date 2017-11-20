define('code-corps-ember/services/mention-fetcher', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var RSVP = Ember.RSVP;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    store: service(),

    prefetchBodyWithMentions: function prefetchBodyWithMentions(record /* , type*/) {
      return get(record, 'body');

      /*
      let relationshipType = `${type}UserMentions`;
      let mentions = record.get(relationshipType);
      return parse(body, mentions);
      */
    },
    fetchBodyWithMentions: function fetchBodyWithMentions(record /* , type*/) {
      /*
      let store = this.get('store');
      let mentionType = `${type}-user-mention`;
      let keyForParentId = `${type}_id`;
      let queryParams = {};
      queryParams[keyForParentId] = record.id;
       return store.query(mentionType, queryParams).then((mentions) => {
        return parse(record.get('body'), mentions);
      });
      */

      return RSVP.resolve(get(record, 'body'));
    }
  });
});