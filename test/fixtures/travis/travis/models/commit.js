define('travis/models/commit', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/service', 'ember-decorators/object'], function (exports, _model, _attr, _relationships, _service, _object) {
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

  var _dec, _dec2, _dec3, _desc, _value, _obj, _init;

  exports.default = _model.default.extend((_dec = (0, _object.computed)('message'), _dec2 = (0, _object.computed)('message'), _dec3 = (0, _object.computed)('authorName', 'authorEmail', 'committerName', 'committerEmail'), (_obj = { externalLinks: null,

    sha: (0, _attr.default)(),
    branch: (0, _attr.default)(),
    message: (0, _attr.default)(),
    compareUrl: (0, _attr.default)(),
    authorName: (0, _attr.default)(),
    authorEmail: (0, _attr.default)(),
    committerName: (0, _attr.default)(),
    committerEmail: (0, _attr.default)(),
    committedAt: (0, _attr.default)(),
    committerAvatarUrl: (0, _attr.default)(),
    authorAvatarUrl: (0, _attr.default)(),

    build: (0, _relationships.belongsTo)('build'),

    subject: function subject(message) {
      if (message) {
        return message.split('\n', 1)[0];
      }
    },
    body: function body(message) {
      if (message && message.indexOf('\n') > 0) {
        return message.substr(message.indexOf('\n') + 1).trim();
      } else {
        return '';
      }
    },
    authorIsCommitter: function authorIsCommitter(authorName, authorEmail, committerName, committerEmail) {
      return authorName === committerName && authorEmail === committerEmail;
    }
  }, (_applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'subject', [_dec], Object.getOwnPropertyDescriptor(_obj, 'subject'), _obj), _applyDecoratedDescriptor(_obj, 'body', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'body'), _obj), _applyDecoratedDescriptor(_obj, 'authorIsCommitter', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'authorIsCommitter'), _obj)), _obj)));
});