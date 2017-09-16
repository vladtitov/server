/**
 * Created by Vlad on 3/29/2017.
 */
import {Response} from 'express';
const hri = require('human-readable-ids').hri;

export function onSuccess(res:Response, data:any) {
if(data)  res.status(200).json({data:data});
}


export function onError(res:Response,message:string, err:any) {

  console.error("Promise chain error ",message, err);
  res.status(500).send();


}

export function databaseErrorHandler(res:Response, err: any) {
  const id = hri.random();
  console.error("Database error occurred ", id, err);
  res.status(500).json({code: 'ERR-002',
    message: `Error occurred error code ${id}`});
}