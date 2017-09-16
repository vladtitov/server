"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const crypto = require("crypto");
const apicache = require("apicache");
let cache = apicache.middleware;
const qs = require('qs');
function initBittrex(app) {
    let hash_hmac = function (text, apisecret) {
        return crypto
            .createHmac('sha512', apisecret)
            .update(text)
            .digest('hex');
    };
    APIs.forEach(function (item) {
        app.get(item.api, cache(item.cache), function (req, resp) {
            console.log(req.params);
            let params = qs.stringify(req.params);
            console.log(params);
            let url = item.url + params;
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
    app.post("/api/bittrex/private", cache('1 hour'), function (req, resp) {
        let url = req.body.uri;
        let signed = req.body.signed;
        var options = {
            url: url,
            headers: {
                'User-Agent': 'request',
                'apisign': signed
            }
        };
        request(options).pipe(resp);
    });
    return APIs;
}
exports.initBittrex = initBittrex;
const APIs = [
    {
        api: '/api/bittrex/markets',
        url: 'https://bittrex.com/api/v1.1/public/getmarkets',
        name: 'markets',
        cache: '1 hour'
    },
    {
        api: '/api/bittrex/marketsummaries',
        url: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
        name: 'recent trades ',
        cache: '1 hour'
    },
    {
        api: '/api/bittrex/currencies',
        url: 'https://bittrex.com/api/v1.1/public/getcurrencies',
        name: 'markets',
        cache: '1 hour'
    },
    {
        api: '/api/bittrex/market/:market',
        url: 'https://bittrex.com/api/v1.1/public/getmarketsummary?',
        name: 'recent trades ',
        cache: '10 minutes'
    },
    {
        api: '/api/bittrex/getmarkethistory/:market',
        url: 'https://bittrex.com/api/v1.1/public/getmarkethistory?',
        name: 'recent trades ',
        cache: '10 minutes'
    },
    {
        api: '/api/bittrex/getorderbook/:market/:depth',
        url: 'https://bittrex.com/api/v1.1/public/getorderbook?market={{market}}&type=both&depth={{depth}}',
        name: 'recent trades ',
        cache: '10 minutes'
    }
];
