import {Application, Response, Request} from "express";

import * as request from 'request';
import * as _ from 'lodash';
import * as apicache from 'apicache';
let cache = apicache.middleware;


export function initCoinbase(app:Application){

  APIs.forEach(function (item) {

    app.get(item.api, cache(item.cache), function (req: Request, resp: Response) {

     let values = _.values(req.params);
     let tail = values.length?values.join(''):'';

     let url =  item.url+tail;
console.log(url);

      let options = {
        url:url
      };

      request(options).pipe(resp);
    });
  });

  return APIs;
}




const APIs = [
  {
    name: 'exchange-rates',
    api: '/api/coinbase/exchange-rates/:id',
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=',
    cache:'1 hour'

  },
  {
    name: 'currencies',
    api: '/api/coinbase/currencies',
    url: 'https://api.coinbase.com/v2/currencies',
    cache:'1 hour'

  }

];
