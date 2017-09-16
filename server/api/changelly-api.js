"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
var Changelly = require('../libs/changelly');
var changelly = new Changelly('23c7a086c98b4f07963208522a42cda0', 'c1fe7209b388e0792883a1b3f0c3a6a27d9bb0476f39ca6d8a4329f97084e7dc');
function initChangelly(app) {
    let onRespond = function (resp, err, data) {
        if (err) {
            resp.json({ error: err });
        }
        else {
            resp.json(data.result || data);
        }
    };
    app.get("/api/exchange/changelly/getCurrencies", cache('1 hour'), function (req, resp) {
        changelly.getCurrencies(_.partial(onRespond, resp));
    });
    app.get("/api/exchange/changelly/getMinAmount/:from_to", cache('1 hour'), function (req, resp) {
        let ar = req.params.from_to.split("_");
        changelly.getMinAmount(ar[0], ar[1], _.partial(onRespond, resp));
    });
    app.get("/api/exchange/changelly/getExchangeAmount/:from_to/:amount", cache('1 hour'), function (req, resp) {
        let ar = req.params.from_to.split('_');
        let amount = +req.params.amount;
        changelly.getExchangeAmount(ar[0], ar[1], amount, _.partial(onRespond, resp));
    });
    app.get("/api/exchange/changelly/generateAddress/:from_to/:address", cache('1 hour'), function (req, resp) {
        let ar = req.params.from_to.split('_');
        let address = req.params.address;
        changelly.generateAddress(ar[0], ar[1], address, _.partial(onRespond, resp));
    });
    app.get("/api/exchange/changelly/getTransactions/:currency/:address", cache('1 hour'), function (req, resp) {
        let currency = req.params.currency;
        let address = req.params.address;
        changelly.getTransactions(currency, address, _.partial(onRespond, resp));
    });
    return APIs;
}
exports.initChangelly = initChangelly;
const APIs = [
    {
        api: '/api/exchange/changelly/getCurrencies',
        func: "getMinAmount",
        name: 'market',
        cache: '1 hour',
        args: null
    },
    {
        api: "/api/exchange/changelly/getMinAmount/:from_to",
        func: 'getMinAmount',
        name: 'minimum',
        cache: '1 hour',
        args: function (params) {
            return params.from_to.split('_');
        }
    },
    {
        api: "/api/exchange/changelly/getExchangeAmount/:from_to/:amount",
        func: 'getExchangeAmount',
        name: 'exchange',
        cache: '1 hour',
        args: function (params) {
            let ar = params.from_to.split('_');
            ar.push(+params.amount);
            return ar;
        }
    }
];
