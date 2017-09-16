"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestOrig = require("request");
const fs = require("fs");
const path = require("path");
let request = requestOrig;
const apicache = require("apicache");
let cache = apicache.middleware;
let all_market = {
    timestamp: 0,
    payload: '[]'
};
function coinMarketCap(app) {
    app.get("/api/marketcap/all-coins", cache('1 day'), function (req, resp) {
        fs.readFile(path.join(__dirname, '../data/coins.json'), function (err, dataStr) {
            if (err) {
                resp.json({ error: 'cant read data' });
                return;
            }
            let data = JSON.parse(String(dataStr));
            resp.json({ payload: data });
        });
    });
    app.get("/api/marketcap/all-exchanges", cache('1 day'), function (req, resp) {
        fs.readFile(path.join(__dirname, '../data/exchanges.json'), function (err, dataStr) {
            if (err) {
                resp.json({ error: 'cant read data' });
                return;
            }
            let data = JSON.parse(String(dataStr));
            resp.json({ data: data });
        });
    });
    app.get("/api/marketcap/ticker", cache('5 minutes'), function (req, resp) {
        let url = 'https://api.coinmarketcap.com/v1/ticker/';
        let all_market = {};
        console.log(url);
        request.get(url, function (err, r, body) {
            if (err) {
                console.error(' error from  ' + url, err);
            }
            else {
                all_market.timestamp = (new Date()).toISOString();
                try {
                    all_market.payload = JSON.parse(body);
                }
                catch (e) {
                    all_market.error = body;
                }
            }
            resp.json(all_market);
        });
    });
    return APIs;
}
exports.coinMarketCap = coinMarketCap;
const APIs = [
    {
        api: '/api/marketcap/ticker',
        cache: '5 minutes',
        function: "updateAllMarket"
    },
    {
        api: "/api/marketcap/all-coins",
        cache: '1 day',
        function: ""
    },
    {
        api: "/api/marketcap/gainers-losers",
        cache: '1 day',
        function: ""
    }
];
