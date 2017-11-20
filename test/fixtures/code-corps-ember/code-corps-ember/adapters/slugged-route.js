define('code-corps-ember/adapters/slugged-route', ['exports', 'code-corps-ember/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _application.default.extend({
    /**
     * Clears out query parameters which are used to build a url.
     * This would be the `slug` parameter
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

      return query;
    },


    /**
     * Builds URL from query object if the object contains
     * `sluggedRouteSlug` and `slug` keys
     *
     * @method urlForQueryRecord
     * @param  Object query Object containing all query parameters for the request
     * @return String       Built URL string - `/:sluggedRouteSlug`
     */
    urlForQueryRecord: function urlForQueryRecord(query) {
      query = query || {};

      if (query.slug) {
        var url = [];
        var host = get(this, 'host');
        var prefix = this.urlPrefix();

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