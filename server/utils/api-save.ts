/**
 * Created by Vlad on 7/16/2017.
 */
import {Application, Response, Request} from "express";
import * as fs from 'fs';
import * as path from 'path'

export function apiSave(app:Application){

  app.route("/api/wallet/save").post(function (req: Request, res: Response) {

    console.log(req.body)

    let email = req.body.email;
    let payload = req.body.payload;

    let filename = email.replace('@','-').replace('.','_');

    fs.writeFile(path.join(__dirname, '../data/'+filename+'.dat'),payload, function (err) {
      console.log(arguments)
      if(err) res.json({error:'Error write file'})
      else res.json({success:'saved'});
    })

  })

  app.route("/api/wallet/get/:email").post(function (req: Request, res: Response) {

    let email = req.body.email;
    console.log(email);

    let filename = email.replace('@','-').replace('.','_');
    console.log(filename);

    fs.readFile(path.join(__dirname, '../data/'+filename+'.dat'), 'utf8', function (err,  data) {

      if(err) res.json({error:err})
      else res.json({success:'success', payload:data})
    })


  })


}