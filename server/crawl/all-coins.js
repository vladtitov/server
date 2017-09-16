"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
let $;
request('https://coinmarketcap.com/currencies/volume/24-hour/', function (err, r, body) {
    $ = cheerio.load(body);
    let rows = $('table>tbody').children('tr');
    setTimeout(() => parseRows(rows), 200);
});
let processCoin = function (rows) {
    let dataAr = [];
    rows.forEach(function (row, j) {
        row = $(row);
        row.find('a').each(function (i, el) {
            let $el = $(el);
            dataAr.push(i + '__' + $el.attr('href') + '__' + $el.text());
        });
    });
    return dataAr;
};
let parseRows = function (rows) {
    console.log(rows.length);
    let ids = [];
    let coin = [];
    let out = [];
    rows.each(function (i, item) {
        let id = item.attribs.id;
        if (id) {
            ids.push(id);
            if (coin.length) {
                let n = processCoin(coin);
                out.push(n);
            }
            coin = [];
        }
        coin.push(item);
    });
    console.log(ids.length);
    console.log(out.length);
    let fileData = JSON.stringify(out);
    fs.writeFile('all-coins.json', fileData, function (err) {
        console.log(err);
    });
};
