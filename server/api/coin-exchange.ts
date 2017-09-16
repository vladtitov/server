import {Application, Response, Request} from "express";

import * as request from 'request';
import * as _ from 'lodash';
import * as apicache from 'apicache';
let cache = apicache.middleware;


export function initCoinExchange(app:Application){

  /*let options = {
    url:'https://www.coinexchange.io/api/v1/getmarkets',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function (err, respond, data) {

    console.log(data)
  });*/

  APIs.forEach(function (item) {

    app.get(item.api, cache(item.cache), function (req: Request, resp: Response) {

     let values = _.values(req.params);

     let url =  item.url+(values.length?'/'+values.join('/'):'');
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

  return APIs;
}




const APIs = [
  {
    name: 'market-names',
    api: '/api/coinexchange/market-names',
    url: 'https://www.coinexchange.io/api/v1/getmarkets',
    cache:'1 hour'

  },
  {
    name: 'market-details',
    api: '/api/coinexchange/market-details',
    url: 'https://www.coinexchange.io/api/v1/getmarketsummaries',
    cache:'1 hour'

  }

];
