"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const findAllCourses_1 = require("../queries/findAllCourses");
const onError_1 = require("./onError");
const onSuccess_1 = require("./onSuccess");
function apiGetAllCourses(req, res) {
    findAllCourses_1.findAllCourses()
        .then(_.partial(onSuccess_1.onSuccess, res))
        .catch(_.partial(onError_1.onError, res, "Find All Courses Failed"));
}
exports.apiGetAllCourses = apiGetAllCourses;
