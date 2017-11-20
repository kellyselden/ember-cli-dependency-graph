define("torii/lib/popup-id-serializer", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var PopupIdSerializer = {
    serialize: function serialize(popupId) {
      return "torii-popup:" + popupId;
    },

    deserialize: function deserialize(serializedPopupId) {
      if (!serializedPopupId) {
        return null;
      }

      var match = serializedPopupId.match(/^(torii-popup:)(.*)/);
      return match ? match[2] : null;
    }
  };

  exports.default = PopupIdSerializer;
});