"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const apicache = require("apicache");
let cache = apicache.middleware;
let all_market = {
    timestamp: 0,
    payload: '[]'
};
function initShapeSift(app) {
    app.route("/api/exchange/shapeshift/all-market").get(function (req, res) {
        res.json(all_market);
    });
    app.route("/api/exchange/shapeshift/getcoins").get(function (req, res) {
        request.get('https://shapeshift.io/getcoins', function (err, r, body) {
            res.end(body);
        });
    });
    app.route("/api/exchange/shapeshift/rate/:from_to").get(function (req, res) {
        request.get('https://shapeshift.io/rate/' + req.params.from_to, function (err, r, body) {
            res.end(body);
        });
    });
    app.get("/api/exchange/shapeshift/marketinfo/:from_to/", cache('1 hour'), function (req, res) {
        request.get('https://shapeshift.io/marketinfo/' + req.params.from_to, function (err, r, body) {
            res.end(body);
        });
    });
    app.route("/api/exchange-1/shift").post(function (req, res) {
        var options = {
            uri: 'https://shapeshift.io/shift/',
            method: 'POST',
            json: req.body
        };
        request(options, function (err, response, body) {
            if (err) {
                res.json({ error: err });
            }
            else {
                res.end(body);
            }
        });
    });
    app.route("/api/exchange/shapeshift/validateAddress/:address/:coin").get(function (req, res) {
        request.get('https://shapeshift.io/validateAddress/' + req.params.address + '/' + req.params.coin, function (err, r, body) {
            res.end(body);
        });
    });
    return [];
}
exports.initShapeSift = initShapeSift;
