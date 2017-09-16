
/**
 * Created by Vlad on 3/29/2017.
 */

import {Application, Request, Response} from "express";
import * as _ from "lodash";
const uuidV1 = require('uuid/v1');
const uuidV4 = require('uuid/v4');
import {UserModel, VOUser} from '../model/model';
//import {onError, onSuccess} from './com';
//import * as JWT from "jsonwebtoken";
import * as request from 'request';
import * as crypto from 'crypto';
import {checkIp, decryptCTR, decryptCustom, encryptCTR, encryptCustom} from '../utils/app-utils';

const hri = require('human-readable-ids').hri;


let confirmIps ={};

export function initLogin(app:Application){

  app.route("/api/login/reset-password-confirm/").post(function (req: Request, resp: Response) {
    let ip = checkIp(req, 100);

    if(!ip){
      resp.json({error: 'annoying'});
      return;
    }


    //let email = req.body.email;
    let password = req.body.password;
    //let emailE = encryptCTR(email);
    let passwordE = encryptCTR(password);
    let uid = req.body.uid;
    let user = decryptCustom(uid);

    //if(user.email !== emailE){
    //  resp.json({error:'email'});
    //  return
   // };

    UserModel.findOne({where: user})
      .then(function (user2:VOUser) {
        if (user2) {
          updateLastVisitByid(user2.id,{password:passwordE,status:'newpassword'})
            .then(function (res) {
              resp.json({
                success:'password',
                user:{
                  nickname:user2.nickname
                }
              })
            });

        }else{
          resp.json({ error:'nouser'})
        }
      })

  });


  app.route("/api/login/reset-password").post(function (req: Request, resp: Response) {
    let ip = checkIp(req, 100);

    if(!ip){
      resp.json({error: 'annoying'});
      return;
    }
    let email = req.body.email;
    let emailE = encryptCTR(email);
    let host = req.get('host');
    let confirmUrl =  req.protocol + '://' + req.get('host')  + '/#/confirm-reset-password/';

    UserModel.findOne({where: {email:emailE}})
      .then(function (result:any) {

        if (result) {
          confirmUrl = confirmUrl+encryptCustom(emailE,result.password);
          let nickname = result.nicknamel

          sendResetPasswordEmail(email, host, confirmUrl, nickname, function (error) {

            if(error){
              resp.json({error:'email send error',
                user:{nickname:result.nickname, email:email}})
            }else {


              updateLastVisitByid(result.id, {status:'reset-sent'}).then(function () {
                resp.json({
                  success:'reset-sent',
                  user:{
                    email:email,
                    nickname:nickname
                  }});
              })
            }

          } )

        } else {

          resp.json({error:'wrong'});

        }
      })
    //resp.json({success: 'OK'});
  });


  app.route("/api/login/login").post(function (req: Request, resp: Response) {

    let ip = checkIp(req, 100);

    if(!ip){
      resp.json({error: 'annoying'});
      return;
    }

    let email = req.body.email;
    let password = req.body.password;
    let deviceid = req.headers['user-agent'];




    let user = {
      email:encryptCTR(email),
      password:encryptCTR(password),
      deviceid:deviceid
    }


    UserModel.findOne({where: {email: user.email, password:user.password }})
      .then(function (user2:VOUser) {
        if (user2) {
          if(user2.confirmed){
            resp.json({success:'logedin',user:{
              token:encryptCTR(user2.uid),
              nickname:user2.nickname,
              email:decryptCTR(user2.email),
              role:user2.role
            }})


            updateLastVisitByid(user2.id,{status:'logedin'});
          }else{

            let confirmUrl =  req.protocol + '://' + req.get('host')  + '/#/login-confirm/';
            confirmUrl = confirmUrl+encryptCustom(user2.email, user2.password);
            let host =  req.get('host');

            sendConfirmationEmail(email, host, confirmUrl, user2,function (error) {
              // console.log(error);
              if (error) {
                resp.json({error: 'sendemail', message: 'Error sending email. Please try again later'});
                console.error(error);
                return;
              };
              resp.json({
              error:'verification',
              message:'Email was sent to '+decryptCTR(user2.email)+'. Please ckick on a link "Confirm Registration" in email body'
            })

            });

            updateLastVisitByid(user2.id,{status:'verification-required'});
            /*resp.json({
              error:'verification',
              message:'Email was sent to '+decryptCTR(user2.email)+'. Please ckick on a link "Confirm Registration" in email body'
            })*/

          }

        } else {

          resp.json({error:'wrong'});

        }
      })
  })

  app.route("/api/login/register").post(function (req: Request, resp: Response) {

    let ip = checkIp(req, 60);

    if(!ip){
      resp.json({error: 'annoying'});
      return;
    }


    let email = req.body.email;
    let password = req.body.password;
    let deviceid = req.headers['user-agent'];



    let host =  req.get('host');

    let passE = encryptCTR(password);
    let emailE= encryptCTR(email);


    let user = {
      email:emailE,
      password:passE,
      deviceid:deviceid,
      nickname:hri.random(),
      uid:uuidV1()
    }

   // console.log(user);
    UserModel.findOne({where: {email: user.email}})
      .then(function (result:VOUser) {
        if (result) {

          if(result.confirmed){
            resp.json({error:'exists'});
          }else resp.json({
            error:'need-confirm',
            message:'Email was sent to '+decryptCTR(result.email)+'.  Please ckick on a link "Confirm Registration" in email body'});

          return;
        }

        createUser(user).then(function (result:any) {
          let user2:VOUser = result.get({ plain: true});

          console.log(user2)
          if(!user2 || !user2.uid){
            console.error('error create user ' +JSON.stringify(user));
            resp.json({error:'dberror', message:'Database error. Please try again later'});
            return
          }


          updateLastVisitByid(user2.id, {status:'created'});

          let confirmUrl =  req.protocol + '://' + req.get('host')  + '/#/login-confirm/';
          confirmUrl = confirmUrl+encryptCustom(emailE,passE);

          sendConfirmationEmail(email, host, confirmUrl, user2,function (error) {
           // console.log(error);
            if(error) {
              UserModel.destroy({where:{id:user2.id}});
              resp.json({error:'sendemail', message:'Error sending email. Please try again later'});
              console.error('ERROR send confirmation email ' + error);
              return;
            }


            updateLastVisitByid(user2.id, {status:'confirmation sent'});
            resp.json({
              success:'confirmation sent',
              user: {
                email:email,
                nickname:user2.nickname
              }});
          });

        });
      });
  })


  app.route("/api/login/confirm/:uid").get(function (req: Request, resp: Response) {
    let uid = req.params.uid;
    console.log(uid);

  // uid = decryptCTR(uid);
    if(!uid){
      resp.end('hacker');
      return;
    }

    let ip = checkIp(req, 100);

    if(!ip){
      resp.json({error: 'annoying'});
      return;
    }

    let user = decryptCustom(uid);

    console.log(user);
    console.log(ip);


    UserModel.findOne({where: {email: user.email, password:user.password}})
      .then(function (result:any) {

        let user2:VOUser  = result.get({plain:true});
        if(user2){
          if(user2.confirmed){
            resp.json({success:'confirmed-before', user:{nickname:user2.nickname}});
          }else{

            updateLastVisitByid(user2.id, {status:'confirmed', confirmed: 1 }).then(function () {
              resp.json({success:'confirmed', user:{
                nickname:user2.nickname
                //email:decryptCTR(user2.email)
              }});
            });
          }


        }else{
          resp.json({error:'Now are you'});
        }


      })

  })

}






