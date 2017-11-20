define('ember-cli-page-object/-private/properties/click-on-text/helpers', ['exports', 'ember-cli-page-object/-private/helpers'], function (exports, _emberCliPageObjectPrivateHelpers) {
  exports.buildSelector = buildSelector;

  function childSelector(pageObjectNode, context, selector, options) {
    // Suppose that we have something like `<form><button>Submit</button></form>`
    // In this case <form> and <button> elements contains "Submit" text, so, we'll
    // want to __always__ click on the __last__ element that contains the text.
    var selectorWithSpace = (selector || '') + ' ';
    var opts = (0, _emberCliPageObjectPrivateHelpers.assign)({ last: true, multiple: true }, options);

    if (context.find(selectorWithSpace, opts).length) {
      return (0, _emberCliPageObjectPrivateHelpers.buildSelector)(pageObjectNode, selectorWithSpace, opts);
    }
  }

  function buildSelector(pageObjectNode, context, selector, options) {
    var childSel = childSelector(pageObjectNode, context, selector, options);

    if (childSel) {
      return childSel;
    } else {
      return (0, _emberCliPageObjectPrivateHelpers.buildSelector)(pageObjectNode, selector, options);
    }
  }
});