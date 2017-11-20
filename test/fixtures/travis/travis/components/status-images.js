define('travis/components/status-images', ['exports', 'ember-decorators/service', 'ember-decorators/object'], function (exports, _service, _object) {
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

  var _dec, _desc, _value, _obj, _init, _init2, _init3;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('format', 'repo.slug', 'branch', 'repo.defaultBranch.name'), (_obj = { auth: null,
    externalLinks: null,
    statusImages: null,

    id: 'status-images',
    attributeBindings: ['id'],
    classNames: ['popup', 'status-images'],
    formats: ['Image URL', 'Markdown', 'Textile', 'Rdoc', 'AsciiDoc', 'RST', 'Pod', 'CCTray'],

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      this.set('branch', this.get('repo.defaultBranch.name'));
    },
    statusString: function statusString(format, slug, branch, defaultBranchName) {
      var repo = this.get('repo');
      if (repo) {
        var imageFormat = format || this.get('formats.firstObject');
        var gitBranch = branch || defaultBranchName;

        return this.formatStatusImage(imageFormat, repo, gitBranch);
      }
    },
    formatStatusImage: function formatStatusImage(format, repo, branch) {
      switch (format) {
        case 'Image URL':
          return this.get('statusImages').imageUrl(repo, branch);
        case 'Markdown':
          return this.get('statusImages').markdownImageString(repo, branch);
        case 'Textile':
          return this.get('statusImages').textileImageString(repo, branch);
        case 'Rdoc':
          return this.get('statusImages').rdocImageString(repo, branch);
        case 'AsciiDoc':
          return this.get('statusImages').asciidocImageString(repo, branch);
        case 'RST':
          return this.get('statusImages').rstImageString(repo, branch);
        case 'Pod':
          return this.get('statusImages').podImageString(repo, branch);
        case 'CCTray':
          return this.get('statusImages').ccXml(repo, branch);
      }
    },


    actions: {
      toggleStatusImageModal: function toggleStatusImageModal() {
        this.get('onClose')();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'statusImages', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'statusImages'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'statusString', [_dec], Object.getOwnPropertyDescriptor(_obj, 'statusString'), _obj)), _obj)));
});