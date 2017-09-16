"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initCryptopia(app) {
    APIs.forEach(function (item) {
        if (item.cache) {
            app.get(item.api, cache(item.cache), function (req, resp) {
                let values = _.values(req.params);
                let url = item.url + (values.length ? '/' + values.join('/') : '');
                console.log(url);
                let options = {
                    url: url
                };
                request(options).pipe(resp);
            });
        }
        else {
            app.route(item.api).get(function (req, resp) {
                let values = _.values(req.params);
                let url = item.url + values.length ? '/' + values.join('/') : '';
                console.log(url);
                let options = {
                    url: url
                };
                request(options).pipe(resp);
            });
        }
    });
    return APIs;
}
exports.initCryptopia = initCryptopia;
const APIs = [
    {
        api: '/api/cryptopia/currencies',
        url: 'https://www.cryptopia.co.nz/api/GetCurrencies',
        name: 'currencies',
        cache: '1 day'
    },
    {
        api: '/api/cryptopia/pairs',
        url: 'https://www.cryptopia.co.nz/api/GetTradePairs',
        name: 'pairs',
        cache: '1 day'
    },
    {
        api: '/api/cryptopia/markets',
        url: 'https://www.cryptopia.co.nz/api/GetMarkets',
        name: 'markets',
        cache: '1 day'
    }
];
