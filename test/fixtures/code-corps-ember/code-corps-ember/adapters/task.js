define('code-corps-ember/adapters/task', ['exports', 'code-corps-ember/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var underscore = Ember.String.underscore;
  var get = Ember.get;
  var isBlank = Ember.isBlank;
  exports.default = _application.default.extend({
    // need to delete slug and sluggedRouteSlug properties from the query.
    // otherwise, they will get auto-added to the end of our url
    sortQueryParams: function sortQueryParams(query) {
      query = query || {};

      // to preserve a clean url with just `&page=X` we only
      // transform the page number to the proper JSON api format here, in the
      // adapter, instead of back in the route
      if (isBlank(query.page)) {
        delete query.page;
      } else {
        query.page = { page: query.page };
      }

      // we don't want to send the status parameter to the API if it does not
      // have a proper value
      if (isBlank(query.status)) {
        delete query.status;
      }

      // projectId is part of the url in `projects/:projectId/tasks`, so we
      // do not want to see it in the query as well
      delete query.projectId;

      // any remaining fields are in camelCase, so we want to serialize them into
      // underscore_format
      var serializedQuery = this._serializeQuery(query);

      return this._super(serializedQuery);
    },
    urlForQuery: function urlForQuery(query) {
      if (query.projectId) {
        var url = [];
        var host = get(this, 'host');
        var prefix = this.urlPrefix();

        url.push(encodeURIComponent('projects'));
        url.push(encodeURIComponent(query.projectId));
        url.push(encodeURIComponent('tasks'));

        if (prefix) {
          url.unshift(prefix);
        }

        url = url.join('/');
        if (!host && url) {
          url = '/' + url;
        }

        return url;
      } else {
        return this._super.apply(arguments);
      }
    },
    urlForQueryRecord: function urlForQueryRecord(query) {
      query = query || {};

      // if there are slug and sluggedRouteSlug properties in the query, we
      // need to build the url as (prefix/)host/sluggedRouteSlug/slug
      if (query.number && query.projectId) {
        var url = [];
        var host = get(this, 'host');
        var prefix = this.urlPrefix();

        url.push(encodeURIComponent('projects'));
        url.push(encodeURIComponent(query.projectId));
        url.push(encodeURIComponent('tasks'));
        url.push(encodeURIComponent(query.number));

        delete query.number;

        if (prefix) {
          url.unshift(prefix);
        }

        url = url.join('/');
        if (!host && url) {
          url = '/' + url;
        }

        return url;
      } else {
        return this._super.apply(arguments);
      }
    },
    _serializeQuery: function _serializeQuery(query) {
      var serializedQuery = {};

      for (var key in query) {
        var serializedKey = underscore(key);
        serializedQuery[serializedKey] = query[key];
      }

      return serializedQuery;
    }
  });
});