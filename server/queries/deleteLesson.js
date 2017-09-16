"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model/model");
function deleteLesson(id) {
    return model_1.LessonModel.destroy({
        where: { id }
    });
}
exports.deleteLesson = deleteLesson;
