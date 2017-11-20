define('ember-cli-page-object/-private/context', ['exports'], function (exports) {
  exports.render = render;
  exports.setContext = setContext;
  exports.removeContext = removeContext;
  /**
   * @public
   *
   * Render a component's template in the context of a test.
   *
   * Throws an error if a test's context has not been set on the page.
   *
   * Returns the page object, which allows for method chaining.
   *
   * @example
   *
   * page.setContext(this)
   *   .render(hbs`{{my-component}}`)
   *   .clickOnText('Hi!');
   *
   * @param {Object} template - A compiled component template
   * @return {PageObject} - the page object
   */

  function render(template) {
    if (!this.context) {
      var message = 'You must set a context on the page object before calling calling `render()`';
      var error = new Error(message);

      throw error;
    }

    this.context.render(template);

    return this;
  }

  /**
   * @public
   *
   * Sets the page's test context.
   *
   * Returns the page object, which allows for method chaining.
   *
   * @example
   *
   * page.setContext(this)
   *   .render(hbs`{{my-component}}`)
   *   .clickOnText('Hi!');
   *
   * @param {Object} context - A component integration test's `this` context
   * @return {PageObject} - the page object
   */

  function setContext(context) {
    if (context) {
      this.context = context;
    }

    return this;
  }

  /**
   * @public
   *
   * Unsets the page's test context.
   *
   * Useful in a component test's `afterEach()` hook, to make sure the context has been cleared after each test.
   *
   * @example
   *
   * page.removeContext();
   *
   * @return {PageObject} - the page object
   */

  function removeContext() {
    if (this.context) {
      delete this.context;
    }

    return this;
  }
});