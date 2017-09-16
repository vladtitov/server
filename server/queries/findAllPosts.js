"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model/model");
function findAllPosts() {
    return model_1.PostModel.findAll({})
        .then((res) => res.map(function (item) {
        return { id: item.id, description: item.description };
    }));
}
exports.findAllPosts = findAllPosts;
