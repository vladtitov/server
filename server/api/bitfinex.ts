import {Application, Response, Request} from "express";

import * as request from 'request';
const qs     = require('qs');
import * as _ from 'lodash';
import * as apicache from 'apicache';
let cache = apicache.middleware;


export function initBitFinrx(app:Application){


  APIs.forEach(function (item) {

    app.get(item.api, cache(item.cache), function (req: Request, resp: Response) {

      let values = _.values(req.params);

      //let body = req.params;
      let url =  item.url+(values.length?'/'+values.join('/'):'');
      console.log(url);

      let options = {
        url:url,
       // method: 'POST',
        //body:qs.stringify(body),
        headers: {
          'User-Agent': 'request'
        }
      };

      request(options).pipe(resp);
    });
  });

  return APIs;
}




const APIs=[
  {
    api:'/api/bitfinex/symbols',
    url:'https://api.bitfinex.com/v1/symbols',
    name:'currencies',
    cache:'1 hour'
  },
  {
    api:'/api/bitfinex/market/:pair',
    url:'https://api.bitfinex.com/v1/pubticker/',
    name:'markets',
    cache:'1 hour'
  }

];