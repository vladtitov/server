import * as cheerio from 'cheerio';

import * as request from 'request';
import * as fs from 'fs';

let $;

fs.readFile('CoinMarketCap.html', function (err, body) {


  //console.log(body) // 200
  $ = cheerio.load(body.toString());

  let data = [];

  let id;
  let rows = $('table>tbody').children('tr').each(function (i, row) {
    let $row = $(row);
    let idValue = $row.attr('id');
    if(idValue) id = idValue;
    let  cells = [id];
    $row.children('td').each(function (j, item) {
      let cell = $(item);
      let a = cell.find('a');
      let str = a.length?a.text()+'__'+a.attr('href'):cell.text();
      cells.push(str);
      //console.log(str);
     // if(str.indexOf('DDF') == 0) console.log(topic);

    });
    data.push(cells);
if(i<130) console.log($row.attr('id'));

  })

  console.log(rows.length)
  console.log(data.length)

let fileData = JSON.stringify(data);
  fs.writeFile('exchanges.json',fileData,function (err) {
    console.log(err);
  })

});



let parseTableRows = function ($rows, topic) {
  console.log($rows.length);
  let rows = [];
  $rows.each(function (i, item) {

    let cols =[topic];
    $(item).children('td').each(function (j, item) {

      let cell = $(item);
      let a = cell.find('a');
      let str = a.length?a.text()+'__'+a.attr('href'):cell.text();
      //console.log(str);
      if(str.indexOf('DDF') == 0) console.log(topic);

    });
    console.log(cols);
    rows.push(cols);
  });

  return rows;
  /*let fileData = JSON.stringify(out);
  fs.writeFile('gainers-losers.json',fileData,function (err) {
    console.log(err);
  });*/



}

