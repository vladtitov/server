"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model/model");
const hri = require('human-readable-ids').hri;
function updateLesson(id, props) {
    return model_1.LessonModel.update(props, {
        where: { id }
    });
}
exports.updateLesson = updateLesson;
