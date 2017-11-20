define('ember-cli-page-object/-private/execution_context/acceptance', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context/helpers', 'ember-cli-page-object/-private/better-errors'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_contextHelpers, _emberCliPageObjectPrivateBetterErrors) {
  exports['default'] = AcceptanceExecutionContext;

  function AcceptanceExecutionContext(pageObjectNode) {
    this.pageObjectNode = pageObjectNode;
  }

  AcceptanceExecutionContext.prototype = {
    run: function run(cb) {
      return cb(this);
    },

    runAsync: function runAsync(cb) {
      var _this = this;

      /* global wait */
      wait().then(function () {
        cb(_this);
      });

      return this.pageObjectNode;
    },

    visit: (function (_visit) {
      function visit(_x) {
        return _visit.apply(this, arguments);
      }

      visit.toString = function () {
        return _visit.toString();
      };

      return visit;
    })(function (path) {
      /* global visit */
      visit(path);
    }),

    click: (function (_click) {
      function click(_x2, _x3) {
        return _click.apply(this, arguments);
      }

      click.toString = function () {
        return _click.toString();
      };

      return click;
    })(function (selector, container) {
      /* global click */
      click(selector, container);
    }),

    fillIn: function fillIn(selector, container, options, content) {
      var $selection = find(selector, container || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      /* global focus */
      focus($selection);

      (0, _emberCliPageObjectPrivateExecution_contextHelpers.fillElement)($selection, content, {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      /* global triggerEvent */
      triggerEvent(selector, container, 'input');
      triggerEvent(selector, container, 'change');
    },

    triggerEvent: (function (_triggerEvent) {
      function triggerEvent(_x4, _x5, _x6, _x7) {
        return _triggerEvent.apply(this, arguments);
      }

      triggerEvent.toString = function () {
        return _triggerEvent.toString();
      };

      return triggerEvent;
    })(function (selector, container, eventName, eventOptions) {
      /* global triggerEvent */
      triggerEvent(selector, container, eventName, eventOptions);
    }),

    assertElementExists: function assertElementExists(selector, options) {
      /* global find */
      var result = find(selector, options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      if (result.length === 0) {
        (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _emberCliPageObjectPrivateBetterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }
    },

    find: (function (_find) {
      function find(_x8, _x9) {
        return _find.apply(this, arguments);
      }

      find.toString = function () {
        return _find.toString();
      };

      return find;
    })(function (selector, options) {
      var result = undefined;

      selector = (0, _emberCliPageObjectPrivateHelpers.buildSelector)(this.pageObjectNode, selector, options);

      /* global find */
      result = find(selector, options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      (0, _emberCliPageObjectPrivateHelpers.guardMultiple)(result, selector, options.multiple);

      return result;
    }),

    findWithAssert: function findWithAssert(selector, options) {
      var result = undefined;

      selector = (0, _emberCliPageObjectPrivateHelpers.buildSelector)(this.pageObjectNode, selector, options);

      /* global find */
      result = find(selector, options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      if (result.length === 0) {
        (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _emberCliPageObjectPrivateBetterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }

      (0, _emberCliPageObjectPrivateHelpers.guardMultiple)(result, selector, options.multiple);

      return result;
    }
  };
});