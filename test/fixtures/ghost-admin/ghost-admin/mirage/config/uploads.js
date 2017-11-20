define('ghost-admin/mirage/config/uploads', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockUploads;

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var fileUploadResponse = function fileUploadResponse(db, _ref) {
        var requestBody = _ref.requestBody;

        var _requestBody$getAll = requestBody.getAll('uploadimage'),
            _requestBody$getAll2 = _slicedToArray(_requestBody$getAll, 1),
            file = _requestBody$getAll2[0];

        var now = new Date();
        var year = now.getFullYear();
        var month = '' + now.getMonth();

        if (month.length === 1) {
            month = '0' + month;
        }

        return '"/content/images/' + year + '/' + month + '/' + file.name + '"';
    };

    function mockUploads(server) {
        server.post('/uploads/', fileUploadResponse, 200, { timing: 100 });
        server.post('/uploads/icon/', fileUploadResponse, 200, { timing: 100 });
    }
});