define('ghost-admin/mirage/utils', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.paginatedResponse = paginatedResponse;
    exports.paginateModelArray = paginateModelArray;
    exports.maintenanceResponse = maintenanceResponse;
    exports.versionMismatchResponse = versionMismatchResponse;

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    function paginatedResponse(modelName) {
        return function (schema, request) {
            var page = +request.queryParams.page || 1;
            var limit = +request.queryParams.limit || 15;
            var allModels = this.serialize(schema[modelName].all())[modelName];

            return paginateModelArray(modelName, allModels, page, limit);
        };
    }

    function paginateModelArray(modelName, allModels, page, limit) {
        var pages = void 0,
            next = void 0,
            prev = void 0,
            models = void 0;

        if (limit === 'all') {
            pages = 1;
        } else {
            limit = +limit;

            var start = (page - 1) * limit;
            var end = start + limit;

            pages = Math.ceil(allModels.length / limit);
            models = allModels.slice(start, end);

            if (start > 0) {
                prev = page - 1;
            }

            if (end < allModels.length) {
                next = page + 1;
            }
        }

        return _defineProperty({
            meta: {
                pagination: {
                    page: page,
                    limit: limit,
                    pages: pages,
                    total: allModels.length,
                    next: next || null,
                    prev: prev || null
                }
            }
        }, modelName, models || allModels);
    }

    function maintenanceResponse() {
        return new _emberCliMirage.Response(503, {}, {
            errors: [{
                errorType: 'Maintenance'
            }]
        });
    }

    function versionMismatchResponse() {
        return new _emberCliMirage.Response(400, {}, {
            errors: [{
                errorType: 'VersionMismatchError'
            }]
        });
    }
});