function updateLastVisitByid(id:number, user:VOUser){

  user.lastVisit = Date.now();


  return UserModel.update(user ,{where:{id:id}})
    .then(function (result) {
      console.log(result)

    })

}

let user ={
  confirmed:1,
  email:'vladstitov@gmail.com',
  uid:'4476d200-6f1a-11e7-b958-a3fb439b8f27'
  //uid:'qazxsw'
}

//updateUserByUid(user);





function createUser(user:VOUser){
  return UserModel.create(user)
}




function sendResetPasswordEmail(
  email,
                                host:string,
                                confirmUrl:string,
                                nickname:string,
                                callBack:Function
){



  let message = 'Hello ' + nickname +
    '. <br/> You are requested reset password at  '+ host +'. <br/>'+
    '<p>Click link below <br/>'+
    '<h2><a href="'+confirmUrl+
    '">Re Register</a></h2></p><br/>' +
    '<p><b>Note: this link is valid within 24h since you requested</b> <br/>';


  let body ={
    user:'uplight.ca@gmail.com',
    pass:'uplight.ca@gmail.com',
    subject:'Reset password form '+host,
    message:message,
    to:email
  };


  let options ={
    url:'http://callcenter.front-desk.ca/send-email.php',
    method:'POST',
    body:JSON.stringify(body)
  };

  console.log('sendConfirmationEmail ',options);
  request(options, function (error, object, data) {
    console.log('sendConfirmationEmail  result ',data);
    if(error) callBack(error)
    else{
      let result
      try{
        result = JSON.parse(data);

      }catch (e){
        callBack(e);
      }
      if(result.success) callBack();
    }

  })

}



