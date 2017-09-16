"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onSuccess_1 = require("./onSuccess");
const onError_1 = require("./onError");
const findCourseDetail_1 = require("../queries/findCourseDetail");
const _ = require("lodash");
function apiGetCourseDetail(req, res) {
    const courseId = parseInt(req.params.id);
    findCourseDetail_1.findCourseDetail(courseId)
        .then(_.partial(onSuccess_1.onSuccess, res))
        .catch(_.partial(onError_1.onError, res, `Could not find course detail for id ${courseId}`));
}
exports.apiGetCourseDetail = apiGetCourseDetail;
