define('ember-data-application-adapter-service/services/adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var Service = Ember.Service,
      get = Ember.get,
      getWithDefault = Ember.getWithDefault,
      set = Ember.set,
      service = Ember.inject.service;


  function buildUrl(adapter, url) {
    var host = getWithDefault(adapter, 'host', '');
    var namespace = get(adapter, 'namespace');

    var parts = [host];
    if (namespace) {
      parts.push(namespace);
    }
    parts.push(url);

    return parts.join('/');
  }

  exports.default = Service.extend({
    store: service(),

    init: function init() {
      this._super.apply(this, arguments);

      var adapter = get(this, 'store').adapterFor('application');
      set(this, '_adapter', adapter);
    },
    ajax: function ajax(url) {
      var adapter = get(this, '_adapter');

      var shouldIgnore = url.match(/^https?:\/\//);
      if (!shouldIgnore) {
        url = buildUrl(adapter, url);
      }

      var params = Array.prototype.slice.call(arguments, 1);

      return adapter.ajax.apply(adapter, [url].concat(_toConsumableArray(params)));
    }
  });
});