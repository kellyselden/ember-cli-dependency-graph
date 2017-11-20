define('travis/models/log', ['exports', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _environment, _service, _object, _computed) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2;

  var ArrayProxy = Ember.ArrayProxy;
  var $ = Ember.$;
  var _run = Ember.run;
  var EmberObject = Ember.Object;


  var Request = EmberObject.extend({
    HEADERS: {
      accept: 'application/json; chunked=true; version=2, text/plain; version=2'
    },

    run: function run() {
      var _this2 = this;

      var url = '/jobs/' + this.id + '/log?cors_hax=true';
      return this.get('ajax').ajax(url, 'GET', {
        dataType: 'text',
        headers: this.HEADERS,
        success: function success(body, status, xhr) {
          _run(_this2, function () {
            return _this2.handle(body, status, xhr);
          });
        }
      });
    },
    handle: function handle(body, status, xhr) {
      var _this3 = this;

      if (_environment.default.featureFlags['pro-version']) {
        this.log.set('token', xhr.getResponseHeader('X-Log-Access-Token'));
      }
      if (xhr.status === 204) {
        return $.ajax({
          url: this.redirectTo(xhr),
          type: 'GET',
          success: function success(body) {
            _run(_this3, function () {
              this.handlers.text(body);
            });
          }
        });
      } else if (this.isJson(xhr)) {
        return _run(this, function () {
          this.handlers.json(body);
        });
      } else {
        return _run(this, function () {
          this.handlers.text(body);
        });
      }
    },
    redirectTo: function redirectTo(xhr) {
      // Firefox can't see the Location header on the xhr response due to the wrong
      // status code 204. Should be some redirect code but that doesn't work with CORS.
      return xhr.getResponseHeader('Location');
    },
    isJson: function isJson(xhr) {
      // Firefox can't see the Content-Type header on the xhr response due to the wrong
      // status code 204. Should be some redirect code but that doesn't work with CORS.
      var type = xhr.getResponseHeader('Content-Type') || '';
      return type.indexOf('json') > -1;
    }
  });

  exports.default = EmberObject.extend((_dec = (0, _computed.gt)('parts.length', 0), _dec2 = (0, _object.computed)(), (_obj = { features: null,

    version: 0,
    isLoaded: false,
    length: 0,
    hasContent: null,

    fetchMissingParts: function fetchMissingParts(partNumbers, after) {
      var data = void 0;
      if (this.get('notStarted')) {
        return;
      }
      data = {};
      if (partNumbers) {
        data['part_numbers'] = partNumbers;
      }
      if (after) {
        data['after'] = after;
      }
      var logUrl = '/jobs/' + this.get('job.id') + '/log';
      return this.get('ajax').ajax(logUrl, 'GET', {
        dataType: 'json',
        headers: {
          accept: 'application/json; chunked=true; version=2'
        },
        data: data,
        success: function (_this) {
          return function (body) {
            return _run(_this, function () {
              var i = void 0,
                  len = void 0,
                  part = void 0,
                  results = void 0;
              var parts = body.log.parts;

              if (parts) {
                results = [];
                for (i = 0, len = parts.length; i < len; i++) {
                  part = parts[i];
                  results.push(this.append(part));
                }
                return results;
              }
            });
          };
        }(this)
      });
    },
    parts: function parts() {
      return ArrayProxy.create({
        content: []
      });
    },
    clearParts: function clearParts() {
      var parts = void 0;
      parts = this.get('parts');
      return parts.set('content', []);
    },
    fetch: function fetch() {
      var handlers = void 0;
      this.debug('log model: fetching log');
      this.clearParts();
      handlers = {
        json: function (_this) {
          return function (json) {
            if (json['log']['removed_at']) {
              _this.set('removed', true);
            }
            return _this.loadParts(json['log']['parts']);
          };
        }(this),
        text: function (_this) {
          return function (text) {
            return _this.loadText(text);
          };
        }(this)
      };
      var id = this.get('job.id');
      if (id) {
        return Request.create({
          id: id,
          handlers: handlers,
          log: this,
          ajax: this.get('ajax')
        }).run();
      }
    },
    clear: function clear() {
      this.clearParts();
      return this.runOnClear();
    },
    runOnClear: function runOnClear() {
      var callback = this.get('onClearCallback');
      if (callback) {
        return callback();
      }
    },
    onClear: function onClear(callback) {
      return this.set('onClearCallback', callback);
    },
    append: function append(part) {
      if (this.get('parts').isDestroying || this.get('parts').isDestroyed) {
        return;
      }
      return this.get('parts').pushObject(part);
    },
    loadParts: function loadParts(parts) {
      var i = void 0,
          len = void 0,
          part = void 0;
      this.debug('log model: load parts');
      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i];
        this.append(part);
      }
      return this.set('isLoaded', true);
    },
    loadText: function loadText(text) {
      this.debug('log model: load text');
      this.append({
        number: 1,
        content: text,
        final: true
      });
      return this.set('isLoaded', true);
    },
    debug: function debug(message) {
      if (this.get('features.debugLogging')) {
        // eslint-disable-next-line
        console.log(message);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'features', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'features'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'hasContent', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'hasContent'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'parts', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'parts'), _obj)), _obj)));
});