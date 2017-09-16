"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function apiGetMenu(req, respond) {
    fs.readFile('server/pub/menu.json', function (err, data) {
        if (err)
            respond.send(err);
        else
            respond.send(data);
    });
}
exports.apiGetMenu = apiGetMenu;
