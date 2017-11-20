define('travis/adapters/v3', ['exports', 'travis/config/environment', 'ember-data/adapters/rest', 'ember-decorators/service'], function (exports, _environment, _rest, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _desc, _value, _obj, _init;

  var merge = Ember.merge;
  var underscore = Ember.String.underscore;
  var get = Ember.get;
  exports.default = _rest.default.extend((_obj = { auth: null,

    host: _environment.default.apiEndpoint,

    sortQueryParams: false,
    coalesceFindRequests: false,
    headers: {
      'Travis-API-Version': '3',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    ajaxOptions: function ajaxOptions(url) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
      var options = arguments[2];

      options = options || {};
      options.data = options.data || {};
      options.data = merge({}, options.data); // clone

      for (var key in options.data) {
        var value = options.data[key];
        if (Array.isArray(value)) {
          options.data[key] = value.join(',');
        }
      }

      var includes = this.get('includes');
      if (includes) {
        if (options.data.include) {
          options.data.include += ',' + includes;
        } else {
          options.data.include = includes;
        }
      }

      if (options.data.page_size) {
        options.data.limit = options.data.page_size;
        delete options.data.page_size;
      }

      var hash = this._super(url, type, options);

      hash.headers = hash.headers || {};

      var token = this.get('auth').token();
      if (token) {
        hash.headers['Authorization'] = 'token ' + token;
      }

      return hash;
    },

    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      var url = [];
      var host = get(this, 'host');
      var prefix = this.urlPrefix();
      var pathPrefix = this.pathPrefix.apply(this, arguments);

      if (pathPrefix) {
        url.push(pathPrefix);
      }

      if (modelName) {
        var path = this.pathForType(modelName, id);
        if (path) {
          url.push(path);
        }
      }

      if (id) {
        url.push(encodeURIComponent(id));
      }
      if (prefix) {
        url.unshift(prefix);
      }

      url = url.join('/');
      if (!host && url && url.charAt(0) !== '/') {
        url = '/' + url;
      }

      return url;
    },

    pathPrefix: function pathPrefix() {},


    pathForType: function pathForType(modelName, id) {
      var underscored = underscore(modelName);
      return id ? underscored : Ember.String.pluralize(underscored);
    },

    // Get the host alone, without a path
    getHost: function getHost() {
      var match = this.host.match(/(https?:\/\/)?([^\/]+)/);

      if (match) {
        return match[0];
      } else {
        return _environment.default.apiEndpoint;
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});