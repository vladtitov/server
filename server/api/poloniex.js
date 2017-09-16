"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initPoloniex(app) {
    let apis = _.keyBy(APIS, 'name');
    APIS.forEach(function (item) {
        if (item.cache) {
            app.get(item.api, cache(item.cache), function (req, resp) {
                request(item.url, function (err, respond, body) {
                    if (err) {
                        resp.json({ error: err });
                    }
                    else {
                        resp.end(body);
                    }
                });
            });
        }
        else {
            app.route(item.api).get(function (req, resp) {
                request(item.url, function (err, respond, body) {
                    if (err) {
                        resp.json({ error: err });
                    }
                    else {
                        resp.end(body);
                    }
                });
            });
        }
    });
    return APIS;
}
exports.initPoloniex = initPoloniex;
const APIS = [
    {
        name: 'returnTicker',
        api: '/api/poloniex/returnTicker',
        cache: '1 hour',
        url: 'https://poloniex.com/public?command=returnTicker'
    }
];
