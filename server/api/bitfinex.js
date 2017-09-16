"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const qs = require('qs');
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initBitFinrx(app) {
    APIs.forEach(function (item) {
        app.get(item.api, cache(item.cache), function (req, resp) {
            let values = _.values(req.params);
            let url = item.url + (values.length ? '/' + values.join('/') : '');
            console.log(url);
            let options = {
                url: url,
                headers: {
                    'User-Agent': 'request'
                }
            };
            request(options).pipe(resp);
        });
    });
    return APIs;
}
exports.initBitFinrx = initBitFinrx;
const APIs = [
    {
        api: '/api/bitfinex/symbols',
        url: 'https://api.bitfinex.com/v1/symbols',
        name: 'currencies',
        cache: '1 hour'
    },
    {
        api: '/api/bitfinex/market/:pair',
        url: 'https://api.bitfinex.com/v1/pubticker/',
        name: 'markets',
        cache: '1 hour'
    }
];
