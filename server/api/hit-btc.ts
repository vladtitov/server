
/**
 * Created by Vlad on 7/17/2017.
 */
import {Application, Response, Request} from "express";
import * as request from 'request';
import * as apicache from 'apicache';
let cache = apicache.middleware;

export function initHitBTC(app:Application) {

  APIs.forEach(function (item) {
      app.get(item.api, cache(item.cache), function (req: Request, resp: Response) {
        let options = {
          url: item.url
        };

        request(options).pipe(resp);
      });
  });

  return APIs;

}

const APIs=[
  {
    api:'/api/hit-btc/all',
    url:'https://api.hitbtc.com//api/1/public/symbols',
    name:'market',
    cache:'1 hour'
  }
];
