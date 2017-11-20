define('travis/utils/fetch-live-paginated-collection', ['exports', 'travis/utils/live-paginated-collection'], function (exports, _livePaginatedCollection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  // Fetches a LivePaginatedCollection instance
  //
  // It will use store.filter function in order to get a base for pagination and
  // then it will create a paginated collection with a content set to the filtered
  // collection.
  var fetchLivePaginatedCollection = function fetchLivePaginatedCollection(store, modelName, queryParams, options) {
    var dependencies = options.dependencies || [],
        filter = options.filter || function () {
      return true;
    },
        filtered = store.filter(modelName, queryParams, filter, dependencies, options.forceReload);

    return filtered.then(function (filteredArray) {
      var sort = options.sort;
      var liveCollection = _livePaginatedCollection.default.create({ modelName: modelName, store: store, sort: sort, dependencies: dependencies, content: filteredArray });

      if (options.forceReload) {
        // if forceReload was used, another query was fetched and we can update
        // pagination data based on the result
        filteredArray._lastPromise.then(function (array) {
          return liveCollection.setPaginationData(array.get('queryResult'));
        });
        liveCollection._lastPromise = filteredArray._lastPromise;
      }

      return liveCollection;
    });
  };

  exports.default = fetchLivePaginatedCollection;
});