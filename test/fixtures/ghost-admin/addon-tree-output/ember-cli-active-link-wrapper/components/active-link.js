define('ember-cli-active-link-wrapper/components/active-link', ['exports', 'ember', 'ember-cli-active-link-wrapper/mixins/active-link'], function (exports, _ember, _emberCliActiveLinkWrapperMixinsActiveLink) {
  exports['default'] = _ember['default'].Component.extend(_emberCliActiveLinkWrapperMixinsActiveLink['default'], {
    tagName: 'li'
  });
});