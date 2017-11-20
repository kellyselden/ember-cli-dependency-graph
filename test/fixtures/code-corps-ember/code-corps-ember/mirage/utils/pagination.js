define('code-corps-ember/mirage/utils/pagination', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var link = function link(endpoint, pageNumber, pageSize) {
    return endpoint + '?page[page]=' + pageNumber + '&page[page-size]=' + pageSize;
  };

  var paginate = function paginate(collection, endpoint, queryParams) {
    var pageNumber = parseInt(queryParams['page[page]']);
    var pageSize = parseInt(queryParams['page[page-size]']);

    var page = collection.filter(function (p, index) {
      return index >= (pageNumber - 1) * pageSize && index < pageNumber * pageSize;
    });

    var links = {
      'self': link(endpoint, pageNumber, pageSize)
    };

    var lastPageNumber = Math.ceil(collection.length / pageSize);

    if (pageNumber != lastPageNumber) {
      var nextPageNumber = pageNumber + 1;
      links.last = link(endpoint, lastPageNumber, pageSize);
      links.next = link(endpoint, nextPageNumber, pageSize);
    }

    if (pageNumber > 1) {
      var prevPageNumber = pageNumber - 1;
      links.prev = link(endpoint, prevPageNumber, pageSize);
    }

    page.meta = page.meta || {};
    page.meta = links;

    return page;
  };

  exports.link = link;
  exports.paginate = paginate;
});