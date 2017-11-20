define('ember-cli-page-object/-private/dsl', ['exports', 'ember-cli-page-object/-private/properties/as', 'ember-cli-page-object/-private/properties/clickable', 'ember-cli-page-object/-private/properties/click-on-text', 'ember-cli-page-object/-private/properties/contains', 'ember-cli-page-object/-private/properties/fillable', 'ember-cli-page-object/-private/properties/is-hidden', 'ember-cli-page-object/-private/properties/is-present', 'ember-cli-page-object/-private/properties/is-visible', 'ember-cli-page-object/-private/properties/text', 'ember-cli-page-object/-private/properties/value', 'ember-test-helpers/wait'], function (exports, _emberCliPageObjectPrivatePropertiesAs, _emberCliPageObjectPrivatePropertiesClickable, _emberCliPageObjectPrivatePropertiesClickOnText, _emberCliPageObjectPrivatePropertiesContains, _emberCliPageObjectPrivatePropertiesFillable, _emberCliPageObjectPrivatePropertiesIsHidden, _emberCliPageObjectPrivatePropertiesIsPresent, _emberCliPageObjectPrivatePropertiesIsVisible, _emberCliPageObjectPrivatePropertiesText, _emberCliPageObjectPrivatePropertiesValue, _emberTestHelpersWait) {

  var thenDescriptor = {
    isDescriptor: true,
    value: function value() {
      var _ref;

      return (_ref = (window.wait || _emberTestHelpersWait['default'])()).then.apply(_ref, arguments);
    }
  };

  var dsl = {
    as: _emberCliPageObjectPrivatePropertiesAs.as,
    click: (0, _emberCliPageObjectPrivatePropertiesClickable.clickable)(),
    clickOn: (0, _emberCliPageObjectPrivatePropertiesClickOnText.clickOnText)(),
    contains: (0, _emberCliPageObjectPrivatePropertiesContains.contains)(),
    fillIn: (0, _emberCliPageObjectPrivatePropertiesFillable.fillable)(),
    isHidden: (0, _emberCliPageObjectPrivatePropertiesIsHidden.isHidden)(),
    isPresent: (0, _emberCliPageObjectPrivatePropertiesIsPresent.isPresent)(),
    isVisible: (0, _emberCliPageObjectPrivatePropertiesIsVisible.isVisible)(),
    select: (0, _emberCliPageObjectPrivatePropertiesFillable.fillable)(),
    text: (0, _emberCliPageObjectPrivatePropertiesText.text)(),
    then: thenDescriptor,
    value: (0, _emberCliPageObjectPrivatePropertiesValue.value)()
  };

  exports['default'] = dsl;
});