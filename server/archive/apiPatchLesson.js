"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const updateLesson_1 = require("../queries/updateLesson");
const com_1 = require("../utils/com");
const com_2 = require("../utils/com");
const com_3 = require("../utils/com");
function apiPatchLesson(req, res) {
    const lessonId = req.params.id;
    updateLesson_1.updateLesson(lessonId, req.body)
        .then(_.partial(com_1.onSuccess, res))
        .catch(_.partial(com_3.databaseErrorHandler, res))
        .catch(_.partial(com_2.onError, res, "Could not update lesson"));
}
exports.apiPatchLesson = apiPatchLesson;
