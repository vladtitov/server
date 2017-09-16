"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model/model");
const course_summary_1 = require("../../shared/model/course-summary");
function findAllCourses() {
    return model_1.CourseModel.findAll({
        order: ['seqNo']
    })
        .then(course_summary_1.createCourseSummaries);
}
exports.findAllCourses = findAllCourses;
