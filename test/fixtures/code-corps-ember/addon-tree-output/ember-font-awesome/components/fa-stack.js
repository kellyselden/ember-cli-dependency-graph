define('ember-font-awesome/components/fa-stack', ['exports', 'ember', 'ember-font-awesome/utils/try-match', 'ember-font-awesome/templates/components/fa-stack'], function (exports, _ember, _emberFontAwesomeUtilsTryMatch, _emberFontAwesomeTemplatesComponentsFaStack) {
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberFontAwesomeTemplatesComponentsFaStack['default'],

    tagName: 'span',
    classNames: 'fa-stack',
    classNameBindings: ['sizeCssClass'],

    sizeCssClass: computed('size', function () {
      var size = get(this, 'size');
      if (!size) {
        return;
      }

      if ((0, _emberFontAwesomeUtilsTryMatch['default'])(size, /^fa-/)) {
        return size;
      } else if ((0, _emberFontAwesomeUtilsTryMatch['default'])(size, /(?:lg|x)$/)) {
        return 'fa-' + size;
      } else {
        return 'fa-' + size + 'x';
      }
    })
  });
});