/**
 * Created by Vlad on 7/17/2017.
 */
import {Application, Response, Request} from "express";
import * as request from 'request';
import * as crypto from 'crypto';
import * as apicache from 'apicache';
let cache = apicache.middleware;
const qs     = require('qs');

export function initBittrex(app:Application){


  let hash_hmac = function (text, apisecret) {
    return crypto
      .createHmac('sha512', apisecret)
      .update(text)
      .digest('hex');

  };


  APIs.forEach(function (item) {
    app.get(item.api, cache(item.cache), function (req: Request, resp: Response) {
      console.log(req.params);

      let params:string = qs.stringify(req.params);

      //let body = req.params;
      console.log(params);

      let url =  item.url+params;


      console.log(url);

      let options = {
        url:url,
        headers: {
          'User-Agent': 'request'
        }
      };

      request(options).pipe(resp);
    });
  });


  app.post("/api/bittrex/private", cache('1 hour'),function (req: Request, resp: Response) {

    let url = req.body.uri;
    let signed = req.body.signed;

   // console.log(url, signed);



      var options = {
      url:url,
      headers: {
        'User-Agent': 'request',
        'apisign':signed
      }
    };

    request(options).pipe(resp);
  })





return APIs;
}




const APIs=[
  {
    api:'/api/bittrex/markets',
    url:'https://bittrex.com/api/v1.1/public/getmarkets',
    name:'markets',
    cache:'1 hour'
  },
  {
    api:'/api/bittrex/marketsummaries',
    url:'https://bittrex.com/api/v1.1/public/getmarketsummaries',
    name:'recent trades ',
    cache:'1 hour'
  },
  {
    api:'/api/bittrex/currencies',
    url:'https://bittrex.com/api/v1.1/public/getcurrencies',
    name:'markets',
    cache:'1 hour'
  },
  {
    api:'/api/bittrex/market/:market',
    url:'https://bittrex.com/api/v1.1/public/getmarketsummary?',
    name:'recent trades ',
    cache:'10 minutes'
  },
  {
    api:'/api/bittrex/getmarkethistory/:market',
    url:'https://bittrex.com/api/v1.1/public/getmarkethistory?',
    name:'recent trades ',
    cache:'10 minutes'
  },
  {
    api:'/api/bittrex/getorderbook/:market/:depth',
    url:'https://bittrex.com/api/v1.1/public/getorderbook?market={{market}}&type=both&depth={{depth}}',
    name:'recent trades ',
    cache:'10 minutes'
  }

];
