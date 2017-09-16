"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const com_1 = require("../utils/com");
const com_2 = require("../utils/com");
const model_1 = require("../model/model");
function apiGetAllPosts(req, res) {
    let userId = req.decoded.userId;
    console.log('userId  ' + userId);
    model_1.PostModel.findAll({
        where: { userId: userId }
    })
        .then((res) => {
        return res.map(function ({ id, description }) {
            return { id, description };
        });
    })
        .then(_.partial(com_2.onSuccess, res))
        .catch(_.partial(com_1.onError, res, "Find All Posts Failed"));
}
exports.apiGetAllPosts = apiGetAllPosts;
