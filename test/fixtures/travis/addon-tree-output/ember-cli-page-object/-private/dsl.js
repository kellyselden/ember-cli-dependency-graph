define('ember-cli-page-object/-private/dsl', ['exports', 'ember-cli-page-object/-private/properties/text', 'ember-cli-page-object/-private/properties/is-visible', 'ember-cli-page-object/-private/properties/is-hidden', 'ember-cli-page-object/-private/properties/contains', 'ember-cli-page-object/-private/properties/click-on-text', 'ember-cli-page-object/-private/properties/clickable', 'ember-cli-page-object/-private/properties/fillable', 'ember-cli-page-object/-private/properties/value', 'ember-cli-page-object/-private/properties/as'], function (exports, _emberCliPageObjectPrivatePropertiesText, _emberCliPageObjectPrivatePropertiesIsVisible, _emberCliPageObjectPrivatePropertiesIsHidden, _emberCliPageObjectPrivatePropertiesContains, _emberCliPageObjectPrivatePropertiesClickOnText, _emberCliPageObjectPrivatePropertiesClickable, _emberCliPageObjectPrivatePropertiesFillable, _emberCliPageObjectPrivatePropertiesValue, _emberCliPageObjectPrivatePropertiesAs) {

  var thenDescriptor = {
    isDescriptor: true,
    value: function value() {
      var _wait;

      /* global wait */
      return (_wait = wait()).then.apply(_wait, arguments);
    }
  };

  var dsl = {
    contains: (0, _emberCliPageObjectPrivatePropertiesContains.contains)(),
    isHidden: (0, _emberCliPageObjectPrivatePropertiesIsHidden.isHidden)(),
    isVisible: (0, _emberCliPageObjectPrivatePropertiesIsVisible.isVisible)(),
    text: (0, _emberCliPageObjectPrivatePropertiesText.text)(),
    value: (0, _emberCliPageObjectPrivatePropertiesValue.value)(),
    clickOn: (0, _emberCliPageObjectPrivatePropertiesClickOnText.clickOnText)(),
    click: (0, _emberCliPageObjectPrivatePropertiesClickable.clickable)(),
    fillIn: (0, _emberCliPageObjectPrivatePropertiesFillable.fillable)(),
    select: (0, _emberCliPageObjectPrivatePropertiesFillable.fillable)(),
    then: thenDescriptor,
    as: _emberCliPageObjectPrivatePropertiesAs.as
  };

  exports['default'] = dsl;
});