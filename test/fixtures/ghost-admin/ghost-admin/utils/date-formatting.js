define('ghost-admin/utils/date-formatting', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.formatDate = undefined;


    var displayDateFormat = 'DD MMM YY @ HH:mm';

    // Add missing timestamps
    function verifyTimeStamp(dateString) {
        if (dateString && !dateString.slice(-5).match(/\d+:\d\d/)) {
            dateString += ' 12:00';
        }
        return dateString;
    }

    // Formats a Date or Moment
    function formatDate(value, timezone) {
        // we output the date adjusted to the blog timezone selected in settings
        return verifyTimeStamp(value ? (0, _moment.default)(value).tz(timezone).format(displayDateFormat) : '');
    }

    exports.formatDate = formatDate;
});