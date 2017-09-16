"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onError_1 = require("./onError");
const onSuccess_1 = require("./onSuccess");
const _ = require("lodash");
const deleteLesson_1 = require("../queries/deleteLesson");
function apiDeleteLesson(req, res) {
    const lessonId = req.params.id;
    deleteLesson_1.deleteLesson(lessonId)
        .then(_.partial(onSuccess_1.onSuccess, res))
        .catch(_.partial(onError_1.onError, res, `Could not delete lesson ${lessonId}`));
}
exports.apiDeleteLesson = apiDeleteLesson;
