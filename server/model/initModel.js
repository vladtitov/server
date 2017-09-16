"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ORM = require("Sequelize");
function initPostModel(sequelize) {
    return sequelize.define("post", {
        userId: ORM.INTEGER,
        description: ORM.TEXT
    });
}
exports.initPostModel = initPostModel;
