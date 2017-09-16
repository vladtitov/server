"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const apicache = require("apicache");
let cache = apicache.middleware;
function initHitBTC(app) {
    APIs.forEach(function (item) {
        app.get(item.api, cache(item.cache), function (req, resp) {
            let options = {
                url: item.url
            };
            request(options).pipe(resp);
        });
    });
    return APIs;
}
exports.initHitBTC = initHitBTC;
const APIs = [
    {
        api: '/api/hit-btc/all',
        url: 'https://api.hitbtc.com//api/1/public/symbols',
        name: 'market',
        cache: '1 hour'
    }
];
