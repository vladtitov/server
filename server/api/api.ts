
import {Application} from "express";
import {apiGetAllPosts} from '../archive/apiGetAllPosts';
import {apiLogin} from './apiLogin';
import {apiGetMenu} from '../utils/apiGetMenu';
import * as fs from 'fs';
import * as path from 'path';


export function initRestApi(app: Application ): void {

  app.route("/api/app-config").get(function (req, res) {
    res.sendFile(path.join(__dirname, '../../pub', 'app-config.json'));


  });
  app.route("/api/posts").get(apiGetAllPosts);
  app.route("/api/menu/:stamp").get(apiGetMenu);

}

