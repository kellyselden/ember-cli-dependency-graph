define('ember-cli-page-object/-private/execution_context', ['exports', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/execution_context/acceptance', 'ember-cli-page-object/-private/execution_context/integration'], function (exports, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateExecution_contextAcceptance, _emberCliPageObjectPrivateExecution_contextIntegration) {
  exports.getExecutionContext = getExecutionContext;
  exports.register = register;

  var executioncontexts = {
    acceptance: _emberCliPageObjectPrivateExecution_contextAcceptance['default'],
    integration: _emberCliPageObjectPrivateExecution_contextIntegration['default']
  };

  /*
   * @private
   */

  function getExecutionContext(pageObjectNode) {
    var testContext = (0, _emberCliPageObjectPrivateHelpers.getContext)(pageObjectNode);
    var context = testContext ? 'integration' : 'acceptance';

    return new executioncontexts[context](pageObjectNode, testContext);
  }

  /*
   * @private
   */

  function register(type, definition) {
    executioncontexts[type] = definition;
  }
});