"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const qs = require('qs');
const apicache = require("apicache");
let cache = apicache.middleware;
function initKraken(app) {
    APIs.forEach(function (item) {
        app.get(item.api, cache(item.cache), function (req, resp) {
            let body = req.params;
            let url = item.url;
            console.log(url);
            let options = {
                url: url,
                method: 'POST',
                body: qs.stringify(body),
                headers: {
                    'User-Agent': 'request'
                }
            };
            request(options).pipe(resp);
        });
    });
    return APIs;
}
exports.initKraken = initKraken;
const APIs = [
    {
        api: '/api/kraken/currencies',
        url: 'https://api.kraken.com/0/public/Assets',
        name: 'currencies',
        cache: '1 hour'
    },
    {
        api: '/api/kraken/markets',
        url: 'https://api.kraken.com/0/public/AssetPairs',
        name: 'markets',
        cache: '1 hour'
    },
    {
        api: '/api/kraken/market/:pair',
        url: 'https://api.kraken.com/0/public/Ticker',
        method: 'POST',
        name: 'markets',
        cache: '1 hour'
    }
];
