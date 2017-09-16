
import {Request, Response} from "express";
import * as crypto from 'crypto';
//const hri = require('human-readable-ids').hri;

const algorithmCTR = 'aes-256-ctr',
  algorithmGSM= 'aes-256-gcm',
  PASSWORD = '3zTvzr3p67VC61jmV54rIYu1545x4TlY'
export const EXPIRATION_TIME:number = 180;


export function encryptCustom(email, password):string{
  let n = password.length+'';
  if(n.length==1)n='0'+n;
  return n+password+email;
}

export function decryptCustom(url:string):{email:string, password:string}{
  let index = +url.substr(0,2);
  if(isNaN(index)) return null;
    url = url.substr(2);

  let email = url.substr(index);
  let password = url.substr(0, index);
  return {
    email:email,
    password:password
  }
}

export function encryptCTR(text){
  var cipher = crypto.createCipher(algorithmCTR, PASSWORD)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}


export function decryptCTR(text){
  var decipher = crypto.createDecipher(algorithmCTR,PASSWORD);
  var dec;
  try{
   dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
  }catch(e){
    console.error(e);
  }

  return dec;
}

let ips = {};

export function checkIp(req:Request, max:number){

let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if(!ips[ip]) ips[ip] = 0;
  ips[ip] ++;
  if(ips[ip] > max) {

    setTimeout(() => {
      ips[ip] = 0;
    }, 60000);

    return null;
  }
 return ip;
}