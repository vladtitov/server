"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initCoinExchange(app) {
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
exports.initCoinExchange = initCoinExchange;
const APIs = [
    {
        name: 'market-names',
        api: '/api/coinexchange/market-names',
        url: 'https://www.coinexchange.io/api/v1/getmarkets',
        cache: '1 hour'
    },
    {
        name: 'market-details',
        api: '/api/coinexchange/market-details',
        url: 'https://www.coinexchange.io/api/v1/getmarketsummaries',
        cache: '1 hour'
    }
];
