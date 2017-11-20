define('code-corps-ember/adapters/project', ['exports', 'code-corps-ember/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _application.default.extend({
    /**
     * Clears out query parameters which are used to build a url.
     * These would be `slug` and `sluggedRouteSlug`
     *
     * @method sortQueryParams
     * @param  Object query query object
     * @return Object modified query object
     */
    sortQueryParams: function sortQueryParams(query) {
      query = query || {};

      if (query.slug) {
        delete query.slug;
      }
      if (query.sluggedRouteSlug) {
        delete query.sluggedRouteSlug;
      }

      return query;
    },


    /**
     * Builds URL from query object if the object contains
     * `sluggedRouteSlug` key
     *
     * @method urlForQuery
     * @param  Object query Object containing all query parameters for the request
     * @return String       Built URL string - `/:sluggedRouteSlug/projects/`
     */
    urlForQuery: function urlForQuery(query) {
      query = query || {};

      if (query.sluggedRouteSlug) {
        var url = [];
        var host = get(this, 'host');
        var prefix = this.urlPrefix();

        url.push(encodeURIComponent(query.sluggedRouteSlug));
        url.push('projects');

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


    /**
     * Builds URL from query object if the object contains
     * `sluggedRouteSlug` and `slug` keys
     *
     * @method urlForQueryRecord
     * @param  Object query Object containing all query parameters for the request
     * @return String       Built URL string - `/:sluggedRouteSlug/projects/:slug`
     */
    urlForQueryRecord: function urlForQueryRecord(query) {
      query = query || {};

      if (query.slug && query.sluggedRouteSlug) {
        var url = [];
        var host = get(this, 'host');
        var prefix = this.urlPrefix();

        url.push(encodeURIComponent(query.sluggedRouteSlug));
        url.push(encodeURIComponent(query.slug));

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
    }
  });
});