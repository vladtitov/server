import {Application, Response, Request} from "express";
import * as fs from 'fs';
import * as request from 'request';
const qs     = require('qs');
import * as _ from 'lodash';
import * as apicache from 'apicache';
import * as path from 'path';
let cache = apicache.middleware;

let url = 'https://api.coinmarketcap.com/v1/ticker/';


let all_market:any = {};
console.log(url);

request.get(url,function (err,r,body){
  //let cookies = j.getCookieString(url);
  // if(cookies) cookie_string = cookies;


  if(err){
    console.error(' error from  ' + url, err);
    //console.log(body);
    // console.log(body);
  }else{
    let data = JSON.parse(body);
    icons = data.map(function (item) {
      return item.id;
    })


    console.log(icons.length);
    setTimeout(downloadNext, 1000);

     /*data.forEach(function (item) {
       let id = item.id;
       let url='https://files.coinmarketcap.com/static/img/coins/128x128/{{id}}.png';
       let filePath = '../pub/img/icons/{{id}}.png';

       download(url.replace('{{id}}', id),
         filePath.replace('{{id}}',id), function () {
           console.log(id);
         });


     })*/
    //console.log(cookie_string);




  }


});

let icons:string[];

let i =0;

let downloadNext = function () {
  if(i>=icons.length) {
    console.log('DONE');
    return;
  }
  console.log(i);

  let id = icons[i++];
  console.log(id);

  let url='https://files.coinmarketcap.com/static/img/coins/128x128/{{id}}.png';
  let filePath = '../pub/img/icons/{{id}}.png';


  download(url.replace('{{id}}', id),
    filePath.replace('{{id}}',id), function () {

      setTimeout(downloadNext, 1000);
    });
}





var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri)
      .pipe(fs.createWriteStream(path.join(__dirname, filename)))
      .on('close', callback);
  });
};



/*

download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
  console.log('done');
});
*/
