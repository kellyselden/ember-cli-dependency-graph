define('ember-cli-page-object/extend', ['exports', 'ember-cli-page-object/-private/extend/find-element', 'ember-cli-page-object/-private/extend/find-element-with-assert', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context'], function (exports, _emberCliPageObjectPrivateExtendFindElement, _emberCliPageObjectPrivateExtendFindElementWithAssert, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_context) {
  Object.defineProperty(exports, 'findElement', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivateExtendFindElement.findElement;
    }
  });
  Object.defineProperty(exports, 'findElementWithAssert', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivateExtendFindElementWithAssert.findElementWithAssert;
    }
  });
  Object.defineProperty(exports, 'buildSelector', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivateHelpers.buildSelector;
    }
  });
  Object.defineProperty(exports, 'getContext', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivateHelpers.getContext;
    }
  });
  Object.defineProperty(exports, 'fullScope', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivateHelpers.fullScope;
    }
  });
  Object.defineProperty(exports, 'registerExecutionContext', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivateExecution_context.register;
    }
  });
});