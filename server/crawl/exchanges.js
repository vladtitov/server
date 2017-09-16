"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const fs = require("fs");
let $;
fs.readFile('CoinMarketCap.html', function (err, body) {
    $ = cheerio.load(body.toString());
    let data = [];
    let id;
    let rows = $('table>tbody').children('tr').each(function (i, row) {
        let $row = $(row);
        let idValue = $row.attr('id');
        if (idValue)
            id = idValue;
        let cells = [id];
        $row.children('td').each(function (j, item) {
            let cell = $(item);
            let a = cell.find('a');
            let str = a.length ? a.text() + '__' + a.attr('href') : cell.text();
            cells.push(str);
        });
        data.push(cells);
        if (i < 130)
            console.log($row.attr('id'));
    });
    console.log(rows.length);
    console.log(data.length);
    let fileData = JSON.stringify(data);
    fs.writeFile('exchanges.json', fileData, function (err) {
        console.log(err);
    });
});
let parseTableRows = function ($rows, topic) {
    console.log($rows.length);
    let rows = [];
    $rows.each(function (i, item) {
        let cols = [topic];
        $(item).children('td').each(function (j, item) {
            let cell = $(item);
            let a = cell.find('a');
            let str = a.length ? a.text() + '__' + a.attr('href') : cell.text();
            if (str.indexOf('DDF') == 0)
                console.log(topic);
        });
        console.log(cols);
        rows.push(cols);
    });
    return rows;
};
