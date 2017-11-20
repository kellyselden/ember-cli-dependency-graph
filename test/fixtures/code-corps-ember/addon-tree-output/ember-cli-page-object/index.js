define('ember-cli-page-object/index', ['exports', 'ember-cli-page-object/-private/create', 'ember-cli-page-object/-private/properties/attribute', 'ember-cli-page-object/-private/properties/click-on-text', 'ember-cli-page-object/-private/properties/clickable', 'ember-cli-page-object/-private/properties/collection', 'ember-cli-page-object/-private/properties/contains', 'ember-cli-page-object/-private/properties/count', 'ember-cli-page-object/-private/properties/fillable', 'ember-cli-page-object/-private/properties/has-class', 'ember-cli-page-object/-private/properties/is', 'ember-cli-page-object/-private/properties/is-hidden', 'ember-cli-page-object/-private/properties/is-present', 'ember-cli-page-object/-private/properties/is-visible', 'ember-cli-page-object/-private/properties/not-has-class', 'ember-cli-page-object/-private/properties/property', 'ember-cli-page-object/-private/properties/text', 'ember-cli-page-object/-private/properties/triggerable', 'ember-cli-page-object/-private/properties/value', 'ember-cli-page-object/-private/properties/visitable', 'ember-cli-page-object/-private/extend/find-element', 'ember-cli-page-object/-private/extend/find-element-with-assert', 'ember-cli-page-object/-private/helpers'], function (exports, _emberCliPageObjectPrivateCreate, _emberCliPageObjectPrivatePropertiesAttribute, _emberCliPageObjectPrivatePropertiesClickOnText, _emberCliPageObjectPrivatePropertiesClickable, _emberCliPageObjectPrivatePropertiesCollection, _emberCliPageObjectPrivatePropertiesContains, _emberCliPageObjectPrivatePropertiesCount, _emberCliPageObjectPrivatePropertiesFillable, _emberCliPageObjectPrivatePropertiesHasClass, _emberCliPageObjectPrivatePropertiesIs, _emberCliPageObjectPrivatePropertiesIsHidden, _emberCliPageObjectPrivatePropertiesIsPresent, _emberCliPageObjectPrivatePropertiesIsVisible, _emberCliPageObjectPrivatePropertiesNotHasClass, _emberCliPageObjectPrivatePropertiesProperty, _emberCliPageObjectPrivatePropertiesText, _emberCliPageObjectPrivatePropertiesTriggerable, _emberCliPageObjectPrivatePropertiesValue, _emberCliPageObjectPrivatePropertiesVisitable, _emberCliPageObjectPrivateExtendFindElement, _emberCliPageObjectPrivateExtendFindElementWithAssert, _emberCliPageObjectPrivateHelpers) {
  exports.create = _emberCliPageObjectPrivateCreate.create;
  exports.attribute = _emberCliPageObjectPrivatePropertiesAttribute.attribute;
  exports.clickOnText = _emberCliPageObjectPrivatePropertiesClickOnText.clickOnText;
  exports.clickable = _emberCliPageObjectPrivatePropertiesClickable.clickable;
  exports.collection = _emberCliPageObjectPrivatePropertiesCollection.collection;
  exports.contains = _emberCliPageObjectPrivatePropertiesContains.contains;
  exports.count = _emberCliPageObjectPrivatePropertiesCount.count;
  exports.fillable = _emberCliPageObjectPrivatePropertiesFillable.fillable;
  var selectable = _emberCliPageObjectPrivatePropertiesFillable.fillable;
  exports.selectable = selectable;
  exports.hasClass = _emberCliPageObjectPrivatePropertiesHasClass.hasClass;
  exports.is = _emberCliPageObjectPrivatePropertiesIs.is;
  exports.isHidden = _emberCliPageObjectPrivatePropertiesIsHidden.isHidden;
  exports.isPresent = _emberCliPageObjectPrivatePropertiesIsPresent.isPresent;
  exports.isVisible = _emberCliPageObjectPrivatePropertiesIsVisible.isVisible;
  exports.notHasClass = _emberCliPageObjectPrivatePropertiesNotHasClass.notHasClass;
  exports.property = _emberCliPageObjectPrivatePropertiesProperty.property;
  exports.text = _emberCliPageObjectPrivatePropertiesText.text;
  exports.triggerable = _emberCliPageObjectPrivatePropertiesTriggerable.triggerable;
  exports.value = _emberCliPageObjectPrivatePropertiesValue.value;
  exports.visitable = _emberCliPageObjectPrivatePropertiesVisitable.visitable;
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
  exports['default'] = {
    attribute: _emberCliPageObjectPrivatePropertiesAttribute.attribute,
    clickOnText: _emberCliPageObjectPrivatePropertiesClickOnText.clickOnText,
    clickable: _emberCliPageObjectPrivatePropertiesClickable.clickable,
    collection: _emberCliPageObjectPrivatePropertiesCollection.collection,
    contains: _emberCliPageObjectPrivatePropertiesContains.contains,
    count: _emberCliPageObjectPrivatePropertiesCount.count,
    create: _emberCliPageObjectPrivateCreate.create,
    fillable: _emberCliPageObjectPrivatePropertiesFillable.fillable,
    hasClass: _emberCliPageObjectPrivatePropertiesHasClass.hasClass,
    is: _emberCliPageObjectPrivatePropertiesIs.is,
    isHidden: _emberCliPageObjectPrivatePropertiesIsHidden.isHidden,
    isPresent: _emberCliPageObjectPrivatePropertiesIsPresent.isPresent,
    isVisible: _emberCliPageObjectPrivatePropertiesIsVisible.isVisible,
    notHasClass: _emberCliPageObjectPrivatePropertiesNotHasClass.notHasClass,
    property: _emberCliPageObjectPrivatePropertiesProperty.property,
    selectable: selectable,
    text: _emberCliPageObjectPrivatePropertiesText.text,
    value: _emberCliPageObjectPrivatePropertiesValue.value,
    visitable: _emberCliPageObjectPrivatePropertiesVisitable.visitable,
    triggerable: _emberCliPageObjectPrivatePropertiesTriggerable.triggerable
  };
});