define('ember-remarkable/components/md-text', ['exports', 'ember', 'remarkable', 'ember-remarkable/templates/components/md-text'], function (exports, _ember, _remarkable, _emberRemarkableTemplatesComponentsMdText) {
  var computed = _ember['default'].computed;
  var HTMLBars = _ember['default'].HTMLBars;
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberRemarkableTemplatesComponentsMdText['default'],

    tagName: '',

    text: '',
    typographer: false,
    linkify: false,
    linkTarget: '',
    html: false,
    extensions: true,
    dynamic: false,
    highlightJsExcluded: _ember['default'].computed(function () {
      var config = undefined;
      if (_ember['default'].getOwner) {
        config = _ember['default'].getOwner(this).resolveRegistration('config:environment');
      } else {
        var registry = this.container.registry || this.container._registry;
        config = registry.resolve('config:environment');
      }
      var remarkableConfig = config.remarkable || {};
      return remarkableConfig.excludeHighlightJs || false;
    }),
    highlight: _ember['default'].computed('highlightJsExcluded', function () {
      var highlightJsExcluded = this.get('highlightJsExcluded');
      return function (str, lang) {
        if (!highlightJsExcluded) {
          if (lang === 'text' || lang === 'no-highlight') {
            return '';
          }

          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (err) {}
          }

          try {
            return hljs.highlightAuto(str).value;
          } catch (err) {}
        }

        return '';
      };
    }),

    parsedMarkdownUnsafe: computed('text', 'html', 'typographer', 'linkify', 'linkTarget', function () {
      var md = new _remarkable['default']({
        typographer: this.get('typographer'),
        linkify: this.get('linkify'),
        linkTarget: this.get('linkTarget'),
        html: this.get('html'),
        highlight: this.get('highlight')
      });

      if (this.get('extensions')) {
        md.core.ruler.enable(['abbr']);
        md.block.ruler.enable(['footnote', 'deflist']);
        md.inline.ruler.enable(['footnote_inline', 'ins', 'mark', 'sub', 'sup']);
      }

      var plugins = this.get('plugins');
      if (plugins) {
        plugins.forEach(function (plugin) {
          return md.use(plugin);
        });
      }

      return md.render(this.get('text'));
    }),

    parsedMarkdown: computed('parsedMarkdownUnsafe', function () {
      var parsedMarkdownUnsafe = this.get('parsedMarkdownUnsafe');
      return new _ember['default'].String.htmlSafe(parsedMarkdownUnsafe);
    }),

    precompiledTemplate: computed('parsedMarkdownUnsafe', function () {
      var parsedMarkdownUnsafe = this.get('parsedMarkdownUnsafe');
      return HTMLBars.compile(parsedMarkdownUnsafe, false);
    })
  });
});