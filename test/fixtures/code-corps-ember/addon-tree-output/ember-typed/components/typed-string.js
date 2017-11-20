define('ember-typed/components/typed-string', ['exports', 'ember', 'ember-typed/templates/components/typed-string'], function (exports, _ember, _emberTypedTemplatesComponentsTypedString) {
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberTypedTemplatesComponentsTypedString['default'],
    tagName: 'span',
    strings: ['first sentence', 'last sentence'],
    stringsElement: null,
    typeSpeed: 0,
    startDelay: 0,
    backSpeed: 0,
    backDelay: 500,
    loop: false,
    loopCount: false,
    showCursor: true,
    cursorChar: '|',
    attr: null,
    contentType: 'html',
    callback: function callback() {},
    preStringTyped: function preStringTyped() {},
    onStringTyped: function onStringTyped() {},
    resetCallback: function resetCallback() {},

    didInsertElement: function didInsertElement() {
      var _getProperties = this.getProperties('strings', 'stringsElement', 'typeSpeed', 'startDelay', 'backSpeed', 'backDelay', 'loop', 'loopCount', 'showCursor', 'cursorChar', 'attr', 'contentType', 'callback', 'preStringTyped', 'onStringTyped', 'resetCallback');

      var strings = _getProperties.strings;
      var stringsElement = _getProperties.stringsElement;
      var typeSpeed = _getProperties.typeSpeed;
      var startDelay = _getProperties.startDelay;
      var backSpeed = _getProperties.backSpeed;
      var backDelay = _getProperties.backDelay;
      var loop = _getProperties.loop;
      var loopCount = _getProperties.loopCount;
      var showCursor = _getProperties.showCursor;
      var cursorChar = _getProperties.cursorChar;
      var attr = _getProperties.attr;
      var contentType = _getProperties.contentType;
      var callback = _getProperties.callback;
      var preStringTyped = _getProperties.preStringTyped;
      var onStringTyped = _getProperties.onStringTyped;
      var resetCallback = _getProperties.resetCallback;

      this.$().typed({
        strings: strings,
        stringsElement: stringsElement,
        typeSpeed: typeSpeed,
        startDelay: startDelay,
        backSpeed: backSpeed,
        backDelay: backDelay,
        loop: loop,
        loopCount: loopCount,
        showCursor: showCursor,
        cursorChar: cursorChar,
        attr: attr,
        contentType: contentType,
        callback: callback,
        preStringTyped: preStringTyped,
        onStringTyped: onStringTyped,
        resetCallback: resetCallback
      });
    }
  });
});