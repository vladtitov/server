import {Application, Response, Request} from "express";

import * as request from 'request';
import * as _ from 'lodash';
import * as apicache from 'apicache';
let cache = apicache.middleware;


export function initPoloniex(app: Application) {

  let apis = _.keyBy(APIS, 'name');
  APIS.forEach(function (item) {
    if(item.cache){

      app.get(item.api, cache(item.cache),function (req: Request, resp: Response) {

        request(item.url, function (err, respond, body) {
          if (err) {
            resp.json({error: err});
          } else {
            resp.end(body);

          }
        });
      });
    }else{
      app.route(item.api).get(function (req: Request, resp: Response) {

        request(item.url, function (err, respond, body) {
          if (err) {
            resp.json({error: err});
          } else {
            resp.end(body);

          }
        });
      });
    }


  });

  return APIS;
}


const APIS = [
  {
    name: 'returnTicker',
    api: '/api/poloniex/returnTicker',
    cache:'1 hour',
    url: 'https://poloniex.com/public?command=returnTicker'

  }
]

