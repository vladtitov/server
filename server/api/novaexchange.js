"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const apicache = require("apicache");
let cache = apicache.middleware;
function initNovoExchange(app) {
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
exports.initNovoExchange = initNovoExchange;
const APIs = [
    {
        api: '/api/novaexchange/markets',
        url: 'https://novaexchange.com/remote/v2/markets/',
        name: 'market',
        cache: '1 hour'
    }
];
