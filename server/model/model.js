"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ORM = require("sequelize");
const path = require("path");
let file = path.join(__dirname, '../data/posts.sqlite');
console.log(file);
const options = {
    benchmark: true,
    logging: console.log,
    dialect: "mysql",
    host: "front-desk.ca"
};
const sequelize = new ORM('frontdes_callcenter', 'frontdes', 'Xzsawq2!', options);
function initUserModel(sequelize) {
    return sequelize.define("registration", {
        status: ORM.STRING,
        nickname: ORM.STRING,
        confirmed: ORM.BOOLEAN,
        lastVisit: ORM.DATE,
        email: ORM.STRING,
        password: ORM.TEXT,
        role: ORM.INTEGER,
        createdAt: ORM.DATE,
        updatedAt: ORM.DATE,
        uid: ORM.STRING
    });
}
function initUserModelLite(sequelize) {
    return sequelize.define("registration", {
        uid: ORM.TEXT,
        email: ORM.TEXT,
        password: ORM.TEXT,
        role: ORM.INTEGER,
        status: ORM.TEXT,
        createdAt: ORM.INTEGER,
        updatedAt: ORM.INTEGER,
        confirmed: ORM.INTEGER,
        lastVisit: ORM.INTEGER,
        nickname: ORM.TEXT
    });
}
exports.UserModel = initUserModel(sequelize);
