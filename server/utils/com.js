"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hri = require('human-readable-ids').hri;
function onSuccess(res, data) {
    if (data)
        res.status(200).json({ data: data });
}
exports.onSuccess = onSuccess;
function onError(res, message, err) {
    console.error("Promise chain error ", message, err);
    res.status(500).send();
}
exports.onError = onError;
function databaseErrorHandler(res, err) {
    const id = hri.random();
    console.error("Database error occurred ", id, err);
    res.status(500).json({ code: 'ERR-002',
        message: `Error occurred error code ${id}` });
}
exports.databaseErrorHandler = databaseErrorHandler;
