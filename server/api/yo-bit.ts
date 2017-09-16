import {Application, Response, Request} from "express";
import * as request from 'request';
import * as _ from 'lodash';
import * as apicache from 'apicache';
let cache = apicache.middleware;

export function initYoBit(app:Application) {

  APIs.forEach(function (item) {
    if(item.cache){
      app.get(item.api,
        cache(item.cache),
        function (req: Request, resp: Response) {
       // console.log(req.params);
        let values = _.values(req.params);
        //console.log(values);
         let url= item.url+ (values.length?'/'+values.join('/'):'');
        console.log(url);
        let options = {
          url: url
        };
        request(options).pipe(resp);
      });

    }else{

      app.route(item.api).get(function (req: Request, resp: Response) {
        let values = _.values(req.params);

        let url =  item.url+values.length?'/'+values.join('/'):'';
        console.log(url);
        let options = {
          url: url
        };
        request(options).pipe(resp);
      });

    }

  });

  return APIs;

}

const APIs=[
  {
    api:'/api/yo-bit/currencies',
    url:'https://yobit.net/api/3/info',
    name:'market',
    cache:'1 hour'
  },
  {
    api:'/api/yo-bit/market/:pair',
    url:'https://yobit.net/api/3/ticker/',
    name:'market',
    cache:'1 hour'
  }
];
