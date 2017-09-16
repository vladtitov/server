
import {Request, Response} from "express";
import * as _ from "lodash";
import {onError} from "../utils/com";
import {onSuccess} from "../utils/com";
//import {findAllPosts} from '../queries/findAllPosts';
import {PostModel} from '../model/model';


export function apiGetAllPosts(req:any, res: Response): void {

 // console.log(req.decoded);
  let userId = req.decoded.userId;
  console.log('userId  '+ userId);
    PostModel.findAll({
   //  order: ['seqNo']
      where:{userId:userId}
   })
   .then((res:any[]) => {
     return res.map(function ({id, description}) {
       return {id, description};
     })
     })
      .then(_.partial(onSuccess,res))
      .catch(_.partial(onError, res, "Find All Posts Failed"));
    /*
      findAllPosts()
        .then(_.partial(onSuccess,res))
        .catch(_.partial(onError, res, "Find All Posts Failed"));
  */
}

