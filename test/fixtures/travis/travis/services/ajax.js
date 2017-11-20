define('travis/services/ajax', ['exports', 'travis/config/environment', 'ember-decorators/service'], function (exports, _environment, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

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

  var _desc, _value, _obj, _init, _init2;

  var isNone = Ember.isNone;
  var EmberPromise = Ember.RSVP.Promise;
  var $ = Ember.$;
  var get = Ember.get;
  var Service = Ember.Service;


  jQuery.support.cors = true;

  var defaultOptions = {
    accepts: {
      json: 'application/json; version=2'
    }
  };

  exports.default = Service.extend((_obj = { auth: null,
    features: null,

    get: function get(url, callback, errorCallback) {
      return this.ajax(url, 'get', {
        success: callback,
        error: errorCallback
      });
    },
    post: function post(url, data, callback) {
      return this.ajax(url, 'post', {
        data: data,
        success: callback
      });
    },
    postV3: function postV3(url, data, callback) {
      return this.ajax(url, 'post', {
        data: data,
        success: callback,
        headers: {
          'Travis-API-Version': '3'
        }
      });
    },
    patch: function patch(url, data, callback) {
      return this.ajax(url, 'patch', {
        data: data,
        success: callback
      });
    },
    needsAuth: function needsAuth() {
      return true;
    },
    ajax: function ajax(url, method, options) {
      var _this = this;

      var accepts = void 0,
          data = void 0,
          delimeter = void 0,
          endpoint = void 0,
          error = void 0,
          key = void 0,
          name = void 0,
          params = void 0,
          promise = void 0,
          ref = void 0,
          ref1 = void 0,
          ref2 = void 0,
          reject = void 0,
          resolve = void 0,
          success = void 0,
          token = void 0,
          value = void 0,
          xhr = void 0;
      method = (method || 'GET').toUpperCase();
      endpoint = _environment.default.apiEndpoint || '';
      options = options || {};
      token = get(this, 'auth').token();
      if (token && (this.needsAuth(method, url) || options.forceAuth)) {
        options.headers = options.headers || {};
        if (!options.headers['Authorization']) {
          options.headers['Authorization'] = 'token ' + token;
        }
      }
      options.url = url = '' + endpoint + url;
      options.type = method;
      options.dataType = options.dataType || 'json';
      options.context = this;
      if (options.data && method !== 'GET') {
        options.data = JSON.stringify(options.data);
      }
      if (method !== 'GET' && method !== 'HEAD') {
        options.contentType = options.contentType || 'application/json; charset=utf-8';
      }
      success = options.success || function () {};
      options.success = function (data, status, xhr) {
        return success.call(this, data, status, xhr);
      };
      error = options.error || function () {};
      options.error = function (data, status, xhr) {
        if (get(_this, 'features').get('debugLogging')) {
          // eslint-disable-next-line
          console.log('[ERROR] API responded with an error (' + status + '): ' + JSON.stringify(data));
        }
        return error.call(_this, data, status, xhr);
      };

      options = $.extend(options, defaultOptions);

      if (options.data && (method === 'GET' || method === 'HEAD')) {
        params = jQuery.param(options.data);
        delimeter = url.indexOf('?') === -1 ? '?' : '&';
        url = url + delimeter + params;
      }
      xhr = new XMLHttpRequest();
      xhr.open(method, url);
      if (options.accepts && ((ref = options.headers) != null ? ref.accept : void 0) == null) {
        accepts = [];
        ref1 = options.accepts;
        for (key in ref1) {
          value = ref1[key];
          accepts.pushObject(value);
        }
        xhr.setRequestHeader('Accept', accepts.join(', '));
      }
      if (options.headers) {
        ref2 = options.headers;
        for (name in ref2) {
          value = ref2[name];
          xhr.setRequestHeader(name, value);
        }
      }
      if (options.contentType) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }
      resolve = null;
      reject = null;
      promise = new EmberPromise(function (_resolve, _reject) {
        resolve = _resolve;
        return reject = _reject;
      });
      xhr.onreadystatechange = function () {
        var contentType = void 0,
            data = void 0;
        if (xhr.readyState === 4) {
          contentType = xhr.getResponseHeader('Content-Type');
          data = function () {
            if (contentType && contentType.match(/application\/json/)) {
              try {
                return jQuery.parseJSON(xhr.responseText);
              } catch (error1) {
                if (get(_this, 'features').get('debugLogging')) {
                  // eslint-disable-next-line
                  console.log('error while parsing a response', method, options.url, xhr.responseText);
                }
              }
            } else {
              return xhr.responseText;
            }
          }();
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
            return options.success.call(options.context, data, xhr.status, xhr);
          } else {
            reject(xhr);
            return options.error.call(options.context, data, xhr.status, xhr);
          }
        }
      };
      data = options.data;
      var contentType = options.contentType;
      var isJSON = isNone(contentType) || contentType.match(/application\/json/);
      if (_typeof(options.data) === 'object' && isJSON) {
        data = JSON.stringify(data);
      }
      if (data) {
        xhr.send(data);
      } else {
        xhr.send();
      }
      return promise;
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'features', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'features'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj));
});