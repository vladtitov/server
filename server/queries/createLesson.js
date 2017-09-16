"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model/model");
function createLesson(props) {
    return model_1.LessonModel.create(props);
}
exports.createLesson = createLesson;
