define("ember-percy/mockjax-wrapper", ["exports"], function (exports) {
  exports.maybeDisableMockjax = maybeDisableMockjax;
  exports.maybeResetMockjax = maybeResetMockjax;
  // jQuery Mockjax-specific handling to workaround blocking of HTTP requests if users have
  // set the throwUnmocked setting. This is very unfortunately necessary since mockjax does not
  // provide a way to configure passthrough for specific endpoints.

  function maybeDisableMockjax() {
    if (window.jQuery && window.jQuery.mockjaxSettings && window.jQuery.mockjaxSettings.throwUnmocked) {
      window.jQuery.mockjaxSettings._originalThrowUnmocked = window.jQuery.mockjaxSettings.throwUnmocked;
      window.jQuery.mockjaxSettings.throwUnmocked = false;
    }
  }

  function maybeResetMockjax() {
    if (window.jQuery && window.jQuery.mockjaxSettings && window.jQuery.mockjaxSettings._originalThrowUnmocked) {
      window.jQuery.mockjaxSettings.throwUnmocked = window.jQuery.mockjaxSettings._originalThrowUnmocked;
      delete window.jQuery.mockjaxSettings._originalThrowUnmocked;
    }
  }
});