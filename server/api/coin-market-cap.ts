
import {Application, Response, Request} from "express";

import * as requestOrig from 'request';
import * as fs from 'fs';
import * as path from 'path';
//var FileCookieStore = require('tough-cookie-filestore');
///var cookie_string = '__cfduid=d637b4b187aea018d48767e06cde771f41501428058';

let request = requestOrig;

import * as apicache from 'apicache';

let cache = apicache.middleware;

let all_market:any ={
  timestamp:0,
  payload:'[]'
};



export function coinMarketCap(app: Application) {

 // setInterval(updateAllMarket, 5*60*1000);
  //updateAllMarket();


  app.get("/api/marketcap/all-coins", cache('1 day'), function (req: Request, resp: Response) {

    fs.readFile(path.join(__dirname, '../data/coins.json'),function (err, dataStr) {
      if(err){
        resp.json({error:'cant read data'});
        return
      }

      let data = JSON.parse(String(dataStr));

      resp.json({payload:data});
    })

  });


  app.get("/api/marketcap/all-exchanges",cache('1 day'), function (req: Request, resp: Response) {

    fs.readFile(path.join(__dirname, '../data/exchanges.json'),function (err, dataStr) {
      if(err){
        resp.json({error:'cant read data'});
        return
      }

      let data = JSON.parse(String(dataStr));

      resp.json({data:data});
    })

  });


    app.get("/api/marketcap/ticker",cache('5 minutes'), function (req: Request, resp: Response) {

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
        // console.log(body);
        //console.log(cookie_string);

        all_market.timestamp = (new Date()).toISOString();
        try{
          all_market.payload = JSON.parse(body);
        }catch (e){
          all_market.error =  body
        }


      }
      resp.json(all_market)

    })




    /*
    updateAllMarket(function (data) {
      res.json(data);
    });*/

  });
  return APIs;
}

const APIs=[
  {
    api:'/api/marketcap/ticker',
    cache:'5 minutes',
    function:"updateAllMarket"
  },
  {
    api:"/api/marketcap/all-coins",
    cache:'1 day',
    function:""
  },
  {
    api:"/api/marketcap/gainers-losers",
    cache:'1 day',
    function:""
  }
]