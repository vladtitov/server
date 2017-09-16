"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initYoBit(app) {
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
exports.initYoBit = initYoBit;
const APIs = [
    {
        api: '/api/yo-bit/currencies',
        url: 'https://yobit.net/api/3/info',
        name: 'market',
        cache: '1 hour'
    },
    {
        api: '/api/yo-bit/market/:pair',
        url: 'https://yobit.net/api/3/ticker/',
        name: 'market',
        cache: '1 hour'
    }
];
