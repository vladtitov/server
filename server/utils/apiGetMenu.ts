/**
 * Created by Vlad on 4/6/2017.
 */
import {Request, Response} from 'express';

import * as fs from 'fs';

export function apiGetMenu(req:Request,respond:Response){


  fs.readFile('server/pub/menu.json',function (err,data){
    if(err)  respond.send(err);
    else respond.send(data);
  });
}