define('ember-keyboard/utils/handle-key-event', ['exports', 'ember-keyboard/utils/get-mouse-name', 'ember-keyboard/utils/get-code', 'ember-keyboard/utils/listener-name'], function (exports, _getMouseName, _getCode, _listenerName3) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.handleKeyEventWithPropagation = handleKeyEventWithPropagation;
  exports.handleKeyEventWithLaxPriorities = handleKeyEventWithLaxPriorities;
  var get = Ember.get;
  var isPresent = Ember.isPresent;


  function gatherKeys(event) {
    var key = (0, _getCode.default)(event);
    var mouseButton = (0, _getMouseName.default)(event.button);
    var primaryEvent = [];

    if (isPresent(key)) primaryEvent.push(key);
    if (isPresent(mouseButton)) primaryEvent.push(mouseButton);

    return ['alt', 'ctrl', 'meta', 'shift'].reduce(function (keys, keyName) {
      if (event[keyName + 'Key']) {
        keys.push(keyName);
      }

      return keys;
    }, primaryEvent);
  }

  function handleKeyEventWithPropagation(event, _ref) {
    var firstResponders = _ref.firstResponders,
        normalResponders = _ref.normalResponders;

    var keys = gatherKeys(event);
    var listenerNames = [(0, _listenerName3.default)(event.type, keys), (0, _listenerName3.default)(event.type)];

    var isImmediatePropagationStopped = false;
    var isPropagationStopped = false;
    var ekEvent = {
      stopImmediatePropagation: function stopImmediatePropagation() {
        isImmediatePropagationStopped = true;
      },
      stopPropagation: function stopPropagation() {
        isPropagationStopped = true;
      }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = firstResponders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var responder = _step.value;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = listenerNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _listenerName = _step3.value;

            responder.trigger(_listenerName, event, ekEvent);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        if (isImmediatePropagationStopped) {
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (isPropagationStopped) {
      return;
    }

    isImmediatePropagationStopped = false;

    var previousPriorityLevel = Number.POSITIVE_INFINITY;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = normalResponders[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _responder = _step2.value;

        var currentPriorityLevel = Number(get(_responder, 'keyboardPriority'));

        if (isImmediatePropagationStopped && currentPriorityLevel === previousPriorityLevel) {
          continue;
        }

        if (currentPriorityLevel < previousPriorityLevel) {
          if (isPropagationStopped) {
            return;
          }
          isImmediatePropagationStopped = false;
          previousPriorityLevel = currentPriorityLevel;
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = listenerNames[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _listenerName2 = _step4.value;

            _responder.trigger(_listenerName2, event, ekEvent);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  function handleKeyEventWithLaxPriorities(event, sortedResponders) {
    var currentPriorityLevel = void 0;
    var noFirstResponders = true;
    var isLax = true;

    var keys = gatherKeys(event);
    var listenerNames = [(0, _listenerName3.default)(event.type)];

    if (keys.length > 0) listenerNames.unshift((0, _listenerName3.default)(event.type, keys));

    sortedResponders.every(function (responder) {
      var keyboardFirstResponder = get(responder, 'keyboardFirstResponder');
      var keyboardPriority = get(responder, 'keyboardPriority');

      if (keyboardFirstResponder || noFirstResponders && keyboardPriority >= currentPriorityLevel || isLax) {
        if (!get(responder, 'keyboardLaxPriority')) {
          isLax = false;
        }

        if (keyboardFirstResponder) {
          if (!isLax) {
            noFirstResponders = false;
          }
        } else {
          currentPriorityLevel = keyboardPriority;
        }

        listenerNames.forEach(function (triggerName) {
          if (responder.has(triggerName)) {
            responder.trigger(triggerName, event);
          }
        });

        return true;
      } else {
        return false;
      }
    });
  }
});