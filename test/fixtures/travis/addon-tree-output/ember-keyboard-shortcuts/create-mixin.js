define('ember-keyboard-shortcuts/create-mixin', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = function (bindEvent, unbindEvent) {

    return _ember['default'].Mixin.create({

      bindShortcuts: (function () {
        var self = this;
        var shortcuts = this.get('keyboardShortcuts');

        if (_ember['default'].typeOf(shortcuts) !== 'object') {
          return;
        }

        this.mousetraps = [];

        Object.keys(shortcuts).forEach(function (shortcut) {
          var actionObject = shortcuts[shortcut];
          var mousetrap = new Mousetrap(document.body);
          var preventDefault = true;

          function invokeAction(action) {
            var type = _ember['default'].typeOf(action);

            if (type === 'string') {
              mousetrap.bind(shortcut, function () {
                self.send(action);
                return preventDefault !== true;
              });
            } else if (type === 'function') {
              mousetrap.bind(shortcut, action.bind(self));
            } else {
              throw new Error('Invalid value for keyboard shortcut: ' + action);
            }
          }

          if (_ember['default'].typeOf(actionObject) === 'object') {
            if (actionObject.global === false) {
              mousetrap = new Mousetrap(document);
            } else if (actionObject.scoped) {
              mousetrap = new Mousetrap(self.get('element'));
            } else if (actionObject.targetElement) {
              mousetrap = new Mousetrap(actionObject.targetElement);
            }

            if (actionObject.preventDefault === false) {
              preventDefault = false;
            }

            invokeAction(actionObject.action);
          } else {
            invokeAction(actionObject);
          }

          self.mousetraps.push(mousetrap);
        });
      }).on(bindEvent),

      unbindShortcuts: (function () {
        this.mousetraps.forEach(function (mousetrap) {
          return mousetrap.reset();
        });
      }).on(unbindEvent)

    });
  };
});
/* global Mousetrap */