function sendConfirmationEmail(email, host:string, confirmUrl:string, user, callBack:Function){



  let message = 'Hello ' + user.nickname +
    '. <br/> You have registered at  '+host+'. <br/>'+
    '<p>To finalize registration please click link below <br/>'+
    '<h2><a href="'+confirmUrl+
    '">Confirm Registration</a></h2></p><br/>' +
    '<p><b>Note: this link is valid within 24h since you are registered</b> <br/>'+
    'Registration is free and does not contains any contracts </p>'



  let body ={
    user:'uplight.ca@gmail.com',
    pass:'uplight.ca@gmail.com',
    subject:'Email Verification form '+host,
    message:message,
    to:email
  };


  let options ={
    url:'http://callcenter.front-desk.ca/send-email.php',
    method:'POST',
    body:JSON.stringify(body)
  };

  console.log('sendConfirmationEmail ',options);
 request(options, function (error, object, data) {
   console.log('sendConfirmationEmail  result ',data);
   if(error) callBack(error)
   else{
     let result
     try{
       result = JSON.parse(data);

     }catch (e){
       callBack(e);
     }
     if(result.success) callBack();
   }

 })

}


/*



function checkUser(password:string, respond:Response, user:any){

  if (_.isNull(user)){
    respond.status(404).send({error: 'User does not exist'});
    return null
  }

  // console.log(user.password,password);

  if(_.isMatch(user, {password:password}))  return user;
  respond.status(403).send({err:'password not match'});
  return null;
}

export function apiLogin(req: Request, respond: Response): void {
 // let  email:string = 'uplight.ca@gmail.com' , password:string = '$2a$10$Op3rW9gYT6uXDlAOrmRsHOheTy6jwwDamZONx.apHaQjzmqj8Tiem';
 // console.log(req.body)
  let params:any = _.pick(req.body, 'username', 'password', 'deviceId');

  if (!params.username || !params.password || !params.deviceId) {
    respond.status(400).send({error: 'username, password, and deviceId  are required parameters'});
    return
  }



  let password =  crypto.createHash('md5').update(params.password).digest("hex");

 // console.log(password);

  let user = UserModel.findOne({where:{ email:params.username}})
    .then(_.partial(checkUser, password, respond))
    .then(_.partial(generateToken, respond))
    //.then(res=>})
    .then(_.partial(onSuccess, respond))
    .catch(_.partial(onError, respond, "Login Failed"));
}


export function selectAll(){
  return   UserModel.findAll({where:{id:1}}).then(function (record) {
    console.log(record)
  })
}


export function checkUser(password:string, respond:Response, user:any){

  if (_.isNull(user)){
    respond.status(404).send({error: 'User does not exist'});
    return null
  }

  // console.log(user.password,password);

  if(_.isMatch(user, {password:password}))  return user;
  respond.status(403).send({err:'password not match'});
  return null;
}

export function generateToken(respond:Response, user:any):string{
  if(!user) return '';
  let token:any ={}
  token.userId = user.id;
  token.id = uuidV4();
  token.iat =  Math.floor(new Date().getTime()/1000);
  token.exp = token.iat + EXPIRATION_TIME;
  let t = JWT.sign(token, MY_SECRET);
 // respond.header('x-access-token', t);
  respond.cookie('token', t, { maxAge: 86400 });
  return  t;
}

/!*
export function readToken(token:string ):any{
  return JWT.verify(token, MY_SECRET,function (err, decoded) {
    console.log(err);
  });
}
*!/

export function verifyLogin(req:any, res:Response, next:Function):void{
  let token = req.body.token || req.query.token || req.headers.authorization?req.headers.authorization.replace('Bearer ',''):'';//req.headers['x-access-token'];
 // console.log('token '+ token);
  if (token) {
    JWT.verify(token, MY_SECRET, function(err:any, decoded:any) {
      console.log(new Date().toLocaleString());
     console.log(err, decoded);
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {

        req.decoded = decoded;

        next();
      }
    });

  } else {
    res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}
*/


