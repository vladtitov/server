"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const createLesson_1 = require("../queries/createLesson");
const onError_1 = require("./onError");
const onSuccess_1 = require("./onSuccess");
const databaseErrorHandler_1 = require("./databaseErrorHandler");
function apiCreateLesson(req, res) {
    createLesson_1.createLesson(req.body)
        .then(_.partial(onSuccess_1.onSuccess, res))
        .catch(_.partial(databaseErrorHandler_1.databaseErrorHandler, res))
        .catch(_.partial(onError_1.onError, res, `Could not create lesson`));
}
exports.apiCreateLesson = apiCreateLesson;
