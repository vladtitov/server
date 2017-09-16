"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initCoinbase(app) {
    APIs.forEach(function (item) {
        app.get(item.api, cache(item.cache), function (req, resp) {
            let values = _.values(req.params);
            let tail = values.length ? values.join('') : '';
            let url = item.url + tail;
            console.log(url);
            let options = {
                url: url
            };
            request(options).pipe(resp);
        });
    });
    return APIs;
}
exports.initCoinbase = initCoinbase;
const APIs = [
    {
        name: 'exchange-rates',
        api: '/api/coinbase/exchange-rates/:id',
        url: 'https://api.coinbase.com/v2/exchange-rates?currency=',
        cache: '1 hour'
    },
    {
        name: 'currencies',
        api: '/api/coinbase/currencies',
        url: 'https://api.coinbase.com/v2/currencies',
        cache: '1 hour'
    }
];
