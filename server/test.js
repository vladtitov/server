"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const request = require("request");
const qs = require('qs');
const apicache = require("apicache");
const path = require("path");
let cache = apicache.middleware;
let url = 'https://api.coinmarketcap.com/v1/ticker/';
let all_market = {};
console.log(url);
request.get(url, function (err, r, body) {
    if (err) {
        console.error(' error from  ' + url, err);
    }
    else {
        let data = JSON.parse(body);
        icons = data.map(function (item) {
            return item.id;
        });
        console.log(icons.length);
        setTimeout(downloadNext, 1000);
    }
});
let icons;
let i = 0;
let downloadNext = function () {
    if (i >= icons.length) {
        console.log('DONE');
        return;
    }
    console.log(i);
    let id = icons[i++];
    console.log(id);
    let url = 'https://files.coinmarketcap.com/static/img/coins/128x128/{{id}}.png';
    let filePath = '../pub/img/icons/{{id}}.png';
    download(url.replace('{{id}}', id), filePath.replace('{{id}}', id), function () {
        setTimeout(downloadNext, 1000);
    });
};
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri)
            .pipe(fs.createWriteStream(path.join(__dirname, filename)))
            .on('close', callback);
    });
};
