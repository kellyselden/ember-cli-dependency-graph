define('ember-cli-page-object/-private/execution_context/integration', ['exports', 'ember', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context/helpers', 'ember-cli-page-object/-private/better-errors'], function (exports, _ember, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_contextHelpers, _emberCliPageObjectPrivateBetterErrors) {
  exports['default'] = IntegrationExecutionContext;
  var _$ = _ember['default'].$;
  var run = _ember['default'].run;

  function IntegrationExecutionContext(pageObjectNode, testContext) {
    this.pageObjectNode = pageObjectNode;
    this.testContext = testContext;
  }

  IntegrationExecutionContext.prototype = {
    run: function run(cb) {
      return cb(this);
    },

    runAsync: function runAsync(cb) {
      var _this = this;

      run(function () {
        cb(_this);
      });

      return this.pageObjectNode;
    },

    // Do nothing in integration test
    visit: _$.noop,

    click: function click(selector, container) {
      this.$(selector, container).click();
    },

    fillIn: function fillIn(selector, container, options, content) {
      var $selection = this.$(selector, container);

      (0, _emberCliPageObjectPrivateExecution_contextHelpers.fillElement)($selection, content, {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $selection.trigger('input');
      $selection.change();
    },

    $: function $(selector, container) {
      if (container) {
        return _$(selector, container);
      } else {
        return this.testContext.$(selector);
      }
    },

    triggerEvent: function triggerEvent(selector, container, eventName, eventOptions) {
      var event = _$.Event(eventName, eventOptions);

      if (container) {
        _$(selector, container).trigger(event);
      } else {
        this.testContext.$(selector).trigger(event);
      }
    },

    assertElementExists: function assertElementExists(selector, options) {
      var result = undefined;
      var container = options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      if (container) {
        result = _$(selector, container);
      } else {
        result = this.testContext.$(selector);
      }

      if (result.length === 0) {
        (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _emberCliPageObjectPrivateBetterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }
    },

    find: function find(selector, options) {
      var result = undefined;
      var container = options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      selector = (0, _emberCliPageObjectPrivateHelpers.buildSelector)(this.pageObjectNode, selector, options);

      if (container) {
        result = _$(selector, container);
      } else {
        result = this.testContext.$(selector);
      }

      (0, _emberCliPageObjectPrivateHelpers.guardMultiple)(result, selector, options.multiple);

      return result;
    },

    findWithAssert: function findWithAssert(selector, options) {
      var result = undefined;
      var container = options.testContainer || (0, _emberCliPageObjectPrivateHelpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      selector = (0, _emberCliPageObjectPrivateHelpers.buildSelector)(this.pageObjectNode, selector, options);

      if (container) {
        result = _$(selector, container);
      } else {
        result = this.testContext.$(selector);
      }

      (0, _emberCliPageObjectPrivateHelpers.guardMultiple)(result, selector, options.multiple);

      if (result.length === 0) {
        (0, _emberCliPageObjectPrivateBetterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _emberCliPageObjectPrivateBetterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }

      return result;
    }
  };
});